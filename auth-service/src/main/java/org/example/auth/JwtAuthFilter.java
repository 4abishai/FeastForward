package org.example.auth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.entities.Donor;
import org.example.repository.DonorRepository;
import org.example.service.CustomDonorDetails;
import org.example.service.JwtService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final DonorRepository donorRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        String token = null;
        String donorIdTokenStr = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            try {
                donorIdTokenStr = jwtService.extractDonorId(token);
                log.debug("Extracted donor ID from token: {}", donorIdTokenStr);
            } catch (Exception e) {
                log.error("Error extracting donor ID from token: {}", e.getMessage());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        }

        String donorIdHeaderStr = request.getHeader("donor_id");

        if (donorIdTokenStr != null && donorIdHeaderStr != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                Long donorIdHeader = Long.parseLong(donorIdHeaderStr);
                Long donorIdToken = Long.parseLong(donorIdTokenStr);

                log.debug("Comparing token user ID in token: {} with user ID in header: {}", donorIdToken, donorIdHeader);

                if (donorIdToken.equals(donorIdHeader)) {
                    Optional<Donor> userOpt = donorRepository.findById(donorIdHeader);

                    if (userOpt.isPresent()) {
                        Donor donor = userOpt.get();
                        log.debug("Found donor: {} with ID: {}", donor.getName(), donor.getDonorId());

                        CustomDonorDetails donorDetails = new CustomDonorDetails(donor);

                        log.debug("Name: {}", donorDetails.getUsername());

                        if (jwtService.validateToken(token, donorDetails)) {
                            UsernamePasswordAuthenticationToken authenticationToken =
                                    new UsernamePasswordAuthenticationToken(donorDetails, null, donorDetails.getAuthorities());
                            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                            log.debug("User authenticated successfully: {}", donor.getName());
                        } else {
                            log.error("Token validation failed for user ID: {}", donorIdToken);
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            return;
                        }
                    } else {
                        // Donor not found
                        log.error("Donor not found with ID: {}", donorIdToken);
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        return;
                    }
                } else {
                    // User IDs do not match
                    log.error("Token's ID {} does not match header's ID {}", donorIdToken, donorIdHeader);
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    return;
                }
            } catch (NumberFormatException e) {
                log.error("Invalid number format - header's user-id: {}, token's user-id: {}", donorIdTokenStr, donorIdHeaderStr);
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                return;
            } catch (Exception e) {
                log.error("Unexpected error in JWT filter: {}", e.getMessage(), e);
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
