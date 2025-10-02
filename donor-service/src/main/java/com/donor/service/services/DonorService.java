package com.donor.service.services;

import com.donor.service.entities.DonorInfo;
import com.donor.service.models.DonorInfoDTO;
import com.donor.service.repositories.DonorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class DonorService {
    private final DonorRepository donorRepository;

    public void saveDonor(DonorInfoDTO dto) throws Exception {
        try {
            DonorInfo donorInfo = DonorInfo.builder()
                    .id(dto.getId())
                    .name(dto.getName())
                    .address(dto.getAddress())
                    .latitude(dto.getLocation().getLatitude())
                    .longitude(dto.getLocation().getLongitude())
                    .email(dto.getContact().getEmail())
                    .phone(dto.getContact().getPhone())
                    .build();

            donorRepository.save(donorInfo);
        } catch (Exception e) {
            log.error("Error while saving donor", e);
            throw new Exception("Failed to save donor", e);
        }

    }

    public DonorInfoDTO getDonorById(Long donorId) throws Exception {
        DonorInfo donorInfo = donorRepository.findById(donorId)
                .orElseThrow(() -> new Exception("Donor not found with id: " + donorId));

        DonorInfoDTO dto = new DonorInfoDTO();
        dto.setId(donorInfo.getId());
        dto.setName(donorInfo.getName());
        dto.setAddress(donorInfo.getAddress());

        DonorInfoDTO.Location location = new DonorInfoDTO.Location();
        location.setLatitude(donorInfo.getLatitude());
        location.setLongitude(donorInfo.getLongitude());
        dto.setLocation(location);

        DonorInfoDTO.Contact contact = new DonorInfoDTO.Contact();
        contact.setEmail(donorInfo.getEmail());
        contact.setPhone(donorInfo.getPhone());
        dto.setContact(contact);

        return dto;
    }

}
