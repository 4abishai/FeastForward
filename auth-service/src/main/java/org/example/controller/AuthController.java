package org.example.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.entities.RefreshToken;
import org.example.model.DonorInfoDTO;
import org.example.model.JwtResponseDTO;
import org.example.service.DonorDetailsServiceImpl;
import org.example.service.JwtService;
import org.example.service.RefreshTokenService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;
import java.util.Objects;

@RequestMapping("/auth/v1")
@RequiredArgsConstructor
@RestController
@Slf4j
public class AuthController
{
    private final DonorDetailsServiceImpl donorDetailsService;
    private final AuthenticationManager authenticationManager;
    private  final RefreshTokenService refreshTokenService;
    private final JwtService jwtService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody DonorInfoDTO donorInfoDTO, HttpServletResponse response){
        try {
            JwtResponseDTO jwtResponse = donorDetailsService.signupDonor(donorInfoDTO);
            if (jwtResponse == null) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("error", "User already exists"));
            }

            // Set HTTP-only secure cookie for refresh token
            ResponseCookie refreshTokenCookie = ResponseCookie.from("refresh-token", jwtResponse.getRefreshToken())
                    .httpOnly(true)
                    .secure(true) // Use false if testing on HTTP/localhost
                    .path("/")
                    .sameSite("Strict") // Adjust based on frontend-backend cross-origin setup
                    .maxAge(Duration.ofDays(31))
                    .build();

            response.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());

            // Send accessToken and userId in response body
            Map<String, Object> responseBody = Map.of(
                    "access_token", jwtResponse.getAccessToken(),
                    "donor_id", jwtResponse.getDonorId()
            );

            return ResponseEntity.ok(responseBody);


        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", ex.getMessage()));
        }
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody DonorInfoDTO donorInfoDTO, HttpServletResponse response) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(donorInfoDTO.getName(), donorInfoDTO.getPassword()));

            JwtResponseDTO jwtResponse = donorDetailsService.loginDonor(donorInfoDTO);

            // Set refresh token as HTTP-only cookie
            ResponseCookie refreshTokenCookie = ResponseCookie.from("refresh-token", jwtResponse.getRefreshToken())
                    .httpOnly(true)
                    .secure(true) // Set false on localhost HTTP
                    .path("/")
                    .sameSite("Strict")
                    .maxAge(Duration.ofDays(7))
                    .build();
            response.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());

            // Return accessToken and userId in body
            Map<String, Object> responseBody = Map.of(
                    "access_token", jwtResponse.getAccessToken(),
                    "donor_id", jwtResponse.getDonorId()
            );

            return ResponseEntity.ok(responseBody);

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid name or password"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An unexpected error occurred: " + e.getMessage()));
        }
    }


    @PostMapping("/refreshToken")
    public ResponseEntity<?> refreshToken(HttpServletRequest request) {
        try {
            // Extract refresh token from cookie
            String refreshToken = null;
            if (request.getCookies() != null) {
                for (Cookie cookie : request.getCookies()) {
                    if ("refresh-token".equals(cookie.getName())) {
                        refreshToken = cookie.getValue();
                        break;
                    }
                }
            }

            if (refreshToken == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Missing refresh token"));
            }

            return refreshTokenService.findByToken(refreshToken)
                    .map(refreshTokenService::verifyExpiration)
                    .map(RefreshToken::getDonor)
                    .map(donorInfo -> {
                        String accessToken = jwtService.generateToken(donorInfo.getDonorId());
                        Map<String, Object> responseBody = Map.of(
                                "access_token", accessToken,
                                "donor_id", donorInfo.getDonorId()
                        );
                        return ResponseEntity.ok(responseBody);
                    })
                    .orElseThrow(() -> new Exception("Invalid or expired refresh token. Please log in again."));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An unexpected error occurred: " + e.getMessage()));
        }
    }


    @GetMapping("/ping")
    public ResponseEntity<?> ping() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            log.info("Authentication: {}", authentication);
            if (authentication == null) {
                System.out.println("Authentication is null");
            } else if (!authentication.isAuthenticated()) {
                System.out.println("Donor is not authenticated");
            } else {
                String userName = donorDetailsService.getDonorNameById(Long.parseLong(authentication.getName())); // getName() returns user ID in this case
                if (Objects.nonNull(userName)) {
                    log.info("Authenticated username: {}", userName);
                    return ResponseEntity.ok(userName);
                }
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
        catch (Exception e) {
            System.out.println("Not authenticated: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
    }



}