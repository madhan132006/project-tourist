package com.touristsafety.service;

import com.touristsafety.model.Tourist;
import com.touristsafety.repository.TouristRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class TouristService {

    private final TouristRepository repository;
    private final PasswordEncoder passwordEncoder;

    public Tourist register(Tourist tourist) {
        if (repository.existsByEmail(tourist.getEmail()))
            throw new RuntimeException("Email already registered");
        if (tourist.getPassportNumber() != null && repository.existsByPassportNumber(tourist.getPassportNumber()))
            throw new RuntimeException("Passport already registered");

        tourist.setPasswordHash(passwordEncoder.encode(tourist.getPasswordHash()));
        tourist.setBlockchainId("TSS-" + UUID.randomUUID().toString().replace("-","").toUpperCase().substring(0,12));
        tourist.setSafetyScore(computeInitialScore(tourist));
        tourist.setCreatedAt(LocalDateTime.now());
        return repository.save(tourist);
    }

    public Optional<Tourist> login(String email, String rawPassword) {
        return repository.findByEmail(email)
            .filter(t -> passwordEncoder.matches(rawPassword, t.getPasswordHash()))
            .map(t -> { t.setLastLogin(LocalDateTime.now()); return repository.save(t); });
    }

    public Optional<Tourist> getById(Long id) {
        return repository.findById(id);
    }

    public Map<String, Object> getSafetyScore(Long id) {
        return repository.findById(id).map(t -> {
            Map<String, Object> result = new HashMap<>();
            result.put("id", t.getId());
            result.put("score", t.getSafetyScore());
            result.put("status", t.getSafetyScore() >= 70 ? "SAFE" : t.getSafetyScore() >= 40 ? "CAUTION" : "HIGH_RISK");
            result.put("country", t.getCountry());
            result.put("phone", t.getPhone());
            result.put("message", buildScoreMessage(t.getSafetyScore()));
            return result;
        }).orElse(Map.of("score", 80, "status", "SAFE"));
    }

    public Map<String, Object> getDashboardStats() {
        long total = repository.count();
        return Map.of(
            "totalTourists", total,
            "activeTourists", total,
            "avgSafetyScore", repository.findAll().stream()
                .mapToInt(Tourist::getSafetyScore).average().orElse(80)
        );
    }

    private int computeInitialScore(Tourist t) {
        int score = 75;
        if (t.getPassportNumber() != null && !t.getPassportNumber().isBlank()) score += 10;
        if (t.getPhone() != null && !t.getPhone().isBlank()) score += 5;
        if (t.getEmergencyContactPhone() != null) score += 5;
        return Math.min(score, 100);
    }

    private String buildScoreMessage(int score) {
        if (score >= 85) return "Excellent safety rating. Enjoy your trip!";
        if (score >= 70) return "Good safety rating. Stay alert in busy areas.";
        if (score >= 50) return "Moderate risk. Follow safety guidelines.";
        return "High risk area detected. Contact authorities if needed.";
    }
}
