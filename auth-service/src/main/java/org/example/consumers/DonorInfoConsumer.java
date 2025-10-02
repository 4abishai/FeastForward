package org.example.consumers;

import lombok.extern.slf4j.Slf4j;
import org.example.model.DonorInfoDTO;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class DonorInfoConsumer {

    @RabbitListener(queues = "donor-test")
    public void handleTest(DonorInfoDTO donorInfoDTO) {
        log.info("Donation received: {}", donorInfoDTO);
    }
}
