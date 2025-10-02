package com.donation.records.service.services;

import com.donation.records.service.entities.Donation;
import com.donation.records.service.entities.SpecialCapability;
import com.donation.records.service.models.DonationDTO;
import com.donation.records.service.models.DonationHistoryDTO;
import com.donation.records.service.producers.DonationMsgProducer;
import com.donation.records.service.repositories.DonationRepository;
import com.donation.records.service.repositories.ScoreRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DonationService {
    private final DonationRepository donationRepository;
    private final ScoreRepository scoresRepository;
    private final DonationMsgProducer donationMsgProducer;

    public void createDonation(DonationDTO dto) throws Exception {
        try {
            DonationDTO.Donor donor = dto.getDonor();
            DonationDTO.Donation donation = dto.getDonation();
            DonationDTO.Recipient recipient = dto.getRecipient();

            Donation donationEntity = Donation.builder()
                    .donorId(donor.getId())
                    .donorName(donor.getName())
                    .recipientId(recipient.getId())
                    .recipientName(recipient.getName())
                    .donationName(donation.getName())
                    .type(donation.getType())
                    .quantity(donation.getQuantity())
                    .unit(donation.getUnit())
                    .donationPickupTime(donation.getDonationPickupTime())
                    .packagingType(donation.getPackagingType())
                    .storageCapability(donation.getStorageCapability())
                    .build();


            List<SpecialCapability> capabilityEntities = donation.getSpecialCapabilities().stream()
                    .map(cap -> SpecialCapability.builder()
                            .capability(cap)
                            .donation(donationEntity)
                            .build())
                    .collect(Collectors.toList());

            donationEntity.setSpecialCapabilityList(capabilityEntities);

            // Save Donation (cascades SpecialCapability due to orphanRemoval=true)
            Donation savedDonation = donationRepository.save(donationEntity);

            try {
                dto.getDonation().setId(savedDonation.getId());
                donationMsgProducer.sendDonation(dto);
            } catch (Exception e) {
                log.error("Failed to publish donation event for donation ID: {}", savedDonation.getId(), e);
                throw new Exception("Failed to send donation event", e);
            }
        }
        catch (Exception e) {
            log.error("Error occurred while creating donation", e);
            throw new Exception("Failed to create donation", e);
        }
    }


    public List<DonationHistoryDTO> fetchDonationHistory(Long donorId) {
        List<Donation> donation = donationRepository.findByDonorId(donorId);
        if (donation.isEmpty()) {
            log.warn("No donations found for donor ID: {}", donorId);
            return List.of(); // Return empty list if no donations found
        }

    return donation.stream().map(d -> {
            DonationHistoryDTO history = new DonationHistoryDTO();
            history.setId(d.getId());
            history.setDonorName(d.getDonorName());
            history.setRecipientName(d.getRecipientName());
            history.setDonationName(d.getDonationName());
            history.setType(d.getType());
            history.setQuantity(d.getQuantity());
            history.setUnit(d.getUnit());
            history.setSpecialCapabilities(
                    d.getSpecialCapabilityList().stream()
                            .map(SpecialCapability::getCapability)
                            .collect(Collectors.toList())
            );
            history.setDonationPickupTime(d.getDonationPickupTime());
            history.setPackagingType(d.getPackagingType());
            history.setStorageCapability(d.getStorageCapability());
            return history;
        }).collect(Collectors.toList());
    }
}
