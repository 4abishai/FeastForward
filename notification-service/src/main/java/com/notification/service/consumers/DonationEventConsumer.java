package com.notification.service.consumers;

import com.notification.service.models.DonationDTO;
import com.notification.service.services.EmailService;
import com.notification.service.services.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class DonationEventConsumer {

    private final NotificationService notificationService;

    @KafkaListener(topics = "${spring.kafka.topic.name}", groupId = "${spring.kafka.consumer.group-id}")
    public void consumeDonationEvent(DonationDTO donationDTO,
                                     @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
                                     @Header(KafkaHeaders.OFFSET) long offset) {

        log.info("Consumed donation event from partition [{}] with offset [{}]", partition, offset);
        log.info("Donation Event Data: {}", donationDTO);

        try {
            notificationService.sendEmailDonorRecipient(donationDTO);
        }
        catch (Exception e) {
            log.error("Failed to process donation event at partition [{}], offset [{}]. Error: {}",
                    partition, offset, e.getMessage(), e);
        }

    }
}
