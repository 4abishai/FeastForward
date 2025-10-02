package com.donor.service.models;

import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class DetailsUpdateDTO {
    private String address;
    private DonorInfoDTO.Location location;
    private DonorInfoDTO.Contact contact;

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
