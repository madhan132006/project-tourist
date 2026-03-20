package com.touristsafety.controller;

import com.touristsafety.model.BlockchainRecord;
import com.touristsafety.service.BlockchainService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/blockchain")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BlockchainController {

    private final BlockchainService blockchainService;

    /** GET /api/blockchain/records — Get full blockchain */
    @GetMapping("/records")
    public ResponseEntity<?> getAllRecords() {
        return ResponseEntity.ok(blockchainService.getAllRecords());
    }

    /** POST /api/blockchain/record — Add a new block */
    @PostMapping("/record")
    public ResponseEntity<?> addRecord(@RequestBody Map<String, Object> req) {
        String data = req.getOrDefault("data", "{}").toString();
        String type = req.getOrDefault("recordType", "INCIDENT").toString();
        Long touristId = req.get("touristId") != null ? Long.parseLong(req.get("touristId").toString()) : null;
        String location = req.getOrDefault("location", "Unknown").toString();

        BlockchainRecord saved = blockchainService.addRecord(data, type, touristId, location);
        return ResponseEntity.ok(Map.of(
            "id", saved.getId(),
            "blockIndex", saved.getBlockIndex(),
            "hash", saved.getHash(),
            "previousHash", saved.getPreviousHash(),
            "timestamp", saved.getTimestamp(),
            "message", "Block added to chain successfully"
        ));
    }

    /** GET /api/blockchain/verify — Verify chain integrity */
    @GetMapping("/verify")
    public ResponseEntity<?> verifyChain() {
        return ResponseEntity.ok(blockchainService.verifyChain());
    }

    /** GET /api/blockchain/stats */
    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(blockchainService.getStats());
    }
}
