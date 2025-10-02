package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entities.RefreshToken;
import org.example.entities.Donor;
import org.example.repository.RefreshTokenRepository;
import org.example.repository.DonorRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;
    private final DonorRepository donorRepository;

    public RefreshToken createRefreshToken(Long id) {
        Donor donor = donorRepository.findById(id)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found: " + id));

        RefreshToken refreshToken = RefreshToken.builder()
                .refreshToken(UUID.randomUUID().toString())
                .expiryDate(ZonedDateTime.now().plusMonths(1).toInstant())
                .donor(donor)
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException(token.getRefreshToken() + "Refresh token was expired. Please make a new sign in request");
        }
        return token;
    }

    public Optional<RefreshToken> findByToken(String token) {
        System.out.println("Token received: " + token);
        Optional<RefreshToken> refreshToken = refreshTokenRepository.findByRefreshToken(token);
        System.out.println("Token found in DB: " + refreshToken.orElse(null));
        return refreshToken;
    }
}
