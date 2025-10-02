package com.recipient.service.controllers;

import com.recipient.service.models.DonationDTO;
import com.recipient.service.models.RecipientDTO;
import com.recipient.service.services.DonationService;
import com.recipient.service.services.RecipientService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/recipient/v1")
public class RecipientController {

    private final RecipientService recipientService;
    private final DonationService donationService;

    @PostMapping("/addRecipient")
    public ResponseEntity<Map<String, Object>> addRecipient(@RequestBody RecipientDTO recipientDTO) {
        if (recipientDTO == null) {
            Map<String, Object> error = Map.of("message", "Invalid input: recipient data is missing.");
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }

        try {
            Long recipientId = recipientService.saveRecipient(recipientDTO);
            Map<String, Object> response = Map.of("recipient-id", recipientId);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error while saving recipient: {}", e.getMessage(), e);
            Map<String, Object> error = Map.of("message", "Failed to save recipient data: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PostMapping("/findRecipients")
    public ResponseEntity<List<RecipientDTO>> findMatchingRecipients( @RequestBody DonationDTO donationDTO,
                                                                   @RequestHeader(defaultValue = "25") double radiusInKm)
    {
        List<RecipientDTO> listOfRecipients = donationService.findEligibleRecipients(donationDTO, radiusInKm);
        return ResponseEntity.ok(listOfRecipients);
    }

    @DeleteMapping("/deleteRecipient")
    public ResponseEntity<String> deleteRecipient(@RequestHeader String Recipient_Id) {
        try {
            recipientService.deleteRecipientById(Recipient_Id);
            return ResponseEntity.ok("Recipient deleted successfully");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

}
