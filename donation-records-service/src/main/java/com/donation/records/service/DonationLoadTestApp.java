package com.donation.records.service;

import com.donation.records.service.models.DonationDTO;
import com.donation.records.service.producers.DonationMsgProducer;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.Arrays;

//@SpringBootApplication
//public class DonationLoadTestApp {
//
//public static void main(String[] args) {
//    SpringApplication.run(DonationLoadTestApp.class, args);
//}
//
//    @Bean
//    CommandLineRunner loadTestRunner(DonationMsgProducer producer) {
//        return args -> {
////            int totalMessages = 3;
////            int totalMessages = 50;
////            int totalMessages = 100;
//            int totalMessages = 500;
//            DonationDTO sample = buildSampleDonation();
//
//            long start = System.currentTimeMillis();
//            for (int i = 0; i < totalMessages; i++) {
//                producer.sendDonation(sample);
//            }
//            long end = System.currentTimeMillis();
//
//            double throughput = (totalMessages * 1000.0) / (end - start);
//            System.out.printf("Sent %d messages in %d ms (%.2f msg/sec)%n",
//                    totalMessages, (end - start), throughput);
//        };
//    }
//
//    private DonationDTO buildSampleDonation() {
//        DonationDTO dto = new DonationDTO();
//
//        DonationDTO.Donor donor = new DonationDTO.Donor();
//        donor.setId(1L);
//        donor.setName("Donor A");
//
//        DonationDTO.Donation donation = new DonationDTO.Donation();
//        donation.setId(1L);
//        donation.setName("Rice Bags");
//        donation.setType("Food");
//        donation.setQuantity(10);
//        donation.setUnit("kg");
//        donation.setSpecialCapabilities(Arrays.asList("Keep Dry", "Fragile"));
//
//        DonationDTO.Recipient recipient = new DonationDTO.Recipient();
//        recipient.setId(2L);
//        recipient.setName("Recipient B");
//
//        dto.setDonor(donor);
//        dto.setDonation(donation);
//        dto.setRecipient(recipient);
//
//        return dto;
//    }
//
//}

@SpringBootApplication
public class DonationLoadTestApp {

    public static void main(String[] args) {
        SpringApplication.run(DonationLoadTestApp.class, args);
    }

    @Bean
    CommandLineRunner loadTestRunner(DonationMsgProducer producer) {
        return args -> {
            int[] testSizes =  {100, 500, 1000}; // run for different loads
            DonationDTO sample = buildSampleDonation();

            for (int totalMessages : testSizes) {
                long start = System.currentTimeMillis();
                for (int i = 0; i < totalMessages; i++) {
                    producer.sendDonation(sample);
                }
                long end = System.currentTimeMillis();

                double throughput = (totalMessages * 1000.0) / (end - start);
                System.out.printf("SENT: %d messages in %d ms (%.2f msg/sec)%n",
                        totalMessages, (end - start), throughput);
            }
        };
    }

    private DonationDTO buildSampleDonation() {
        DonationDTO dto = new DonationDTO();

        DonationDTO.Donor donor = new DonationDTO.Donor();
        donor.setId(1L);
        donor.setName("Donor A");

        DonationDTO.Donation donation = new DonationDTO.Donation();
        donation.setId(1L);
        donation.setName("Rice Bags");
        donation.setType("Food");
        donation.setQuantity(10);
        donation.setUnit("kg");
        donation.setSpecialCapabilities(Arrays.asList("Keep Dry", "Fragile"));

        DonationDTO.Recipient recipient = new DonationDTO.Recipient();
        recipient.setId(2L);
        recipient.setName("Recipient B");

        dto.setDonor(donor);
        dto.setDonation(donation);
        dto.setRecipient(recipient);

        return dto;
    }
}
