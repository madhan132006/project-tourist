package com.touristsafety.service;

import com.touristsafety.model.BlockchainRecord;
import com.touristsafety.repository.BlockchainRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class BlockchainService {

    private final BlockchainRecordRepository repository;

    private static final String GENESIS_HASH = "0".repeat(64);

    @PostConstruct
    public void ensureGenesisBlock() {
        if (repository.count() == 0) {
            addRecord("System genesis block — Tourist Safety Blockchain initialized", "GENESIS", null, "SYSTEM");
        }
    }

    public BlockchainRecord addRecord(String data, String recordType, Long touristId, String location) {
        Optional<BlockchainRecord> lastBlock = repository.findTopByOrderByBlockIndexDesc();
        int nextIndex = lastBlock.map(b -> b.getBlockIndex() + 1).orElse(0);
        String prevHash = lastBlock.map(BlockchainRecord::getHash).orElse(GENESIS_HASH);
        LocalDateTime ts = LocalDateTime.now();

        String hash = BlockchainRecord.computeHash(nextIndex, prevHash, ts, data);

        BlockchainRecord record = BlockchainRecord.builder()
            .blockIndex(nextIndex)
            .hash(hash)
            .previousHash(prevHash)
            .timestamp(ts)
            .data(data)
            .recordType(recordType)
            .touristId(touristId)
            .location(location)
            .nonce((long)(Math.random() * 999999))
            .build();

        return repository.save(record);
    }

    public List<BlockchainRecord> getAllRecords() {
        return repository.findAllByOrderByBlockIndexAsc();
    }

    public Map<String, Object> verifyChain() {
        List<BlockchainRecord> chain = repository.findAllByOrderByBlockIndexAsc();
        boolean valid = true;
        String failMessage = null;

        for (int i = 1; i < chain.size(); i++) {
            BlockchainRecord block = chain.get(i);
            BlockchainRecord prev = chain.get(i - 1);
            // Verify linkage
            if (!block.getPreviousHash().equals(prev.getHash())) {
                valid = false;
                failMessage = "Block #" + block.getBlockIndex() + " has invalid previous hash";
                break;
            }
            // Verify own hash
            String recomputed = BlockchainRecord.computeHash(
                block.getBlockIndex(), block.getPreviousHash(), block.getTimestamp(), block.getData());
            if (!block.getHash().equals(recomputed)) {
                valid = false;
                failMessage = "Block #" + block.getBlockIndex() + " hash mismatch (tampered)";
                break;
            }
        }

        return Map.of(
            "valid", valid,
            "totalBlocks", chain.size(),
            "message", valid ? "All " + chain.size() + " blocks verified — Chain intact!" : failMessage
        );
    }

    public Map<String, Object> getStats() {
        List<BlockchainRecord> all = repository.findAllByOrderByBlockIndexAsc();
        return Map.of(
            "totalBlocks", all.size(),
            "incidentCount", repository.countByRecordType("INCIDENT"),
            "emergencyCount", repository.countByRecordType("EMERGENCY"),
            "lastBlockTime", all.isEmpty() ? null : all.get(all.size()-1).getTimestamp()
        );
    }
}
