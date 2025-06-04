package com.taskbuddy.tasks;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskbuddy.model.Task;
import com.taskbuddy.util.ApiGatewayResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.*;
import software.amazon.awssdk.services.sqs.SqsClient;
import software.amazon.awssdk.services.sqs.model.SendMessageRequest;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

public class UpdateTaskHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
    private static final Logger logger = LoggerFactory.getLogger(UpdateTaskHandler.class);
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private final DynamoDbClient dynamoDbClient;
    private final SqsClient sqsClient;
    private final String tasksTableName;
    private final String notificationQueueUrl;

    public UpdateTaskHandler() {
        this.dynamoDbClient = DynamoDbClient.create();
        this.sqsClient = SqsClient.create();
        this.tasksTableName = System.getenv("TASKS_TABLE_NAME");
        this.notificationQueueUrl = System.getenv("NOTIFICATION_QUEUE_URL");
    }

    @Override
    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent input, Context context) {
        try {
            // Get task ID from path parameters
            String taskId = input.getPathParameters().get("id");
            
            // Parse request body
            JsonNode requestBody = objectMapper.readTree(input.getBody());
            
            // Get existing task
            Task existingTask = getTask(taskId);
            if (existingTask == null) {
                return ApiGatewayResponse.error(404, "Task not found");
            }
            
            // Update task fields
            Map<String, AttributeValue> expressionAttributeValues = new HashMap<>();
            StringBuilder updateExpression = new StringBuilder("SET updatedAt = :updatedAt");
            expressionAttributeValues.put(":updatedAt", AttributeValue.builder().s(Instant.now().toString()).build());
            
            // Check if status is being updated
            if (requestBody.has("status")) {
                String newStatus = requestBody.get("status").asText();
                updateExpression.append(", #status = :status");
                expressionAttributeValues.put(":status", AttributeValue.builder().s(newStatus).build());
            }
            
            // Check if assignedTo is being updated
            boolean assignedToChanged = false;
            String newAssignedTo = null;
            if (requestBody.has("assignedTo")) {
                newAssignedTo = requestBody.get("assignedTo").asText();
                if (!newAssignedTo.equals(existingTask.getAssignedTo())) {
                    assignedToChanged = true;
                    updateExpression.append(", assignedTo = :assignedTo");
                    expressionAttributeValues.put(":assignedTo", AttributeValue.builder().s(newAssignedTo).build());
                }
            }
            
            // Update other fields as needed
            if (requestBody.has("priority")) {
                updateExpression.append(", priority = :priority");
                expressionAttributeValues.put(":priority", AttributeValue.builder().s(requestBody.get("priority").asText()).build());
            }
            
            if (requestBody.has("dueDate")) {
                updateExpression.append(", dueDate = :dueDate");
                expressionAttributeValues.put(":dueDate", AttributeValue.builder().s(requestBody.get("dueDate").asText()).build());
            }
            
            // Update task in DynamoDB
            Map<String, String> expressionAttributeNames = new HashMap<>();
            expressionAttributeNames.put("#status", "status"); // status is a reserved word in DynamoDB
            
            UpdateItemRequest updateItemRequest = UpdateItemRequest.builder()
                    .tableName(tasksTableName)
                    .key(Map.of("taskId", AttributeValue.builder().s(taskId).build()))
                    .updateExpression(updateExpression.toString())
                    .expressionAttributeValues(expressionAttributeValues)
                    .expressionAttributeNames(expressionAttributeNames)
                    .returnValues(ReturnValue.ALL_NEW)
                    .build();
            
            UpdateItemResponse response = dynamoDbClient.updateItem(updateItemRequest);
            
            // Convert response to Task object
            Map<String, AttributeValue> updatedItem = response.attributes();
            Task updatedTask = mapToTask(updatedItem);
            
            // Send notification if task was assigned to a new user
            if (assignedToChanged && newAssignedTo != null && !newAssignedTo.isEmpty()) {
                sendTaskAssignmentNotification(updatedTask);
            }
            
            // Return success response
            return ApiGatewayResponse.success(objectMapper.writeValueAsString(updatedTask));
            
        } catch (Exception e) {
            logger.error("Error updating task", e);
            return ApiGatewayResponse.error(500, "Error updating task: " + e.getMessage());
        }
    }
    
    private Task getTask(String taskId) {
        try {
            GetItemRequest getItemRequest = GetItemRequest.builder()
                    .tableName(tasksTableName)
                    .key(Map.of("taskId", AttributeValue.builder().s(taskId).build()))
                    .build();
            
            GetItemResponse response = dynamoDbClient.getItem(getItemRequest);
            
            if (!response.hasItem()) {
                return null;
            }
            
            return mapToTask(response.item());
        } catch (Exception e) {
            logger.error("Error getting task", e);
            return null;
        }
    }
    
    private Task mapToTask(Map<String, AttributeValue> item) {
        Task task = new Task();
        task.setTaskId(item.get("taskId").s());
        task.setTitle(item.get("title").s());
        task.setStatus(item.get("status").s());
        task.setPriority(item.get("priority").s());
        task.setCreatedAt(item.get("createdAt").s());
        task.setUpdatedAt(item.get("updatedAt").s());
        
        if (item.containsKey("description")) {
            task.setDescription(item.get("description").s());
        }
        
        if (item.containsKey("assignedBy")) {
            task.setAssignedBy(item.get("assignedBy").s());
        }
        
        if (item.containsKey("assignedTo")) {
            task.setAssignedTo(item.get("assignedTo").s());
        }
        
        if (item.containsKey("dueDate")) {
            task.setDueDate(item.get("dueDate").s());
        }
        
        if (item.containsKey("category")) {
            task.setCategory(item.get("category").s());
        }
        
        if (item.containsKey("estimatedHours") && item.get("estimatedHours").n() != null) {
            task.setEstimatedHours(Double.parseDouble(item.get("estimatedHours").n()));
        }
        
        return task;
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