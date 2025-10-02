package com.donor.service.services;

import com.donor.service.models.NameUpdateDTO;
import com.donor.service.repositories.DonorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NameUpdateService {

    private final DonorRepository donorRepository;

    @Transactional
    public void updateName(NameUpdateDTO dto) {
        donorRepository.findById(dto.getId())
                .ifPresent(donor -> {
                    donor.setName(dto.getNewName());
                    donorRepository.save(donor);
                });
    }
}