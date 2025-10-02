package com.inventory.service.consumers;

import com.inventory.service.models.DonationDTO;
import com.inventory.service.services.InventoryService;
import io.micrometer.core.instrument.Metrics;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;

@Service
@Slf4j
@RequiredArgsConstructor
public class DonationMsgConsumer {
    private final InventoryService inventoryService;

    private static final AtomicLong totalLatencyNs = new AtomicLong();
    private static final AtomicLong messageCount = new AtomicLong();

    private static final AtomicLong lastReportCount = new AtomicLong(0);
    private static final AtomicLong baselineLatencyNs = new AtomicLong(-1);
    private static final AtomicLong lastMessageTime = new AtomicLong(System.currentTimeMillis());
    private static final AtomicLong firstMessageTime = new AtomicLong(-1);
    private static volatile boolean finalReportPrinted = false;

    @Scheduled(fixedRate = 5000)
    public void reportMetrics() {
        long count = messageCount.get();
        long lastCount = lastReportCount.getAndSet(count);
        long now = System.currentTimeMillis();

        if (count == 0) {
            log.info("PERF REPORT: No messages processed yet.");
            return;
        }

        if (firstMessageTime.get() == -1) {
            firstMessageTime.set(now);
        }

        long intervalMsgs = count - lastCount;

        if (intervalMsgs > 0) {
            long avgLatencyNs = totalLatencyNs.get() / count;

            if (baselineLatencyNs.get() == -1) {
                baselineLatencyNs.set(avgLatencyNs);
            }

            double latencyChange = ((avgLatencyNs - baselineLatencyNs.get()) * 100.0) / baselineLatencyNs.get();
            double throughput = intervalMsgs / 5.0; // every 5 seconds

            log.info("PERF REPORT: Total msgs={} | Interval throughput={} msg/sec | Latency change vs baseline={}%",
                    count,
                    String.format("%.2f", throughput),
                    String.format("%.2f", latencyChange));

            lastMessageTime.set(now);
            finalReportPrinted = false;
        } else {
            long idleTime = now - lastMessageTime.get();
            if (idleTime > 5000 && !finalReportPrinted) {
                double latencyChange = ((totalLatencyNs.get() / count - baselineLatencyNs.get()) * 100.0) / baselineLatencyNs.get();
                double totalTimeSec = (now - firstMessageTime.get()) / 1000.0;
                double sustainedThroughput = count / totalTimeSec;

                log.info("FINAL REPORT: Processed {} messages | Sustained throughput={} msg/sec | Latency change={}%",
                        count,
                        String.format("%.2f", sustainedThroughput),
                        String.format("%.2f", latencyChange));

                finalReportPrinted = true;
            } else if (!finalReportPrinted) {
                log.info("PERF REPORT: No new messages in last 5000 ms. Total processed={}", count);
            }
        }
    }

    @RabbitListener(queues = "donation-inventory", containerFactory = "rabbitListenerContainerFactory")
    public void handleInventory(List<DonationDTO> donationDTOList) {
        long start = System.nanoTime();

        inventoryService.saveDonations(donationDTOList);

        long totalBatchTime = System.nanoTime() - start;
        totalLatencyNs.addAndGet(totalBatchTime);
        messageCount.addAndGet(donationDTOList.size());
    }
}
