package com.taskbuddy.util;

import software.amazon.awssdk.services.dynamodb.model.AttributeValue;

import java.util.HashMap;
import java.util.Map;

public class DynamoDBUtil {
    
    public static Map<String, AttributeValue> createStringAttribute(String key, String value) {
        Map<String, AttributeValue> item = new HashMap<>();
        item.put(key, AttributeValue.builder().s(value).build());
        return item;
    }
    
    public static Map<String, AttributeValue> createNumberAttribute(String key, Number value) {
        Map<String, AttributeValue> item = new HashMap<>();
        item.put(key, AttributeValue.builder().n(value.toString()).build());
        return item;
    }
    
    public static Map<String, AttributeValue> createBooleanAttribute(String key, Boolean value) {
        Map<String, AttributeValue> item = new HashMap<>();
        item.put(key, AttributeValue.builder().bool(value).build());
        return item;
    }
    
    public static String getStringAttribute(Map<String, AttributeValue> item, String key) {
        AttributeValue value = item.get(key);
        return value != null ? value.s() : null;
    }
    
    public static Integer getIntegerAttribute(Map<String, AttributeValue> item, String key) {
        AttributeValue value = item.get(key);
        return value != null && value.n() != null ? Integer.parseInt(value.n()) : null;
    }
    
    public static Boolean getBooleanAttribute(Map<String, AttributeValue> item, String key) {
        AttributeValue value = item.get(key);
        return value != null ? value.bool() : null;
    }
}