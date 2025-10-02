package com.inventory.service.repositories;

import com.inventory.service.entities.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    List<Inventory> findByRecipientId(Long recipientId);
}

