package com.donation.records.service.controllers;

import com.donation.records.service.models.DonationDTO;
import com.donation.records.service.models.DonationHistoryDTO;
import com.donation.records.service.services.DonationService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
public class DonationController {

    private final DonationService donationService;

    @PostMapping("/donation/v1/createDonation")
    public ResponseEntity<String> createDonation(@RequestBody DonationDTO dto) {
        try {
            donationService.createDonation(dto);
            return ResponseEntity.ok("Donation created and saved");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to create donation" + e.getMessage());
        }
    }

    @GetMapping("/donation/v1/fetchDonationHistory")
    public ResponseEntity<List<DonationHistoryDTO>> fetchDonationHistory(@RequestHeader ("donor_id") Long donorId) {
        try {
            List<DonationHistoryDTO> donationHistory = donationService.fetchDonationHistory(donorId);
            if (donationHistory.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(List.of());
            }
            return ResponseEntity.ok(donationHistory);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(List.of());
        }

    }


    @GetMapping("/donation/health")
    public ResponseEntity<String> checkHealth() {
        return ResponseEntity.status(HttpStatus.OK).body("Service is healthy");
    }
}
