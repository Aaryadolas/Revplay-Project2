package com.revplay.controller;

import com.revplay.dto.SongDto;
import com.revplay.entity.User;
import com.revplay.repository.UserRepository;
import com.revplay.service.SongService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/songs")
@RequiredArgsConstructor
public class SongController {

    private final SongService songService;
    private final UserRepository userRepository;

    @GetMapping("/public/all")
    public ResponseEntity<List<SongDto>> getAllSongs(Authentication auth) {
        Long userId = getUserId(auth);
        return ResponseEntity.ok(songService.getAllSongs(userId));
    }

    @GetMapping("/public/trending")
    public ResponseEntity<List<SongDto>> getTrending(Authentication auth) {
        Long userId = getUserId(auth);
        return ResponseEntity.ok(songService.getTrendingSongs(userId));
    }

    @GetMapping("/public/latest")
    public ResponseEntity<List<SongDto>> getLatest(Authentication auth) {
        Long userId = getUserId(auth);
        return ResponseEntity.ok(songService.getLatestSongs(userId));
    }

    @GetMapping("/public/search")
    public ResponseEntity<List<SongDto>> search(@RequestParam String q, Authentication auth) {
        Long userId = getUserId(auth);
        return ResponseEntity.ok(songService.searchSongs(q, userId));
    }

    @PostMapping("/artist/upload")
    public ResponseEntity<SongDto> uploadSong(
            @RequestParam String title,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String duration,
            @RequestParam MultipartFile audioFile,
            @RequestParam(required = false) MultipartFile coverImage,
            @RequestParam(required = false) Long albumId,
            Authentication auth) throws IOException {
        return ResponseEntity.ok(songService.uploadSong(title, genre, duration, audioFile, coverImage, albumId, auth.getName()));
    }

    @GetMapping("/artist/my-songs")
    public ResponseEntity<List<SongDto>> getMySongs(Authentication auth) {
        return ResponseEntity.ok(songService.getArtistSongs(auth.getName()));
    }

    @PostMapping("/{id}/play")
    public ResponseEntity<SongDto> incrementPlay(@PathVariable Long id, Authentication auth) {
        Long userId = getUserId(auth);
        return ResponseEntity.ok(songService.incrementPlay(id, userId));
    }
    
    private Long getUserId(Authentication auth) {
        if (auth == null) return null;
        return userRepository.findByEmail(auth.getName()).map(User::getId).orElse(null);
    }
}
