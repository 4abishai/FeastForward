package com.recipient.service.entities;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import org.locationtech.jts.geom.Point;

@Entity
@Table(name = "recipients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recipient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(precision = 9, scale = 6)
    private BigDecimal latitude;
    @Column(precision = 9, scale = 6)
    private BigDecimal longitude;

    @Column(columnDefinition = "geometry(Point,4326)")
    private Point location;

    @Enumerated(EnumType.STRING)
    private RecipientStatus status;

    @Column(length = 500)
    private String description;

    private String timezone;

    @Builder.Default
    @OneToMany(mappedBy = "recipient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Contact> contacts = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "recipient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AcceptedType> acceptedTypes = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "recipient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SpecialCapability> specialCapabilities = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "recipient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StorageCapability> storageCapabilities = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "recipient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OpenHour> openHours = new ArrayList<>();

    private LocalDateTime createdAt;


    private String summarizeList(List<?> list) {
        if (list == null || list.isEmpty()) return "[]";
        return list.stream()
                .map(item -> {
                    if (item == null) return "null";
                    return item.toString();
                })
                .limit(5) // Avoid printing too much
                .collect(Collectors.joining(", ", "[", "]"));
    }


    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public enum RecipientStatus {
        active, suspended, inactive
    }

    @Override
    public String toString() {
        return "Recipient{" +
                "id='" + id + '\'' +
                ", latitude=" + latitude +
                ", longitude=" + longitude +
                ", status=" + status +
                ", timezone='" + timezone + '\'' +
                ", acceptedTypes=" + summarizeList(acceptedTypes) +
                ", storageCapabilities=" + summarizeList(storageCapabilities) +
                ", openHours=" + summarizeList(openHours) +
                '}';
    }
}
