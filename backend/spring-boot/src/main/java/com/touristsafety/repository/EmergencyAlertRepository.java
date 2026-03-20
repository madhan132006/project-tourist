package com.touristsafety.repository;

import com.touristsafety.model.EmergencyAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EmergencyAlertRepository extends JpaRepository<EmergencyAlert, Long> {
    List<EmergencyAlert> findByTouristIdOrderByCreatedAtDesc(Long touristId);
    List<EmergencyAlert> findAllByOrderByCreatedAtDesc();
    List<EmergencyAlert> findByStatus(EmergencyAlert.AlertStatus status);
    long countByStatus(EmergencyAlert.AlertStatus status);
}
