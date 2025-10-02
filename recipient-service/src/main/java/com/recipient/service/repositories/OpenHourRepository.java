package com.recipient.service.repositories;

import com.recipient.service.entities.OpenHour;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OpenHourRepository extends JpaRepository<OpenHour, Long> {}