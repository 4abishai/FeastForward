package com.inventory.service.services;

import com.inventory.service.entities.Inventory;
import com.inventory.service.entities.SpecialCapability;
import com.inventory.service.models.DonationDTO;
import com.inventory.service.models.InventoryDTO;
import com.inventory.service.repositories.InventoryRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    @Transactional
    public void saveDonations(List<DonationDTO> donations) {
        List<Inventory> inventories = donations.stream()
                .map(dto -> {
                    DonationDTO.Donation donation = dto.getDonation();
                    DonationDTO.Donor donor = dto.getDonor();
                    DonationDTO.Recipient recipient = dto.getRecipient();

                    Inventory inventory = Inventory.builder()
                            .donationId(donation.getId())
                            .donorId(donor.getId())
                            .recipientId(recipient.getId())
                            .name(donation.getName())
                            .type(donation.getType())
                            .quantity(donation.getQuantity())
                            .unit(donation.getUnit())
                            .packagingType(donation.getPackagingType())
                            .storageCapability(donation.getStorageCapability())
                            .build();

                    List<SpecialCapability> capabilities = Optional.ofNullable(donation.getSpecialCapabilities())
                            .orElse(Collections.emptyList())
                            .stream()
                            .map(cap -> SpecialCapability.builder()
                                    .capability(cap)
                                    .inventory(inventory)
                                    .build())
                            .collect(Collectors.toList());

                    inventory.setSpecialCapabilityList(capabilities);

                    return inventory;
                })
                .collect(Collectors.toList());

        inventoryRepository.saveAll(inventories);
    }


//    public void saveDonation(DonationDTO donationDTO) {
//        DonationDTO.Donation donation = donationDTO.getDonation();
//        DonationDTO.Donor donor = donationDTO.getDonor();
//        DonationDTO.Recipient recipient = donationDTO.getRecipient();
//
//        Inventory inventory = Inventory.builder()
//                .donationId(donation.getId())
//                .donorId(donor.getId())
//                .recipientId(recipient.getId())
//                .name(donation.getName())
//                .type(donation.getType())
//                .quantity(donation.getQuantity())
//                .unit(donation.getUnit())
//                .packagingType(donation.getPackagingType())
//                .storageCapability(donation.getStorageCapability())
//                .build();
//
//        // Handle special capabilities
//        List<SpecialCapability> capabilities = donation.getSpecialCapabilities().stream()
//                .map(cap -> SpecialCapability.builder()
//                        .capability(cap)
//                        .inventory(inventory)
//                        .build())
//                .collect(Collectors.toList());
//
//        inventory.setSpecialCapabilityList(capabilities);
//        inventoryRepository.save(inventory);
//    }


    public List<InventoryDTO> getInventoryDetailsByRecipientId(Long recipientId) {
        List<Inventory> inventories = inventoryRepository.findByRecipientId(recipientId);

        return inventories.stream()
                .map(this::mapToInventoryDTO)
                .collect(Collectors.toList());
    }

    private InventoryDTO mapToInventoryDTO(Inventory inventory) {
        return InventoryDTO.builder()
                .id(inventory.getId())
                .donationId(inventory.getDonationId())
                .donorId(inventory.getDonorId())
                .recipientId(inventory.getRecipientId())
                .status(inventory.getStatus())
                .name(inventory.getName())
                .type(inventory.getType())
                .quantity(inventory.getQuantity())
                .unit(inventory.getUnit())
                .packagingType(inventory.getPackagingType())
                .storageCapability(inventory.getStorageCapability())
                .specialCapabilities(
                        inventory.getSpecialCapabilityList()
                                .stream()
                                .map(SpecialCapability::getCapability)
                                .collect(Collectors.toList())
                )
                .build();
    }

}


