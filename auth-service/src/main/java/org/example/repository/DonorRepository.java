package org.example.repository;

import org.example.entities.Donor;
import org.springframework.data.repository.CrudRepository;

public interface DonorRepository extends CrudRepository<Donor, Long> {

    public Donor findByName(String name);
}
