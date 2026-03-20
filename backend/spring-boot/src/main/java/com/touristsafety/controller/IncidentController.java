package com.touristsafety.controller;

import com.touristsafety.model.Incident;
import com.touristsafety.repository.IncidentRepository;
import com.touristsafety.service.BlockchainService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class IncidentController {

    private final IncidentRepository incidentRepository;
    private final BlockchainService blockchainService;

    /** GET /api/incidents — Get all incidents */
    @GetMapping
    public ResponseEntity<?> getAllIncidents() {
        return ResponseEntity.ok(incidentRepository.findAllByOrderByTimestampDesc());
    }

    /** GET /api/incidents/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<?> getIncident(@PathVariable Long id) {
        return incidentRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    /** POST /api/incidents — Report new incident */
    @PostMapping
    public ResponseEntity<?> reportIncident(@RequestBody Incident incident) {
        incident.setTimestamp(LocalDateTime.now());
        if (incident.getStatus() == null) incident.setStatus(Incident.IncidentStatus.OPEN);
        if (incident.getRiskLevel() == null) incident.setRiskLevel(Incident.RiskLevel.MEDIUM);

        Incident saved = incidentRepository.save(incident);

        // Log to blockchain
        String data = String.format("{\"type\":\"%s\",\"location\":\"%s\",\"riskLevel\":\"%s\",\"description\":\"%s\"}",
            saved.getType(), saved.getLocation(), saved.getRiskLevel(),
            saved.getDescription() != null ? saved.getDescription().replace("\"", "'") : "");
        blockchainService.addRecord(data, "INCIDENT", saved.getTouristId(), saved.getLocation());

        return ResponseEntity.ok(Map.of(
            "id", saved.getId(),
            "message", "Incident reported and logged to blockchain",
            "timestamp", saved.getTimestamp()
        ));
    }

    /** GET /api/incidents/tourist/{touristId} */
    @GetMapping("/tourist/{touristId}")
    public ResponseEntity<?> getByTourist(@PathVariable Long touristId) {
        return ResponseEntity.ok(incidentRepository.findByTouristIdOrderByTimestampDesc(touristId));
    }
}
