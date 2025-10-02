package com.notification.service.deserializers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.notification.service.models.DonationDTO;
import org.apache.kafka.common.errors.SerializationException;
import org.apache.kafka.common.serialization.Deserializer;

import java.io.IOException;
import java.util.Map;

public class DonationDeserializer implements Deserializer<DonationDTO> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void configure(Map<String, ?> configs, boolean isKey) {
    }

    @Override
    public DonationDTO deserialize(String topic, byte[] data) {
        DonationDTO donationDTO;
        try {
            if (data == null) return null;
            donationDTO = objectMapper.readValue(data, DonationDTO.class);
        } catch (IOException e) {
            throw new SerializationException("Error deserializing DonationDTO", e);
        }

        return donationDTO;
    }

    @Override
    public void close() {}
}
