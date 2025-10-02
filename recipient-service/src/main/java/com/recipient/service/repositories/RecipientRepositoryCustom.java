package com.recipient.service.repositories;

import com.recipient.service.entities.Recipient;
import com.recipient.service.models.DonationDTO;

import java.util.List;

public interface RecipientRepositoryCustom {
    List<Recipient> findMatchingRecipients(DonationDTO donationDTO, double radiusInKm);
}
