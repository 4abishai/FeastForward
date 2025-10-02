package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entities.Donor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@RequiredArgsConstructor
public class CustomDonorDetails implements UserDetails {

    private final Donor donor;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Return user authorities/roles
        return List.of(new SimpleGrantedAuthority("ROLE_DONOR"));
    }

    @Override
    public String getPassword() {
        return donor.getPassword();
    }

    @Override
    public String getUsername() {
        // Return user ID as string instead of name
        return String.valueOf(donor.getDonorId());
    }

    // Add a method to get the actual name if needed
    public String getName() {
        return donor.getName();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}