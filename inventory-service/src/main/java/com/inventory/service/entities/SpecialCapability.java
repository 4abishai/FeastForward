package com.inventory.service.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "special_capability")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpecialCapability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String capability;

    @ManyToOne
    @JoinColumn(name = "inventory_id")
    private Inventory inventory;
}
