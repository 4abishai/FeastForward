package com.inventory.service.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class DonationDTO {
    private Donation donation;
    private Donor donor;
    private Recipient recipient;

    @Data
    public static class Donor {
        private Long id;
        private String name;
        private String address;
        private Location location;
        private Contact contact;

    }

    @Data
    public static class Donation {
        private Long id;
        private String name;
        private String type;
        private int quantity;
        private String unit;

        @JsonProperty("special_capabilities")
        private List<String> specialCapabilities;

        @JsonProperty("donation_pickup_time")
        private String donationPickupTime;

        @JsonProperty("packaging_type")
        private String packagingType;

        @JsonProperty("storage_capability")
        private String storageCapability;
    }

    @Data
    public static class Recipient {
        private Long id;
        private String name;
        private String address;
        private String description;
        private Location location;
        private String timezone;
        private Contact contact;

        @JsonProperty("accepted_types")
        private List<AcceptedType> acceptedTypes;

        @JsonProperty("special_capabilities")
        private List<String> specialCapabilities;

        @JsonProperty("storage_capabilities")
        private List<String> storageCapabilities;

        @JsonProperty("open_hours")
        private Map<String, List<String>> openHours;
    }


    @Data
    public static class Location {
        private double latitude;
        private double longitude;
    }

    @Data
    public static class AcceptedType {
        private String type;
        private String unit;

        @JsonProperty("min_quantity")
        private int minQuantity;
    }

    @Data
    public static class Contact {
        private String email;
        private String phone;
    }

}
