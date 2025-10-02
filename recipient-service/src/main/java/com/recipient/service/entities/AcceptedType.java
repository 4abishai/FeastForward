package com.recipient.service.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "accepted_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AcceptedType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;

    private Integer minQuantity;

    private String unit;

    @ManyToOne
    @JoinColumn(name = "recipient_id")
    private Recipient recipient;

    @Override
    public String toString() {
        return "AcceptedType{" +
                "type=" + type +
                ", minQuantity=" + minQuantity+
                ", unit=" + unit+
                '}';
    }

}
