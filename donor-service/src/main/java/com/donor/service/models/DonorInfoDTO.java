package com.donor.service.models;

import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.Data;

@Getter
@Setter
@ToString
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class DonorInfoDTO {
    private Long id;
    private String name;
    private String address;
    private Location location;
    private Contact contact;

    @Data
    public static class Location {
        private double latitude;
        private double longitude;
    }

    @Data
    public static class Contact {
        private String email;
        private String phone;
    }
}
