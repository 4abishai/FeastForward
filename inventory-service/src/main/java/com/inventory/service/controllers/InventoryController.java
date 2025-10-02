package com.inventory.service.controllers;

import com.inventory.service.models.DonationDTO;
import com.inventory.service.models.InventoryDTO;
import com.inventory.service.services.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping("/getInventoryDetail")
    public ResponseEntity<List<InventoryDTO>> getInventoryDetail(@RequestHeader("recipient-id") Long recipientId) {
        List<InventoryDTO> inventoryDetails = inventoryService.getInventoryDetailsByRecipientId(recipientId);
        return ResponseEntity.ok(inventoryDetails);
    }
}
