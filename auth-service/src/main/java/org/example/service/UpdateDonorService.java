package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entities.Donor;
import org.example.model.NameUpdateDTO;
import org.example.producers.NameUpdateProducer;
import org.example.repository.DonorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UpdateDonorService {

    private final DonorRepository donorRepository;
    private final PasswordEncoder passwordEncoder;
    private final NameUpdateProducer nameUpdateProducer;


    public boolean updateName(Long donorId, String newName) {
        // Check if a user with the new name already exists
        Donor existingDonor = donorRepository.findByName(newName);
        if (existingDonor != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Name already taken: " + newName);
        }

        Donor donor = donorRepository.findById(donorId).orElse(null);
        if (donor == null) {
            return false;
        }

        donor.setName(newName);
        donorRepository.save(donor);

        // Send RabbitMQ message for name update
        NameUpdateDTO updateDTO = NameUpdateDTO.builder()
                .id(donor.getDonorId())
                .newName(newName)
                .build();
        nameUpdateProducer.sendNameUpdate(updateDTO);

        return true;
    }

        public boolean updatePassword(Long donorId, String oldPassword, String newPassword) {
            Optional<Donor> donorOptional = donorRepository.findById(donorId);
            if (donorOptional.isPresent()) {
                Donor donor = donorOptional.get();
                if (passwordEncoder.matches(oldPassword, donor.getPassword())) {
                    donor.setPassword(passwordEncoder.encode(newPassword));
                    donorRepository.save(donor);
                    return true;
                }
            }
            return false;
        }
}
