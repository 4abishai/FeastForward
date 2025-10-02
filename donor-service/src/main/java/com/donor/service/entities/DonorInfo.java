package com.donor.service.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "donors_info")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DonorInfo {

    @Id
    private Long id;
    private String name;
    private String address;
    private Double latitude;
    private Double longitude;
    private String email;
    private String phone;

}
