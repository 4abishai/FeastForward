package com.recipient.service.utils;

import com.recipient.service.entities.*;
import com.recipient.service.models.RecipientDTO;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class RecipientMapper {

    public RecipientDTO toDTO(Recipient recipient) {
        if (recipient == null) return null;

        RecipientDTO dto = new RecipientDTO();
        dto.setId(recipient.getId());
        dto.setName(recipient.getName());
        dto.setAddress(recipient.getAddress());
        dto.setDescription(recipient.getDescription());
        dto.setStatus(recipient.getStatus().name());
        dto.setTimezone(recipient.getTimezone());

        // Map location
        if (recipient.getLatitude() != null && recipient.getLongitude() != null) {
            RecipientDTO.Location location = new RecipientDTO.Location();
            location.setLatitude(recipient.getLatitude().doubleValue());
            location.setLongitude(recipient.getLongitude().doubleValue());
            dto.setLocation(location);
        }

        // Map contact (first one only; adjust if you support multiple)
        if (!recipient.getContacts().isEmpty()) {
            Contact entityContact = recipient.getContacts().get(0);
            RecipientDTO.Contact contact = new RecipientDTO.Contact();
            contact.setName(entityContact.getName());
            contact.setEmail(entityContact.getEmail());
            contact.setPhone(entityContact.getPhone());
            dto.setContact(contact);
        }

        // Map accepted types
        dto.setAcceptedTypes(
                recipient.getAcceptedTypes().stream()
                        .map(accepted -> {
                            RecipientDTO.AcceptedTypes at = new RecipientDTO.AcceptedTypes();
                            at.setType(accepted.getType());
                            at.setUnit(accepted.getUnit());
                            at.setMinQuantity(accepted.getMinQuantity());
                            return at;
                        })
                        .toList()
        );

        // Map special capabilities
        dto.setSpecialCapabilities(
                recipient.getSpecialCapabilities().stream()
                        .map(SpecialCapability::getSpecialCapability)
                        .toList()
        );

        // Map storage capabilities
        dto.setStorageCapabilities(
                recipient.getStorageCapabilities().stream()
                        .map(StorageCapability::getStorageType)
                        .toList()
        );

        // Map open hours
        Map<String, List<String>> openHoursMap = new HashMap<>();
        for (OpenHour oh : recipient.getOpenHours()) {
            String day = oh.getDayOfWeek().name().toLowerCase(); // keep keys consistent with DTO
            String timeRange = oh.getOpenTime() + " - " + oh.getCloseTime();
            openHoursMap.computeIfAbsent(day, k -> new ArrayList<>()).add(timeRange);
        }
        dto.setOpenHours(openHoursMap);

        return dto;
    }

    public List<RecipientDTO> toDTOList(List<Recipient> recipients) {
        return recipients.stream()
                .map(this::toDTO)
                .toList();
    }
}
