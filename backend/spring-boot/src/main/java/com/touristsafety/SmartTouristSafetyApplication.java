package com.touristsafety;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Smart Tourist Safety System — Main Application Entry Point
 * REST API server for AI-powered tourist safety monitoring
 */
@SpringBootApplication
public class SmartTouristSafetyApplication {
    public static void main(String[] args) {
        SpringApplication.run(SmartTouristSafetyApplication.class, args);
        System.out.println("""
            ╔══════════════════════════════════════════════════════╗
            ║     🛡️  Smart Tourist Safety System v2.0 Started      ║
            ║     📡 REST API: http://localhost:8080/api            ║
            ║     🤖 AI Safety Endpoints Active                     ║
            ║     🔗 Blockchain Log Service Ready                   ║
            ╚══════════════════════════════════════════════════════╝
            """);
    }
}
