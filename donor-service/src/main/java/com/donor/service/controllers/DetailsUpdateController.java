package com.donor.service.controllers;

import com.donor.service.models.DetailsUpdateDTO;
import com.donor.service.services.DetailsUpdateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/donor/v1")
public class DetailsUpdateController {

    private final DetailsUpdateService detailsUpdateService;

    @PutMapping("/updateDetails")
    public ResponseEntity<String> updateDonorDetails(
            @RequestHeader("donor_id") Long donorId,
            @RequestBody DetailsUpdateDTO updateDTO) {

        try {
            detailsUpdateService.updateDonorDetails(donorId, updateDTO);
            return ResponseEntity.ok("Donor details updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(409).body("Error updating donor details: " + e.getMessage());
        }
    }
}
