package com.donation.records.service.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class DonationHistoryDTO {
    private Long id;

    @JsonProperty("donor_name")
    private String donorName;

    @JsonProperty("recipient_name")
    private String recipientName;

    @JsonProperty("donation_name")
    private String donationName;
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
