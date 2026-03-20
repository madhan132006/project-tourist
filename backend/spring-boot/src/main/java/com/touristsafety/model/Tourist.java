package com.touristsafety.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Tourist entity — represents a registered tourist in the Safety System
 */
@Entity
@Table(name = "tourists")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tourist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Column(nullable = false)
    private String country;

    @Column(name = "passport_number", unique = true)
    private String passportNumber;

    @Pattern(regexp = "^\\+?[0-9\\s\\-]{7,20}$")
    private String phone;

    @Email
    @NotBlank
    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "safety_score")
    @Builder.Default
    private Integer safetyScore = 80;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private TouristStatus status = TouristStatus.ACTIVE;

    @Column(name = "emergency_contact_name")
    private String emergencyContactName;

    @Column(name = "emergency_contact_phone")
    private String emergencyContactPhone;

    @Column(name = "arrival_date")
    private String arrivalDate;

    @Column(name = "departure_date")
    private String departureDate;

    @Column(name = "hotel_name")
    private String hotelName;

    @Column(name = "blockchain_id")
    private String blockchainId;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    public enum TouristStatus {
        ACTIVE, INACTIVE, EMERGENCY, BLACKLISTED
    }
}
