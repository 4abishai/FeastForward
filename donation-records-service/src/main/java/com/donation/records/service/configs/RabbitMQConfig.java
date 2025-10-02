package com.donation.records.service.configs;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
@Configuration
public class RabbitMQConfig {

    @Bean
    public DirectExchange donationExchange() {
        return new DirectExchange("donation-exchange");
    }

    @Bean
    public Queue donationInventoryQueue() {
        return new Queue("donation-inventory", true);
    }

    @Bean
    public Queue donationNotificationQueue() {
        return new Queue("donation-notification", true);
    }

    @Bean
    public Queue donationTestQueue() {
        return new Queue("donation-test", true);
    }

    @Bean
    public Binding inventoryBinding(Queue donationInventoryQueue, DirectExchange donationExchange) {
        return BindingBuilder.bind(donationInventoryQueue)
                .to(donationExchange)
                .with("donation.shared");
    }

    @Bean
    public Binding notificationBinding(Queue donationNotificationQueue, DirectExchange donationExchange) {
        return BindingBuilder.bind(donationNotificationQueue)
                .to(donationExchange)
                .with("donation.shared");
    }

    @Bean
    public Binding testBinding(Queue donationTestQueue, DirectExchange donationExchange) {
        return BindingBuilder.bind(donationTestQueue)
                .to(donationExchange)
                .with("donation.shared");
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter());
        return template;
    }
}
