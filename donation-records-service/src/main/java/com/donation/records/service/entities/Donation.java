package com.donation.records.service.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "donations")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long donorId;
    private Long recipientId;

    private String donorName;
    private String recipientName;

    private String donationName;

    private String type;

    private Integer quantity;

    private String unit;

    @Builder.Default
    @OneToMany(mappedBy = "donation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SpecialCapability> specialCapabilityList = new ArrayList<>();

    private String donationPickupTime;

    private String packagingType;

    private String storageCapability;

}
