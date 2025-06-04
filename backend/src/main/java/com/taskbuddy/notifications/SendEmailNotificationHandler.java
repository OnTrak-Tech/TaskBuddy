package com.taskbuddy.notifications;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.SQSEvent;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.GetItemRequest;
import software.amazon.awssdk.services.dynamodb.model.GetItemResponse;
import software.amazon.awssdk.services.ses.SesClient;
import software.amazon.awssdk.services.ses.model.Body;
import software.amazon.awssdk.services.ses.model.Content;
import software.amazon.awssdk.services.ses.model.Destination;
import software.amazon.awssdk.services.ses.model.Message;
import software.amazon.awssdk.services.ses.model.SendEmailRequest;

import java.util.HashMap;
import java.util.Map;

public class SendEmailNotificationHandler implements RequestHandler<SQSEvent, Void> {
    private static final Logger logger = LoggerFactory.getLogger(SendEmailNotificationHandler.class);
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private final DynamoDbClient dynamoDbClient;
    private final SesClient sesClient;
    private final String usersTableName;
    private final String fromEmail;

    public SendEmailNotificationHandler() {
        this.dynamoDbClient = DynamoDbClient.create();
        this.sesClient = SesClient.create();
        this.usersTableName = System.getenv("USERS_TABLE_NAME");
        this.fromEmail = "kwesijay8@gmail.com"; // Hardcoded sender email
    }

    @Override
    public Void handleRequest(SQSEvent event, Context context) {
        for (SQSEvent.SQSMessage message : event.getRecords()) {
            try {
                JsonNode payload = objectMapper.readTree(message.getBody());
                String notificationType = payload.get("type").asText();
                
                switch (notificationType) {
                    case "NEW_USER":
                        handleNewUserNotification(payload);
                        break;
                    case "NEW_TASK":
                        handleNewTaskNotification(payload);
                        break;
                    default:
                        logger.warn("Unknown notification type: {}", notificationType);
                }
            } catch (Exception e) {
                logger.error("Error processing notification", e);
            }
        }
        return null;
    }
    
    private void handleNewUserNotification(JsonNode payload) throws Exception {
        String email = payload.get("email").asText();
        String name = payload.get("name").asText();
        String tempPassword = payload.get("tempPassword").asText();
        
        String subject = "Welcome to TaskBuddy - Your Account Details";
        String htmlBody = String.format(
            "<html><body>" +
            "<h2>Welcome to TaskBuddy, %s!</h2>" +
            "<p>Your account has been created. Here are your login details:</p>" +
            "<p><strong>Username:</strong> %s</p>" +
            "<p><strong>Temporary Password:</strong> %s</p>" +
            "<p>Please log in and change your password as soon as possible.</p>" +
            "<p>Best regards,<br>The TaskBuddy Team</p>" +
            "</body></html>",
            name, email, tempPassword
        );
        
        sendEmail(email, subject, htmlBody);
    }
    
    private void handleNewTaskNotification(JsonNode payload) throws Exception {
        String taskId = payload.get("taskId").asText();
        String title = payload.get("title").asText();
        String assignedToId = payload.get("assignedTo").asText();
        
        // Get user details from DynamoDB
        Map<String, AttributeValue> key = new HashMap<>();
        key.put("userId", AttributeValue.builder().s(assignedToId).build());
        
        GetItemRequest request = GetItemRequest.builder()
            .tableName(usersTableName)
            .key(key)
            .build();
        
        GetItemResponse response = dynamoDbClient.getItem(request);
        
        if (!response.hasItem()) {
            logger.error("User not found: {}", assignedToId);
            return;
        }
        
        String email = response.item().get("email").s();
        String name = response.item().get("name").s();
        
        String subject = "New Task Assigned to You: " + title;
        String htmlBody = String.format(
            "<html><body>" +
            "<h2>Hello %s,</h2>" +
            "<p>A new task has been assigned to you:</p>" +
            "<p><strong>Task:</strong> %s</p>" +
            "<p>Please log in to TaskBuddy to view the details and start working on it.</p>" +
            "<p>Best regards,<br>The TaskBuddy Team</p>" +
            "</body></html>",
            name, title
        );
        
        sendEmail(email, subject, htmlBody);
    }
    
    private void sendEmail(String toEmail, String subject, String htmlBody) {
        try {
            Destination destination = Destination.builder()
                .toAddresses(toEmail)
                .build();
            
            Content subjectContent = Content.builder()
                .data(subject)
                .build();
            
            Content htmlContent = Content.builder()
                .data(htmlBody)
                .build();
            
            Body body = Body.builder()
                .html(htmlContent)
                .build();
            
            Message message = Message.builder()
                .subject(subjectContent)
                .body(body)
                .build();
            
            SendEmailRequest emailRequest = SendEmailRequest.builder()
                .source(fromEmail)
                .destination(destination)
                .message(message)
                .build();
            
            sesClient.sendEmail(emailRequest);
            logger.info("Email sent successfully to {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send email to {}", toEmail, e);
        }
    }
}