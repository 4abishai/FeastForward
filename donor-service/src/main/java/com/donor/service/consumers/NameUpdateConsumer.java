package com.donor.service.consumers;

import com.donor.service.models.DonorInfoDTO;
import com.donor.service.models.NameUpdateDTO;
import com.donor.service.services.DonorService;
import com.donor.service.services.NameUpdateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class NameUpdateConsumer {

    private final NameUpdateService nameUpdateService;

    @RabbitListener(queues = "name-update")
    public void handleNameUpdate(NameUpdateDTO nameUpdateDTO) {
        log.info("Donation received: {}", nameUpdateDTO);
        try {
            nameUpdateService.updateName(nameUpdateDTO);
        } catch (Exception e) {
            log.error("Error while saving donor info: {}", e.getMessage());
        }
    }
}
