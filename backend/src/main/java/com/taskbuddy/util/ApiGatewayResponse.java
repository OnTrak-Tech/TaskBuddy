package com.taskbuddy.util;

import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;

import java.util.HashMap;
import java.util.Map;

public class ApiGatewayResponse {
    
    public static APIGatewayProxyResponseEvent success(String body) {
        return createResponse(200, body);
    }
    
    public static APIGatewayProxyResponseEvent created(String body) {
        return createResponse(201, body);
    }
    
    public static APIGatewayProxyResponseEvent noContent() {
        return createResponse(204, null);
    }
    
    public static APIGatewayProxyResponseEvent error(int statusCode, String errorMessage) {
        return createResponse(statusCode, "{\"error\":\"" + errorMessage + "\"}");
    }
    
    private static APIGatewayProxyResponseEvent createResponse(int statusCode, String body) {
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        headers.put("Access-Control-Allow-Origin", "*");
        headers.put("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        headers.put("Access-Control-Allow-Headers", "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token");
        
        APIGatewayProxyResponseEvent response = new APIGatewayProxyResponseEvent()
                .withStatusCode(statusCode)
                .withHeaders(headers);
        
        if (body != null) {
            response.withBody(body);
        }
        
        return response;
    }
}