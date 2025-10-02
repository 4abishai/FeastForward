package com.recipient.service.services;

import com.recipient.service.entities.OpenHour;
import com.recipient.service.entities.Recipient;
import com.recipient.service.models.DonationDTO;
import com.recipient.service.models.RecipientDTO;
import com.recipient.service.repositories.RecipientRepository;
import com.recipient.service.utils.RecipientMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.format.DateTimeParseException;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class DonationService {

    private final RecipientRepository recipientRepository;
    private final RecipientMapper recipientMapper;

    public List<RecipientDTO> findEligibleRecipients(DonationDTO donationDTO, double radiusInKm) {

        List<Recipient> recipients =  recipientRepository.findMatchingRecipients(donationDTO, radiusInKm); // 25km radius

        log.info("Recipients after SQL filtering: {}", recipients);

        // Parse donor's availableUntilUtc to Instant
        Instant donationPickupTime;
        try {
            donationPickupTime = Instant.parse(donationDTO.getDonation().getDonationPickupTime());
        } catch (DateTimeParseException e) {
            log.error("Invalid date format: {}", donationDTO.getDonation().getDonationPickupTime());
            throw new IllegalArgumentException("Invalid donation_pickup_time format.");
        }

        System.out.println("Donation Pickup Time: " + donationPickupTime);

        recipients  = recipients.stream()
                .filter(recipient -> isRecipientOpenAtPickup(recipient, donationPickupTime))
                .toList();

        log.info("Recipients after backend filtering: {}", recipients);

        return recipientMapper.toDTOList(recipients);
    }

    private boolean isRecipientOpenAtPickup(Recipient recipient, Instant donationPickupTimeUtc) {
        ZoneId recipientZone = ZoneId.of(recipient.getTimezone());
        ZonedDateTime pickupDateTime = donationPickupTimeUtc.atZone(recipientZone);

        OpenHour.DayOfWeek pickupDay = OpenHour.DayOfWeek.valueOf(pickupDateTime.getDayOfWeek().name().toLowerCase());
        LocalTime pickupTime = pickupDateTime.toLocalTime();

        log.info("Checking recipient {} for pickup day {} and time {}", recipient.getId(), pickupDay, pickupTime);

        for (OpenHour hour : recipient.getOpenHours()) {
            log.info("OpenHour: day={}, open={}, close={}", hour.getDayOfWeek(), hour.getOpenTime(), hour.getCloseTime());

            if (hour.getDayOfWeek() != pickupDay) {
                log.info("Skipping due to day mismatch");
                continue;
            }

            LocalTime open = hour.getOpenTime().toLocalTime();
            LocalTime close = hour.getCloseTime().toLocalTime();

            if (!pickupTime.isBefore(open) && !pickupTime.isAfter(close)) {
                log.info("Recipient {} is open at pickup time", recipient.getId());
                return true;
            }
        }

        log.info("Recipient {} is NOT open at pickup time", recipient.getId());
        return false;
    }

}
