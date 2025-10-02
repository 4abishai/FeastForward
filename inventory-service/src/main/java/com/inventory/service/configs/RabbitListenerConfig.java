package com.inventory.service.configs;

import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@EnableRabbit
@Configuration
public class RabbitListenerConfig {

    @Bean
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(
            ConnectionFactory connectionFactory,
            MessageConverter messageConverter
    ) {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(messageConverter);
//        // Aggressive concurrency tuning

//        factory.setConcurrentConsumers(10);
//        factory.setMaxConcurrentConsumers(20);
//
//        factory.setConcurrentConsumers(20);
//        factory.setMaxConcurrentConsumers(40);
//        // Prefetch tuning
//        factory.setPrefetchCount(100);
//
//        // Batch processing
//        factory.setBatchListener(true);
////        factory.setBatchSize(20);
//        factory.setBatchSize(10);
//

        // Concurrency tuning
        factory.setConcurrentConsumers(10);
        factory.setMaxConcurrentConsumers(20);

        // Prefetch tuning
        factory.setPrefetchCount(20); // smaller prefetch to reduce waiting time

        // Batch processing tuning
        factory.setBatchListener(true);
        factory.setBatchSize(5); // smaller batch size to reduce batch waiting latency

        return factory;
    }
}
