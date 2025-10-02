package com.recipient.service.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "capabilities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpecialCapability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String specialCapability;

    @ManyToOne
    @JoinColumn(name = "recipient_id")
    private Recipient recipient;
}
