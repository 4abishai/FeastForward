package org.example.controller;

import lombok.extern.slf4j.Slf4j;
import org.example.model.DonorInfoDTO;
import org.example.model.NameUpdateDTO;
import org.example.service.UpdateDonorService;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/auth/v1")
public class UpdateController {

    @Autowired
    private UpdateDonorService updateDonorService;

    @PutMapping("/updateName")
    public ResponseEntity<?> updateName(@RequestHeader("donor_id") Long donorId, @RequestBody String newName) {
        try {
            log.info("new name received");
            boolean result = updateDonorService.updateName(donorId, newName);

            if (result) {
                Map<String, Object> response = new HashMap<>();
                response.put("name", newName);
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "User not found");
                return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            log.error("Error while updating name: ", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }


    @PutMapping("/updatePassword")
    public ResponseEntity<?> updatePassword(@RequestHeader("donor_id") Long donorId, @RequestBody DonorInfoDTO.UpdatePasswordDTO request) {
        boolean result = updateDonorService.updatePassword(
                donorId,
                request.getOldPassword(),
                request.getNewPassword()
        );

        if (result) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Password updated successfully");
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Donor not found or old password is incorrect");
            return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
        }
    }
}
