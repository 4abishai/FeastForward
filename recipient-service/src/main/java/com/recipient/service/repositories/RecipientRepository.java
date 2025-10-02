package com.recipient.service.repositories;

import com.recipient.service.entities.Recipient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecipientRepository extends JpaRepository<Recipient, String>, RecipientRepositoryCustom {
}
