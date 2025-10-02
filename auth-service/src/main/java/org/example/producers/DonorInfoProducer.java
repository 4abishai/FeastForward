package org.example.producers;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.model.DonorInfoDTO;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class DonorInfoProducer {

    private final RabbitTemplate rabbitTemplate;

    public void sendDonorInfo(DonorInfoDTO donorInfoDTO) {
        rabbitTemplate.convertAndSend("donor-info-exchange", "donor.info.shared", donorInfoDTO);
        log.info("Donor info message sent to exchange with routing key 'donation.info.shared'");
    }}
