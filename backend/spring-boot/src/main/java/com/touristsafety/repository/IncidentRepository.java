package com.touristsafety.repository;

import com.touristsafety.model.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {
    List<Incident> findByTouristIdOrderByTimestampDesc(Long touristId);
    List<Incident> findAllByOrderByTimestampDesc();
    List<Incident> findByRiskLevel(Incident.RiskLevel riskLevel);
    long countByStatus(Incident.IncidentStatus status);
}
