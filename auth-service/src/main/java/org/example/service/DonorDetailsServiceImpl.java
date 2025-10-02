package org.example.service;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.example.entities.RefreshToken;
import org.example.entities.Donor;
import org.example.model.DonorInfoDTO;
import org.example.producers.DonorInfoProducer;
import org.example.repository.DonorRepository;
import org.example.model.JwtResponseDTO;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@Getter
@Setter
@RequiredArgsConstructor
public class DonorDetailsServiceImpl implements UserDetailsService {
    private final DonorRepository donorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final DonorInfoProducer donorInfoProducer;

    @Override
    public UserDetails loadUserByUsername(String donorName) throws UsernameNotFoundException {

        Donor donor = donorRepository.findByName(donorName);

        if (donor == null) {
            throw new UsernameNotFoundException("Donor not found with identifier: " + donorName);
        }
        return new CustomDonorDetails(donor);
    }

    public Donor checkIfDonorAlreadyExists(DonorInfoDTO donorInfoDTO) {
        return donorRepository.findByName(donorInfoDTO.getName());
    }

    public String getDonorNameById(Long donorId) {
        Donor donor = donorRepository.findById(donorId)
                .orElseThrow(() -> new UsernameNotFoundException("Donor not found with ID: " + donorId));
        return donor.getName();
    }


    public JwtResponseDTO signupDonor(DonorInfoDTO donorInfoDTO) {
        if (Objects.nonNull(checkIfDonorAlreadyExists(donorInfoDTO))) {
            return null;
        }

        donorInfoDTO.setPassword(passwordEncoder.encode(donorInfoDTO.getPassword()));

        Donor donor = Donor.builder()
                .name(donorInfoDTO.getName())
                .password(donorInfoDTO.getPassword())
                .build();

        Donor savedDonor = donorRepository.save(donor);
        donorInfoDTO.setId(donor.getDonorId());
        donorInfoProducer.sendDonorInfo(donorInfoDTO);

        // Generate JWT and refresh token using user ID
        String jwtToken = jwtService.generateToken(savedDonor.getDonorId());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(savedDonor.getDonorId());

        return JwtResponseDTO.builder()
                .donorId(savedDonor.getDonorId())
                .accessToken(jwtToken)
                .refreshToken(refreshToken.getRefreshToken())
                .build();
    }

    public JwtResponseDTO loginDonor(DonorInfoDTO donorInfoDTO) throws Exception {
        Donor donor = donorRepository.findByName(donorInfoDTO.getName());
        if (donor == null || !passwordEncoder.matches(donorInfoDTO.getPassword(), donor.getPassword())) {
            throw new Exception("Invalid name or password");
        }

        // Generate JWT using donor ID instead of name
        String jwtToken = jwtService.generateToken(donor.getDonorId());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(donor.getDonorId());

        return JwtResponseDTO.builder()
                .donorId(donor.getDonorId())
                .accessToken(jwtToken)
                .refreshToken(refreshToken.getRefreshToken())
                .build();
    }
}