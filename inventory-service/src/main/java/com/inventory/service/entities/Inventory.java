package com.inventory.service.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "inventory")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long donationId;
    private Long donorId;
    private Long recipientId;

    @Builder.Default
    private String status = "unfulfilled";

    private String name;

    private String type;

    private Integer quantity;

    private String unit;

    @Builder.Default
    @OneToMany(mappedBy = "inventory", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SpecialCapability> specialCapabilityList = new ArrayList<>();

    private String packagingType;

    private String storageCapability;

}
