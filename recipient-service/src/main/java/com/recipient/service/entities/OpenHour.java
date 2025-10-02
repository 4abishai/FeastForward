package com.recipient.service.entities;

import jakarta.persistence.*;
import lombok.*;
import java.sql.Time;

@Entity
@Table(name = "open_hours")
@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OpenHour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private DayOfWeek dayOfWeek;

    private Time openTime;

    private Time closeTime;

    @ManyToOne
    @JoinColumn(name = "recipient_id")
    private Recipient recipient;

    @Override
    public String toString() {
        return "OpenHour{" +
                "dayOfWeek=" + dayOfWeek +
                ", openTime=" + openTime +
                ", closeTime=" + closeTime +
                '}';
    }

    public enum DayOfWeek {
        monday, tuesday, wednesday, thursday, friday, saturday, sunday
    }
}
