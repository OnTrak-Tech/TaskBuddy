package com.taskbuddy.config;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class AppConfig {
    private static final Properties properties = new Properties();
    private static boolean initialized = false;
    
    public static synchronized void initialize() {
        if (initialized) {
            return;
        }
        
        try (InputStream input = AppConfig.class.getClassLoader().getResourceAsStream("application.properties")) {
            if (input == null) {
                System.err.println("Unable to find application.properties");
                return;
            }
            
            properties.load(input);
            initialized = true;
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }
    
    public static String getProperty(String key) {
        if (!initialized) {
            initialize();
        }
        
        // First check environment variables (for Lambda)
        String envValue = System.getenv(key);
        if (envValue != null) {
            return envValue;
        }
        
        // Then check properties file
        return properties.getProperty(key);
    }
    
    public static String getSesFromEmail() {
        String email = getProperty("ses.from.email");
        if (email == null || email.isEmpty()) {
            email = getProperty("FROM_EMAIL");
        }
        return email != null ? email : "kwesijay8@gmail.com"; // Default fallback
    }
}