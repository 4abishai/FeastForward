package com.donation.records.service.consumers;

import com.donation.records.service.models.DonationDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class DonationMsgConsumer {

    @RabbitListener(queues = "donation-test")
    public void handleTest(DonationDTO donationDTO) {
        log.info("Donation received: {}", donationDTO);
    }
}
