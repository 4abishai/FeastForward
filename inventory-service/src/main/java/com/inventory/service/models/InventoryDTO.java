package com.inventory.service.models;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Data
@Getter
@Setter
@Builder
public class InventoryDTO {

    private Long id;

    private Long donationId;
    private Long donorId;
    private Long recipientId;

    private String status;
    private String name;
    private String type;
    private Integer quantity;
    private String unit;
    private String packagingType;
    private String storageCapability;

    private List<String> specialCapabilities;

    public static class PerformanceMetrics {
        private final long messageCount;
        private final long totalLatencyNs;

        public PerformanceMetrics(long messageCount, long totalLatencyNs) {
            this.messageCount = messageCount;
            this.totalLatencyNs = totalLatencyNs;
        }

        public double getAvgLatencyMs() {
            return (totalLatencyNs / (double) messageCount) / 1_000_000.0;
        }

        public long getMessageCount() {
            return messageCount;
        }
    }
}
