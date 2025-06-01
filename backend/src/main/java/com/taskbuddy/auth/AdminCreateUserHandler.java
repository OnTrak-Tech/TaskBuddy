package com.taskbuddy.auth;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskbuddy.model.User;
import com.taskbuddy.util.ApiGatewayResponse;
import com.taskbuddy.util.DynamoDBUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.*;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class AdminCreateUserHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
    private static final Logger logger = LoggerFactory.getLogger(AdminCreateUserHandler.class);
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private final DynamoDbClient dynamoDbClient;
    private final CognitoIdentityProviderClient cognitoClient;
    private final String userPoolId;
    private final String usersTableName;

    public AdminCreateUserHandler() {
        this.dynamoDbClient = DynamoDbClient.create();
        this.cognitoClient = CognitoIdentityProviderClient.create();
        this.userPoolId = System.getenv("COGNITO_USER_POOL_ID");
        this.usersTableName = System.getenv("USERS_TABLE_NAME");
    }

    @Override
    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent input, Context context) {
        try {
            // Parse request body
            User user = objectMapper.readValue(input.getBody(), User.class);
            
            // Validate required fields
            if (user.getEmail() == null || user.getName() == null || user.getRole() == null) {
                return ApiGatewayResponse.error(400, "Missing required fields: email, name, or role");
            }
            
            // Create user in Cognito
            String tempPassword = UUID.randomUUID().toString();
            AdminCreateUserResponse cognitoResponse = createCognitoUser(user, tempPassword);
            
            // Add user to appropriate Cognito group based on role
            addUserToGroup(user.getEmail(), user.getRole());
            
            // Save user to DynamoDB
            String userId = cognitoResponse.user().username();
            user.setUserId(userId);
            user.setCreatedAt(Instant.now().toString());
            user.setIsActive(true);
            
            saveUserToDynamoDB(user);
            
            // Return success response
            return ApiGatewayResponse.success(objectMapper.writeValueAsString(user));
            
        } catch (Exception e) {
            logger.error("Error creating user", e);
            return ApiGatewayResponse.error(500, "Error creating user: " + e.getMessage());
        }
    }
    
    private AdminCreateUserResponse createCognitoUser(User user, String tempPassword) {
        AttributeType emailAttr = AttributeType.builder()
                .name("email")
                .value(user.getEmail())
                .build();
        
        AttributeType emailVerifiedAttr = AttributeType.builder()
                .name("email_verified")
                .value("true")
                .build();
        
        AttributeType nameAttr = AttributeType.builder()
                .name("name")
                .value(user.getName())
                .build();
        
        AttributeType roleAttr = AttributeType.builder()
                .name("custom:role")
                .value(user.getRole())
                .build();
        
        AdminCreateUserRequest createUserRequest = AdminCreateUserRequest.builder()
                .userPoolId(userPoolId)
                .username(user.getEmail())
                .temporaryPassword(tempPassword)
                .userAttributes(emailAttr, emailVerifiedAttr, nameAttr, roleAttr)
                .messageAction(MessageActionType.SUPPRESS) // Don't send email, we'll handle notifications
                .build();
        
        return cognitoClient.adminCreateUser(createUserRequest);
    }
    
    private void addUserToGroup(String username, String role) {
        AdminAddUserToGroupRequest groupRequest = AdminAddUserToGroupRequest.builder()
                .userPoolId(userPoolId)
                .username(username)
                .groupName(role.toLowerCase())
                .build();
        
        cognitoClient.adminAddUserToGroup(groupRequest);
    }
    
    private void saveUserToDynamoDB(User user) {
        Map<String, AttributeValue> item = new HashMap<>();
        item.put("userId", AttributeValue.builder().s(user.getUserId()).build());
        item.put("email", AttributeValue.builder().s(user.getEmail()).build());
        item.put("name", AttributeValue.builder().s(user.getName()).build());
        item.put("role", AttributeValue.builder().s(user.getRole()).build());
        item.put("isActive", AttributeValue.builder().bool(user.getIsActive()).build());
        item.put("createdAt", AttributeValue.builder().s(user.getCreatedAt()).build());
        
        if (user.getPhoneNumber() != null) {
            item.put("phoneNumber", AttributeValue.builder().s(user.getPhoneNumber()).build());
        }
        
        if (user.getDepartment() != null) {
            item.put("department", AttributeValue.builder().s(user.getDepartment()).build());
        }
        
        PutItemRequest putItemRequest = PutItemRequest.builder()
                .tableName(usersTableName)
                .item(item)
                .build();
        
        dynamoDbClient.putItem(putItemRequest);
    }
}