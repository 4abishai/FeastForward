package org.example.model;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class DonorInfoDTO {
    private Long id;
    private String name;
    private String address;
    private String password;
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

    @Getter
    @Setter
    @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
    public static class UpdatePasswordDTO {
        private String oldPassword;
        private String newPassword;
    }
}
