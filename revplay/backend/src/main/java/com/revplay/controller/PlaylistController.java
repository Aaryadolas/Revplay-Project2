package com.revplay.controller;

import com.revplay.dto.PlaylistDto;
import com.revplay.service.PlaylistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/playlists")
@RequiredArgsConstructor
public class PlaylistController {

    private final PlaylistService playlistService;

    @PostMapping
    public ResponseEntity<PlaylistDto> create(@RequestBody Map<String, String> body, Authentication auth) {
        return ResponseEntity.ok(playlistService.createPlaylist(
                body.get("name"), body.get("description"), body.get("privacy"), auth.getName()));
    }

    @GetMapping("/my")
    public ResponseEntity<List<PlaylistDto>> getMyPlaylists(Authentication auth) {
        return ResponseEntity.ok(playlistService.getUserPlaylists(auth.getName()));
    }

    @PostMapping("/{playlistId}/songs/{songId}")
    public ResponseEntity<PlaylistDto> addSong(@PathVariable Long playlistId,
                                                @PathVariable Long songId,
                                                Authentication auth) {
        return ResponseEntity.ok(playlistService.addSongToPlaylist(playlistId, songId, auth.getName()));
    }

    @DeleteMapping("/{playlistId}/songs/{songId}")
    public ResponseEntity<PlaylistDto> removeSong(@PathVariable Long playlistId,
                                                   @PathVariable Long songId,
                                                   Authentication auth) {
        return ResponseEntity.ok(playlistService.removeSongFromPlaylist(playlistId, songId, auth.getName()));
    }

    @DeleteMapping("/{playlistId}")
    public ResponseEntity<Void> delete(@PathVariable Long playlistId, Authentication auth) {
        playlistService.deletePlaylist(playlistId, auth.getName());
        return ResponseEntity.noContent().build();
    }
}
