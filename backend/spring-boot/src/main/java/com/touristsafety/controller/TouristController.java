package com.touristsafety.controller;

import com.touristsafety.model.Tourist;
import com.touristsafety.service.TouristService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TouristController {

    private final TouristService touristService;

    /** POST /api/register — Register a new tourist */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Tourist tourist) {
        try {
            Tourist saved = touristService.register(tourist);
            return ResponseEntity.ok(Map.of(
                "id", saved.getId(),
                "name", saved.getName(),
                "email", saved.getEmail(),
                "blockchainId", saved.getBlockchainId(),
                "safetyScore", saved.getSafetyScore(),
                "message", "Registration successful!"
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /** POST /api/login — Authenticate a tourist */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> req) {
        return touristService.login(req.get("email"), req.get("password"))
            .map(t -> ResponseEntity.ok((Object) Map.of(
                "id", t.getId(),
                "name", t.getName(),
                "email", t.getEmail(),
                "safetyScore", t.getSafetyScore(),
                "blockchainId", t.getBlockchainId(),
                "token", "demo-token-" + t.getId(),
                "message", "Login successful"
            )))
            .orElse(ResponseEntity.status(401).body(Map.of("error", "Invalid credentials")));
    }

    /** GET /api/profile?id={id} — Get tourist profile */
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestParam Long id) {
        return touristService.getById(id)
            .map(t -> ResponseEntity.ok((Object) Map.of(
                "id", t.getId(), "name", t.getName(), "email", t.getEmail(),
                "country", t.getCountry(), "phone", t.getPhone(),
                "passportNumber", t.getPassportNumber() != null ? "***" + t.getPassportNumber().substring(Math.max(0, t.getPassportNumber().length()-4)) : "—",
                "safetyScore", t.getSafetyScore(), "status", t.getStatus(),
                "blockchainId", t.getBlockchainId(), "createdAt", t.getCreatedAt()
            )))
            .orElse(ResponseEntity.notFound().build());
    }

    /** GET /api/safety-score?id={id} — Get tourist safety score */
    @GetMapping("/safety-score")
    public ResponseEntity<?> getSafetyScore(@RequestParam(defaultValue = "1") Long id) {
        return ResponseEntity.ok(touristService.getSafetyScore(id));
    }

    /** GET /api/dashboard/stats — Dashboard statistics */
    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats() {
        return ResponseEntity.ok(touristService.getDashboardStats());
    }
}
