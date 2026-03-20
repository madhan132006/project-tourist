package com.touristsafety.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * BlockchainRecord entity — implements a blockchain-style chained structure
 * for tamper-proof safety incident logging
 */
@Entity
@Table(name = "blockchain_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlockchainRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "block_index", nullable = false, unique = true)
    private Integer blockIndex;

    @Column(nullable = false, length = 128)
    private String hash;

    @Column(name = "previous_hash", nullable = false, length = 128)
    private String previousHash;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    @Column(columnDefinition = "TEXT", nullable = false)
    private String data;

    @Column(name = "record_type")
    @Builder.Default
    private String recordType = "INCIDENT";

    @Column(name = "tourist_id")
    private Long touristId;

    @Column(name = "location")
    private String location;

    @Column(name = "nonce")
    @Builder.Default
    private Long nonce = 0L;

    /**
     * Simple SHA-style hashing using Java built-in (production should use SHA-256)
     */
    public static String computeHash(int index, String previousHash, LocalDateTime timestamp, String data) {
        String raw = index + previousHash + timestamp.toString() + data;
        int h = 0;
        for (char c : raw.toCharArray()) {
            h = 31 * h + c;
        }
        return String.format("%064x", (long) Math.abs(h) * 397832741L + 9871623497L);
    }
}
