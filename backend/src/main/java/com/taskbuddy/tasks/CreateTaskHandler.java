package com.taskbuddy.tasks;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskbuddy.model.Task;
import com.taskbuddy.util.ApiGatewayResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;
import software.amazon.awssdk.services.sqs.SqsClient;
import software.amazon.awssdk.services.sqs.model.SendMessageRequest;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class CreateTaskHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
    private static final Logger logger = LoggerFactory.getLogger(CreateTaskHandler.class);
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private final DynamoDbClient dynamoDbClient;
    private final SqsClient sqsClient;
    private final String tasksTableName;
    private final String notificationQueueUrl;

    public CreateTaskHandler() {
        this.dynamoDbClient = DynamoDbClient.create();
        this.sqsClient = SqsClient.create();
        this.tasksTableName = System.getenv("TASKS_TABLE_NAME");
        this.notificationQueueUrl = System.getenv("NOTIFICATION_QUEUE_URL");
    }

    @Override
    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent input, Context context) {
        try {
            // Parse request body
            Task task = objectMapper.readValue(input.getBody(), Task.class);
            
            // Validate required fields
            if (task.getTitle() == null || task.getPriority() == null) {
                return ApiGatewayResponse.error(400, "Missing required fields: title or priority");
            }
            
            // Set default values
            task.setTaskId(UUID.randomUUID().toString());
            task.setStatus("pending");
            task.setCreatedAt(Instant.now().toString());
            task.setUpdatedAt(Instant.now().toString());
            
            // Get admin user ID from request context
            Map<String, Object> authorizer = input.getRequestContext().getAuthorizer();
            if (authorizer != null && authorizer.containsKey("claims")) {
                @SuppressWarnings("unchecked")
                Map<String, String> claims = (Map<String, String>) authorizer.get("claims");
                task.setAssignedBy(claims.get("sub"));
            }
            
            // Save task to DynamoDB
            saveTaskToDynamoDB(task);
            
            // Send notification if task is assigned to a user
            if (task.getAssignedTo() != null && !task.getAssignedTo().isEmpty()) {
                sendTaskAssignmentNotification(task);
            }
            
            // Return success response
            return ApiGatewayResponse.created(objectMapper.writeValueAsString(task));
            
        } catch (Exception e) {
            logger.error("Error creating task", e);
            return ApiGatewayResponse.error(500, "Error creating task: " + e.getMessage());
        }
    }
    
    private void saveTaskToDynamoDB(Task task) {
        Map<String, AttributeValue> item = new HashMap<>();
        item.put("taskId", AttributeValue.builder().s(task.getTaskId()).build());
        item.put("title", AttributeValue.builder().s(task.getTitle()).build());
        item.put("status", AttributeValue.builder().s(task.getStatus()).build());
        item.put("priority", AttributeValue.builder().s(task.getPriority()).build());
        item.put("createdAt", AttributeValue.builder().s(task.getCreatedAt()).build());
        item.put("updatedAt", AttributeValue.builder().s(task.getUpdatedAt()).build());
        
        if (task.getDescription() != null) {
            item.put("description", AttributeValue.builder().s(task.getDescription()).build());
        }
        
        if (task.getAssignedBy() != null) {
            item.put("assignedBy", AttributeValue.builder().s(task.getAssignedBy()).build());
        }
        
        if (task.getAssignedTo() != null) {
            item.put("assignedTo", AttributeValue.builder().s(task.getAssignedTo()).build());
        }
        
        if (task.getDueDate() != null) {
            item.put("dueDate", AttributeValue.builder().s(task.getDueDate()).build());
        }
        
        if (task.getCategory() != null) {
            item.put("category", AttributeValue.builder().s(task.getCategory()).build());
        }
        
        if (task.getEstimatedHours() != null) {
            item.put("estimatedHours", AttributeValue.builder().n(task.getEstimatedHours().toString()).build());
        }
        
        PutItemRequest putItemRequest = PutItemRequest.builder()
                .tableName(tasksTableName)
                .item(item)
                .build();
        
        dynamoDbClient.putItem(putItemRequest);
    }
    
    private void sendTaskAssignmentNotification(Task task) {
        try {
            Map<String, Object> notification = new HashMap<>();
            notification.put("type", "NEW_TASK");
            notification.put("taskId", task.getTaskId());
            notification.put("title", task.getTitle());
            notification.put("assignedTo", task.getAssignedTo());
            
            String messageBody = objectMapper.writeValueAsString(notification);
            
            SendMessageRequest sendMessageRequest = SendMessageRequest.builder()
                    .queueUrl(notificationQueueUrl)
                    .messageBody(messageBody)
                    .build();
            
            sqsClient.sendMessage(sendMessageRequest);
            logger.info("Task assignment notification sent for task: {}", task.getTaskId());
        } catch (Exception e) {
            logger.error("Error sending task assignment notification", e);
        }
    }
}