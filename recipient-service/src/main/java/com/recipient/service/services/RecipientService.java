package com.recipient.service.services;

import com.recipient.service.entities.*;
import com.recipient.service.models.RecipientDTO;
import com.recipient.service.repositories.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Time;
import java.time.LocalDateTime;
import java.util.*;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecipientService {

    private final RecipientRepository recipientRepository;
    private final ContactRepository contactRepository;
    private final AcceptedTypeRepository acceptedTypeRepository;
    private final CapabilityRepository capabilityRepository;
    private final StorageCapabilityRepository storageCapabilityRepository;
    private final OpenHourRepository openHourRepository;

    public Long saveRecipient(RecipientDTO recipientDTO) {
        log.info("Starting to save recipient: {}", recipientDTO.getName());

        try {
            // Create and save the main recipient entity
            Recipient recipient = createRecipient(recipientDTO);
            recipient = recipientRepository.save(recipient);
            log.info("Successfully saved recipient with ID: {}", recipient.getId());

            // Save related entities
            saveContact(recipient, recipientDTO.getContact());
            saveAcceptedTypes(recipient, recipientDTO.getAcceptedTypes());
            saveSpecialCapabilities(recipient, recipientDTO.getSpecialCapabilities());
            saveStorageCapabilities(recipient, recipientDTO.getStorageCapabilities());
            saveOpenHours(recipient, recipientDTO.getOpenHours());

            log.info("Successfully saved recipient and all related data. Recipient ID: {}", recipient.getId());
            return recipient.getId();

        } catch (Exception e) {
            log.error("Failed to save recipient: {}. Error: {}", recipientDTO.getName(), e.getMessage(), e);
            throw new RuntimeException("Failed to save recipient: " + recipientDTO.getName(), e);
        }
    }

    private Recipient createRecipient(RecipientDTO recipientDTO) {
        log.debug("Creating recipient entity from DTO");

        try {
            double longitude = recipientDTO.getLocation().getLongitude();
            double latitude = recipientDTO.getLocation().getLatitude();

            GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326); // WGS 84
            Point point = geometryFactory.createPoint(new Coordinate(longitude, latitude));
            point.setSRID(4326);

            return Recipient.builder()
                    .name(recipientDTO.getName())
                    .address(recipientDTO.getAddress())
                    .description(recipientDTO.getDescription())
                    .latitude(BigDecimal.valueOf(latitude))
                    .longitude(BigDecimal.valueOf(longitude))
                    .location(point)
                    .status(Recipient.RecipientStatus.valueOf(recipientDTO.getStatus()))
                    .timezone(recipientDTO.getTimezone())
                    .createdAt(LocalDateTime.now())
                    .build();

        } catch (Exception e) {
            log.error("Failed to create recipient entity: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create recipient entity", e);
        }
    }

    private void saveContact(Recipient recipient, RecipientDTO.Contact contactDTO) {
        if (contactDTO == null) {
            log.debug("No contact information provided for recipient: {}", recipient.getId());
            return;
        }

        try {
            log.debug("Saving contact for recipient: {}", recipient.getId());

            Contact contact = Contact.builder()
                    .name(contactDTO.getName())
                    .email(contactDTO.getEmail())
                    .phone(contactDTO.getPhone())
                    .recipient(recipient)
                    .build();

            contactRepository.save(contact);
            log.debug("Successfully saved contact for recipient: {}", recipient.getId());

        } catch (Exception e) {
            log.error("Failed to save contact for recipient: {}. Error: {}", recipient.getId(), e.getMessage(), e);
            throw new RuntimeException("Failed to save contact information", e);
        }
    }

    private void saveAcceptedTypes(Recipient recipient, List<RecipientDTO.AcceptedTypes> acceptedTypesList) {
        if (acceptedTypesList == null || acceptedTypesList.isEmpty()) {
            log.debug("No accepted types provided for recipient: {}", recipient.getId());
            return;
        }

        try {
            log.debug("Saving {} accepted types for recipient: {}", acceptedTypesList.size(), recipient.getId());

            for (RecipientDTO.AcceptedTypes dto : acceptedTypesList) {
                AcceptedType acceptedType = AcceptedType.builder()
                        .type(dto.getType())
                        .minQuantity(dto.getMinQuantity())
                        .unit(dto.getUnit())
                        .recipient(recipient)
                        .build();
                acceptedTypeRepository.save(acceptedType);
            }

            log.debug("Successfully saved all accepted types for recipient: {}", recipient.getId());

        } catch (Exception e) {
            log.error("Failed to save accepted types for recipient: {}. Error: {}", recipient.getId(), e.getMessage(), e);
            throw new RuntimeException("Failed to save accepted types", e);
        }
    }

    private void saveSpecialCapabilities(Recipient recipient, List<String> capabilities) {
        if (capabilities == null || capabilities.isEmpty()) {
            log.debug("No special capabilities provided for recipient: {}", recipient.getId());
            return;
        }

        try {
            log.debug("Saving {} special capabilities for recipient: {}", capabilities.size(), recipient.getId());

            for (String capability : capabilities) {
                SpecialCapability specialCapability = SpecialCapability.builder()
                        .specialCapability(capability)
                        .recipient(recipient)
                        .build();
                capabilityRepository.save(specialCapability);
            }

            log.debug("Successfully saved all special capabilities for recipient: {}", recipient.getId());

        } catch (Exception e) {
            log.error("Failed to save special capabilities for recipient: {}. Error: {}", recipient.getId(), e.getMessage(), e);
            throw new RuntimeException("Failed to save special capabilities", e);
        }
    }

    private void saveStorageCapabilities(Recipient recipient, List<String> storageCapabilities) {
        if (storageCapabilities == null || storageCapabilities.isEmpty()) {
            log.debug("No storage capabilities provided for recipient: {}", recipient.getId());
            return;
        }

        try {
            log.debug("Saving {} storage capabilities for recipient: {}", storageCapabilities.size(), recipient.getId());

            for (String storage : storageCapabilities) {
                StorageCapability storageCapability = StorageCapability.builder()
                        .storageType(storage)
                        .recipient(recipient)
                        .build();
                storageCapabilityRepository.save(storageCapability);
            }

            log.debug("Successfully saved all storage capabilities for recipient: {}", recipient.getId());

        } catch (Exception e) {
            log.error("Failed to save storage capabilities for recipient: {}. Error: {}", recipient.getId(), e.getMessage(), e);
            throw new RuntimeException("Failed to save storage capabilities", e);
        }
    }

    private void saveOpenHours(Recipient recipient, Map<String, List<String>> openHours) {
        if (openHours == null || openHours.isEmpty()) {
            log.debug("No open hours provided for recipient: {}", recipient.getId());
            return;
        }

        try {
            log.debug("Saving open hours for recipient: {}", recipient.getId());

            for (Map.Entry<String, List<String>> entry : openHours.entrySet()) {
                String day = entry.getKey();
                List<String> hours = entry.getValue();

                for (String range : hours) {
                    saveOpenHourRange(recipient, day, range);
                }
            }

            log.debug("Successfully saved all open hours for recipient: {}", recipient.getId());

        } catch (Exception e) {
            log.error("Failed to save open hours for recipient: {}. Error: {}", recipient.getId(), e.getMessage(), e);
            throw new RuntimeException("Failed to save open hours", e);
        }
    }

    private void saveOpenHourRange(Recipient recipient, String day, String range) {
        try {
            String[] parts = range.split("-");
            if (parts.length != 2) {
                log.warn("Invalid time range format for recipient: {} on day: {}. Range: {}",
                        recipient.getId(), day, range);
                return;
            }

            Time openTime = Time.valueOf(parts[0].trim() + ":00");
            Time closeTime = Time.valueOf(parts[1].trim() + ":00");

            OpenHour openHour = OpenHour.builder()
                    .dayOfWeek(OpenHour.DayOfWeek.valueOf(day))
                    .openTime(openTime)
                    .closeTime(closeTime)
                    .recipient(recipient)
                    .build();

            openHourRepository.save(openHour);

        } catch (Exception e) {
            log.error("Failed to save open hour range for recipient: {} on day: {}. Range: {}. Error: {}",
                    recipient.getId(), day, range, e.getMessage(), e);
            throw new RuntimeException("Failed to save open hour range", e);
        }
    }

    public void deleteRecipientById(String id) {
        log.info("Attempting to delete recipient with ID: {}", id);

        if (!recipientRepository.existsById(id)) {
            log.warn("Recipient with ID {} not found for deletion", id);
            throw new EntityNotFoundException("Recipient with id " + id + " not found");
        }

        recipientRepository.deleteById(id);
        log.info("Successfully deleted recipient with ID: {}", id);
    }
}