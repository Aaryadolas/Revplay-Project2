package com.revplay.controller;

import com.revplay.dto.AlbumDto;
import com.revplay.service.AlbumService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/albums")
@RequiredArgsConstructor
public class AlbumController {

    private final AlbumService albumService;

    @PostMapping("/artist")
    public ResponseEntity<AlbumDto> create(@RequestBody Map<String, String> body, Authentication auth) {
        return ResponseEntity.ok(albumService.createAlbum(body.get("title"), body.get("description"), auth.getName()));
    }

    @GetMapping("/artist/my")
    public ResponseEntity<List<AlbumDto>> getMyAlbums(Authentication auth) {
        return ResponseEntity.ok(albumService.getArtistAlbums(auth.getName()));
    }
}
