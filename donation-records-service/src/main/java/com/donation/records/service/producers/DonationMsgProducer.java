package com.donation.records.service.producers;

import com.donation.records.service.models.DonationDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class DonationMsgProducer {

    private final RabbitTemplate rabbitTemplate;

    public void sendDonation(DonationDTO donationDTO) {
        rabbitTemplate.convertAndSend("donation-exchange", "donation.shared", donationDTO);
        log.info("Donation message sent to exchange with routing key 'donation.shared'");
    }
}