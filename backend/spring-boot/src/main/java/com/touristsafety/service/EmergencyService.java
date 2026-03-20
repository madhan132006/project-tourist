package com.touristsafety.service;

import com.touristsafety.model.EmergencyAlert;
import com.touristsafety.repository.EmergencyAlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class EmergencyService {

    private final EmergencyAlertRepository alertRepository;
    private final BlockchainService blockchainService;

    public EmergencyAlert triggerSOS(EmergencyAlert alert) {
        alert.setStatus(EmergencyAlert.AlertStatus.TRIGGERED);
        alert.setCreatedAt(LocalDateTime.now());
        alert.setEtaMinutes(4);
        EmergencyAlert saved = alertRepository.save(alert);

        // Log to blockchain
        String data = String.format("{\"type\":\"%s\",\"location\":\"%s\",\"lat\":%s,\"lng\":%s,\"alertId\":%d}",
            alert.getEmergencyType(), alert.getLocation(),
            alert.getLat(), alert.getLng(), saved.getId());
        blockchainService.addRecord(data, "EMERGENCY", alert.getTouristId(), alert.getLocation());

        // Simulate dispatch progression
        saved.setStatus(EmergencyAlert.AlertStatus.AUTHORITIES_NOTIFIED);
        saved.setDispatchedAt(LocalDateTime.now());
        return alertRepository.save(saved);
    }

    public List<EmergencyAlert> getAllAlerts() {
        return alertRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<EmergencyAlert> getAlertsByTourist(Long touristId) {
        return alertRepository.findByTouristIdOrderByCreatedAtDesc(touristId);
    }

    public Optional<EmergencyAlert> updateStatus(Long id, String status) {
        return alertRepository.findById(id).map(alert -> {
            alert.setStatus(EmergencyAlert.AlertStatus.valueOf(status.toUpperCase()));
            if (status.equalsIgnoreCase("RESOLVED")) alert.setResolvedAt(LocalDateTime.now());
            return alertRepository.save(alert);
        });
    }

    public Map<String, Object> getStats() {
        return Map.of(
            "total", alertRepository.count(),
            "active", alertRepository.countByStatus(EmergencyAlert.AlertStatus.AUTHORITIES_NOTIFIED),
            "resolved", alertRepository.countByStatus(EmergencyAlert.AlertStatus.RESOLVED)
        );
    }
}
