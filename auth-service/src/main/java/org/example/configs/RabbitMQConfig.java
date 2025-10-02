package org.example.configs;

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
    public DirectExchange donorInfoExchange() {
        return new DirectExchange("donor-info-exchange");
    }

    @Bean
    public DirectExchange nameUpdateExchange() { return new DirectExchange("name-update-exchange"); }

    @Bean
    public Queue nameUpdateQueue() { return new Queue("name-update", true); }

    @Bean
    public Queue donorInfoQueue() {
        return new Queue("donor-info", true);
    }


    @Bean
    public Queue donorTestQueue() {
        return new Queue("donor-test", true);
    }

    @Bean
    public Binding nameUpdateBinding(Queue nameUpdateQueue, DirectExchange nameUpdateExchange) {
        return BindingBuilder.bind(nameUpdateQueue)
                .to(nameUpdateExchange)
                .with("name.update.shared");
    }

    @Bean
    public Binding donorInfoBinding(Queue donorInfoQueue, DirectExchange donorInfoExchange) {
        return BindingBuilder.bind(donorInfoQueue)
                .to(donorInfoExchange)
                .with("donor.info.shared");
    }

    @Bean
    public Binding testBinding(Queue donorTestQueue, DirectExchange donorInfoExchange) {
        return BindingBuilder.bind(donorTestQueue)
                .to(donorInfoExchange)
                .with("donor.info.shared");
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
