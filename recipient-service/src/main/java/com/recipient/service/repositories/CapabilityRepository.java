package com.recipient.service.repositories;

import com.recipient.service.entities.SpecialCapability;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CapabilityRepository extends JpaRepository<SpecialCapability, Long> {}