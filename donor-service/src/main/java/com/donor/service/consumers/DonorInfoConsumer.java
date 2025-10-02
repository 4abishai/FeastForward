package com.donor.service.consumers;

import com.donor.service.models.DonorInfoDTO;
import com.donor.service.services.DonorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class DonorInfoConsumer {

    private final DonorService donorService;

    @RabbitListener(queues = "donor-info")
    public void handleDonorInfo(DonorInfoDTO donorInfoDTO) {
        log.info("Donation received: {}", donorInfoDTO);
        try {
            donorService.saveDonor(donorInfoDTO);
        } catch (Exception e) {
            log.error("Error while saving donor info: {}", e.getMessage());
        }
    }
}
