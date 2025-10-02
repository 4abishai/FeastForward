package com.donor.service.repositories;

import com.donor.service.entities.DonorInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DonorRepository extends JpaRepository<DonorInfo, Long> {
}
