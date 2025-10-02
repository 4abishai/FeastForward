package com.notification.service.services;

import com.notification.service.models.DonationDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final EmailService emailService;
    private final SmsService smsService;

    public void sendEmailDonorRecipient(DonationDTO donationDTO) {
        // Mail Donor
        String donorName = donationDTO.getDonor().getName();
        String recipientName = donationDTO.getRecipient().getName();
        String donationName = donationDTO.getDonation().getName();
        String pickUpTime = donationDTO.getDonation().getDonationPickupTime();
        String donorPhone = donationDTO.getDonor().getContact().getPhone();
        String recipientPhone = donationDTO.getRecipient().getContact().getPhone();

        String donorSubject = "Your donation request has been posted";
        String donorBody = String.format(
                "Dear %s,\n\n" +
                        "Thank you for your generosity. Your donation of \"%s\" has been successfully created.\n" +
                        "The recipient %s, will arrange to collect it at the scheduled time: %s.\n\n" +
                        "Best regards,\n" +
                        "Donation Platform Team",
                donorName,
                donationName,
                recipientName,
                pickUpTime
        );
        emailService.sendEmail(donorName, donorSubject, donorBody);

        // Mail Recipient
        String recipientSubject = "A new donation is ready for pickup";
        String recipientBody = String.format(
                "Dear %s,\n\n" +
                        "A new donation from %s is ready for your organization.\n" +
                        "Donation details:\n" +
                        " - Name: %s\n" +
                        " - Quantity: %d %s\n" +
                        " - Pickup Time: %s\n\n" +
                        "Please make arrangements to collect the donation.\n\n" +
                        "Best regards,\n" +
                        "Donation Platform Team",
                recipientName,
                donorName,
                donationName,
                donationDTO.getDonation().getQuantity(),
                donationDTO.getDonation().getUnit(),
                donationDTO.getDonation().getDonationPickupTime()
        );
        emailService.sendEmail(recipientName, recipientSubject, recipientBody);

        // Sms Donor and Recipient
        smsService.sendSms(donorPhone, donorBody);
        smsService.sendSms(recipientPhone, recipientBody);
    }

}
