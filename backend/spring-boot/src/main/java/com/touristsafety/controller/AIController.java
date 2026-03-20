package com.touristsafety.controller;

import com.touristsafety.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AIController {

    private final AIService aiService;

    /** POST /api/ai/chat — AI chatbot endpoint */
    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestBody Map<String, Object> req) {
        String message = req.getOrDefault("message", "").toString();
        @SuppressWarnings("unchecked")
        List<Map<String, String>> context = (List<Map<String, String>>) req.getOrDefault("context", List.of());
        return ResponseEntity.ok(aiService.chat(message, context));
    }

    /** GET /api/ai/risk?lat={lat}&lng={lng} — Risk prediction */
    @GetMapping("/risk")
    public ResponseEntity<?> predictRisk(
            @RequestParam(defaultValue = "12.9716") double lat,
            @RequestParam(defaultValue = "77.5946") double lng) {
        return ResponseEntity.ok(aiService.predictRisk(lat, lng));
    }

    /** GET /api/ai/routes — Safe route suggestions */
    @GetMapping("/routes")
    public ResponseEntity<?> safeRoutes(
            @RequestParam(defaultValue = "12.9716") double fromLat,
            @RequestParam(defaultValue = "77.5946") double fromLng,
            @RequestParam(defaultValue = "12.9800") double toLat,
            @RequestParam(defaultValue = "77.6000") double toLng) {
        return ResponseEntity.ok(aiService.safeRoutes(fromLat, fromLng, toLat, toLng));
    }
}
