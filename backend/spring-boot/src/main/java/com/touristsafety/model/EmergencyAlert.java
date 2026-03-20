package com.touristsafety.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * EmergencyAlert entity — SOS alerts triggered by tourists
 */
@Entity
@Table(name = "emergency_alerts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmergencyAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tourist_id")
    private Long touristId;

    @Column(nullable = false)
    private String location;

    @Column(name = "lat")
    private Double lat;

    @Column(name = "lng")
    private Double lng;

    @Column(name = "emergency_type")
    @Builder.Default
    private String emergencyType = "GENERAL";

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private AlertStatus status = AlertStatus.TRIGGERED;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "dispatched_at")
    private LocalDateTime dispatchedAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "eta_minutes")
    @Builder.Default
    private Integer etaMinutes = 4;

    public enum AlertStatus {
        TRIGGERED, LOCATION_CAPTURED, AUTHORITIES_NOTIFIED, DISPATCHED, RESOLVED, CANCELLED
    }
}
