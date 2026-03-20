package com.touristsafety.controller;

import com.touristsafety.model.EmergencyAlert;
import com.touristsafety.service.EmergencyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/emergency")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EmergencyController {

    private final EmergencyService emergencyService;

    /** POST /api/emergency — Trigger SOS alert */
    @PostMapping
    public ResponseEntity<?> triggerSOS(@RequestBody EmergencyAlert alert) {
        EmergencyAlert saved = emergencyService.triggerSOS(alert);
        return ResponseEntity.ok(Map.of(
            "id", saved.getId(),
            "status", saved.getStatus(),
            "message", "SOS alert triggered. Authorities have been notified.",
            "etaMinutes", saved.getEtaMinutes(),
            "helpline", "100 (Police) | 102 (Ambulance)"
        ));
    }

    /** GET /api/emergency — Get all emergency alerts */
    @GetMapping
    public ResponseEntity<?> getAllAlerts() {
        return ResponseEntity.ok(emergencyService.getAllAlerts());
    }

    /** GET /api/emergency/tourist/{touristId} */
    @GetMapping("/tourist/{touristId}")
    public ResponseEntity<?> getAlertsByTourist(@PathVariable Long touristId) {
        return ResponseEntity.ok(emergencyService.getAlertsByTourist(touristId));
    }

    /** PUT /api/emergency/{id}/status — Update alert status */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> req) {
        return emergencyService.updateStatus(id, req.get("status"))
            .map(a -> ResponseEntity.ok((Object) Map.of(
                "id", a.getId(), "status", a.getStatus(), "message", "Status updated"
            )))
            .orElse(ResponseEntity.notFound().build());
    }

    /** GET /api/emergency/stats */
    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(emergencyService.getStats());
    }
}
