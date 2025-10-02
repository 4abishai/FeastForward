package com.inventory.service.models;

public class PerformanceMetrics {
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