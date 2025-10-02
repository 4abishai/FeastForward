package com.recipient.service.repositories;

import com.recipient.service.entities.Recipient;
import com.recipient.service.models.DonationDTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RecipientRepositoryImpl implements RecipientRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @SuppressWarnings("unchecked")
    public List<Recipient> findMatchingRecipients(DonationDTO donationDTO, double radiusInKm) {
        String pointWkt = String.format("POINT(%f %f)",
                donationDTO.getDonor().getLocation().getLongitude(),
                donationDTO.getDonor().getLocation().getLatitude()
        );

        String type = donationDTO.getDonation().getType();
        String donorStorageCapability = donationDTO.getDonation().getStorageCapability();
        int donationQuantity = donationDTO.getDonation().getQuantity();

        String sql = """
SELECT * FROM recipients r
WHERE r.status = 'active'
  AND EXISTS (
    SELECT 1 FROM accepted_types t
    WHERE t.recipient_id = r.id
      AND t.type = :type
      AND t.min_quantity <= :donationQuantity
  )
  AND EXISTS (
    SELECT 1 FROM storage_capabilities s
    WHERE s.recipient_id = r.id
      AND s.storage_type = :storageCapability
  )
  AND ST_Distance(
        r.location::geography,
        ST_GeomFromText(:point, 4326)::geography
      ) <= :radius
""";

        return entityManager.createNativeQuery(sql, Recipient.class)
                .setParameter("type", type)
                .setParameter("storageCapability", donorStorageCapability)
                .setParameter("donationQuantity", donationQuantity)
                .setParameter("point", pointWkt)
                .setParameter("radius", radiusInKm * 1000) // km to meters
                .getResultList();
    }
}
