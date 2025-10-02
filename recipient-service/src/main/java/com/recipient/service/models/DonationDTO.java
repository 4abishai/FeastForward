package com.recipient.service.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class DonationDTO {

    private Donor donor;
    private Donation donation;

    @Data
    public static class Donor {
        private Long id;
        private String name;
        private String address;
        private Location location;
        private Contact contact;

    }

    @Data
    public static class Location {
        private double latitude;
        private double longitude;
    }

    @Data
    public static class Contact{
        private String email;
        private String phone;
    }


    @Data
    public static class Donation {
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
}
