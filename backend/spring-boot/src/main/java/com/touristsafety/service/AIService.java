package com.touristsafety.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;

/**
 * AI Service — provides risk prediction and chatbot responses
 * Uses rule-based logic (can be extended with ML model or external AI API)
 */
@Service
@RequiredArgsConstructor
public class AIService {

    // Risk factors by zone type
    private static final Map<String, Integer> ZONE_RISK = Map.of(
        "market", 70, "harbor", 55, "city_center", 30,
        "tourist_zone", 20, "night_district", 80, "suburb", 40, "park", 25
    );

    // Knowledge base for chatbot
    private static final List<Map<String, Object>> KB = List.of(
        Map.of("patterns", List.of("danger", "risky", "unsafe", "avoid"),
               "response", "⚠️ Current High Risk Zones: Market District (pickpocket alerts), Harbor Back Alley (scams). Recommended safe zones: City Center, Tourist Avenue, Main Boulevard."),
        Map.of("patterns", List.of("hospital", "medical", "ambulance", "sick", "hurt"),
               "response", "🏥 Nearest hospitals: City General (1.2km, 24h ER), Tourist Medical Clinic (2.8km, English-speaking staff). Dial 102 for ambulance."),
        Map.of("patterns", List.of("police", "crime", "robbery", "stolen"),
               "response", "🚔 Police Stations: Central (0.8km, 24/7), Harbor Post (2.1km). Emergency: dial 100. Report online via the incident form in this app."),
        Map.of("patterns", List.of("route", "safe", "walk", "path", "navigate"),
               "response", "🗺️ Safest routes: Main Boulevard (24h CCTV, police patrols every 15 min), Tourist Avenue (dedicated safe zone). Avoid Harbor Back Alley after 9 PM."),
        Map.of("patterns", List.of("emergency", "sos", "help", "urgent"),
               "response", "🆘 Emergency Steps: 1) Press SOS in the Emergency tab 2) Dial 100 (Police) or 102 (Ambulance) 3) Move to a public area 4) Stay on the line with emergency services."),
        Map.of("patterns", List.of("scam", "fraud", "cheat"),
               "response", "⚠️ Common Scams: Fake tour operators, overcharging taxis, gem deals. Only use verified services. Report scams to police (100) or via the incident feature."),
        Map.of("patterns", List.of("tip", "advice", "safety", "recommend"),
               "response", "🛡️ Top Tips: 1) Keep phone charged 2) Backup your documents 3) Use app-based taxis 4) Avoid isolated areas at night 5) Share your itinerary with your hotel.")
    );

    // ─── Risk Prediction ───
    public Map<String, Object> predictRisk(double lat, double lng) {
        // Simulated risk based on coordinates (production: use ML model)
        int baseRisk = 35;
        // Add variation based on coords
        double factor = Math.abs((lat * 7 + lng * 13) % 50);
        int riskScore = (int) Math.min(baseRisk + factor, 95);

        String level = riskScore > 65 ? "HIGH" : riskScore > 35 ? "MEDIUM" : "LOW";
        String advice = riskScore > 65
            ? "High risk area. Stay on main roads, avoid isolated zones."
            : riskScore > 35
            ? "Moderate risk. Stay alert and keep valuables secure."
            : "Safe area. Enjoy your visit!";

        return Map.of(
            "lat", lat, "lng", lng,
            "score", riskScore,
            "level", level,
            "advice", advice,
            "nearbyPolice", "Central Station — 0.8km",
            "nearbyHospital", "City General — 1.2km",
            "safeZones", List.of("City Center", "Main Boulevard", "Tourist Square")
        );
    }

    // ─── Chatbot ───
    @SuppressWarnings("unchecked")
    public Map<String, Object> chat(String message, List<Map<String, String>> history) {
        String lower = message.toLowerCase();
        String response = null;

        for (Map<String, Object> entry : KB) {
            List<String> patterns = (List<String>) entry.get("patterns");
            if (patterns.stream().anyMatch(lower::contains)) {
                response = (String) entry.get("response");
                break;
            }
        }

        if (response == null) {
            response = "I'm analyzing your query about \"" + message + "\". Based on current safety data, I recommend staying in well-lit tourist areas and keeping emergency contacts handy. Is there a specific safety concern I can help with?";
        }

        return Map.of(
            "response", response,
            "timestamp", System.currentTimeMillis(),
            "source", "AI Safety Engine v2",
            "confidence", response.isEmpty() ? 0.6 : 0.92
        );
    }

    // ─── Safe Route Suggestions ───
    public Map<String, Object> safeRoutes(double fromLat, double fromLng, double toLat, double toLng) {
        return Map.of(
            "recommended", "Main Boulevard → City Center Avenue → Tourist Square",
            "riskLevel", "LOW",
            "distanceKm", 2.4,
            "estimatedWalkMin", 28,
            "policePatrols", true,
            "cctv", true,
            "avoid", List.of("Harbor Back Alley", "Old Market Lane after 9 PM")
        );
    }
}
