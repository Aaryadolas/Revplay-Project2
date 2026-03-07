package com.revplay.controller;

import com.revplay.dto.SongDto;
import com.revplay.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping("/{songId}/toggle")
    public ResponseEntity<Map<String, Boolean>> toggle(@PathVariable Long songId, Authentication auth) {
        boolean isFavorite = favoriteService.toggleFavorite(songId, auth.getName());
        return ResponseEntity.ok(Map.of("isFavorite", isFavorite));
    }

    @GetMapping
    public ResponseEntity<List<SongDto>> getFavorites(Authentication auth) {
        return ResponseEntity.ok(favoriteService.getFavorites(auth.getName()));
    }
}
