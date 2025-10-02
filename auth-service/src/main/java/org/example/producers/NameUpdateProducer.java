package org.example.producers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.model.NameUpdateDTO;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NameUpdateProducer {
    private final org.springframework.amqp.rabbit.core.RabbitTemplate rabbitTemplate;

    public void sendNameUpdate(NameUpdateDTO nameUpdateDTO) {
        rabbitTemplate.convertAndSend("name-update-exchange", "name.update.shared", nameUpdateDTO);
        log.info("Name update message sent to exchange with routing key 'name.update.shared'");
    }
}
