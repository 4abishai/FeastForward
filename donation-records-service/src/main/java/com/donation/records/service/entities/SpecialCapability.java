package com.donation.records.service.entities;

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
    @JoinColumn(name = "donation_id")
    private Donation donation;
}
