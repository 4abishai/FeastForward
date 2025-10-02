package com.recipient.service.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class RecipientDTO {
        private Long id;
        private String name;
        private String address;
        private String description;
        private Location location;
        private String status;
        private String timezone;

        @JsonProperty("accepted_types")
        private List<AcceptedTypes> acceptedTypes;

        @JsonProperty("special_capabilities")
        private List<String> specialCapabilities;

        @JsonProperty("storage_capabilities")
        private List<String> storageCapabilities;

        @JsonProperty("open_hours")
        private Map<String, List<String>> openHours;

        private Contact contact;

    @Data
    public static class Location {
        private double latitude;
        private double longitude;
    }

    @Data
    public static class Contact{
        private String name;
        private String email;
        private String phone;
    }

    @Data
    public static class AcceptedTypes{
        private String type;
        private String unit;
        @JsonProperty("min_quantity")
        private int minQuantity;
    }
}
