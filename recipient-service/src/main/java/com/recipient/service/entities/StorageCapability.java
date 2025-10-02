package com.recipient.service.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "storage_capabilities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StorageCapability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String storageType;

    @ManyToOne
    @JoinColumn(name = "recipient_id")
    private Recipient recipient;


    @Override
    public String toString() {
        return "StorageCapability{" +
                "storageType=" + storageType+
                '}';
    }
}
