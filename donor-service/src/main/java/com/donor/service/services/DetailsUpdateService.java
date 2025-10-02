package com.donor.service.services;

import com.donor.service.entities.DonorInfo;
import com.donor.service.models.DetailsUpdateDTO;
import com.donor.service.repositories.DonorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DetailsUpdateService {

    private final DonorRepository donorRepository;


    @Transactional
    public void updateDonorDetails(Long donorId, DetailsUpdateDTO updateDTO) throws Exception{
        try {
            DonorInfo donorInfo = donorRepository.findById(donorId)
                    .orElseThrow(() -> new Exception("Donor not found with id: " + donorId));

            if (updateDTO.getAddress() != null) {
                donorInfo.setAddress(updateDTO.getAddress());
            }

            if (updateDTO.getLocation() != null) {
                donorInfo.setLatitude(updateDTO.getLocation().getLatitude());
                donorInfo.setLongitude(updateDTO.getLocation().getLongitude());
            }

            if (updateDTO.getContact() != null) {
                donorInfo.setEmail(updateDTO.getContact().getEmail());
                donorInfo.setPhone(updateDTO.getContact().getPhone());
            }

            donorRepository.save(donorInfo);
        } catch (Exception e) {
            throw new Exception(e);
        }
    }
}
