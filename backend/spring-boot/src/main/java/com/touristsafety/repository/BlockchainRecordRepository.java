package com.touristsafety.repository;

import com.touristsafety.model.BlockchainRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BlockchainRecordRepository extends JpaRepository<BlockchainRecord, Long> {
    List<BlockchainRecord> findAllByOrderByBlockIndexAsc();
    Optional<BlockchainRecord> findTopByOrderByBlockIndexDesc();
    Optional<BlockchainRecord> findByBlockIndex(int index);
    long countByRecordType(String recordType);
}
