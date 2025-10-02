package com.donor.service.controllers;

import com.donor.service.models.DonorInfoDTO;
import com.donor.service.services.DonorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class DonorController {
    private final DonorService donorService;

    @PostMapping("/donor/v1/createDonor")
    public String createDonor(@RequestBody DonorInfoDTO dto) {
        try {
            donorService.saveDonor(dto);
        } catch (Exception e) {
            return "Error saving donor: " + e.getMessage();
        }
        return "Donor created successfully";
    }


    @GetMapping("/donor/v1/getDonor")
    public ResponseEntity<?> getDonor(@RequestHeader("donor_id") Long donorId) {
        try {
            DonorInfoDTO donor = donorService.getDonorById(donorId);
            return ResponseEntity.ok(donor);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error fetching donor: " + e.getMessage());
        }
    }

}
