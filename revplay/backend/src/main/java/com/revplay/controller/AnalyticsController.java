package com.revplay.controller;

import com.revplay.dto.AnalyticsDto;
import com.revplay.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/artist")
    public ResponseEntity<AnalyticsDto> getArtistAnalytics(Authentication auth) {
        return ResponseEntity.ok(analyticsService.getArtistAnalytics(auth.getName()));
    }
}
