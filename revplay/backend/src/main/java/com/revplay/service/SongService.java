package com.revplay.service;

import com.revplay.dto.SongDto;
import com.revplay.entity.Album;
import com.revplay.entity.Song;
import com.revplay.entity.User;
import com.revplay.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SongService {

    private final SongRepository songRepository;
    private final UserRepository userRepository;
    private final AlbumRepository albumRepository;
    private final FavoriteRepository favoriteRepository;

    private static final String UPLOAD_DIR = "uploads/";

    public SongDto uploadSong(String title, String genre, String duration,
                               MultipartFile audioFile, MultipartFile coverImage,
                               Long albumId, String artistEmail) throws IOException {
        User artist = userRepository.findByEmail(artistEmail)
                .orElseThrow(() -> new RuntimeException("Artist not found"));

        String audioUrl = saveFile(audioFile, "songs");
        String coverUrl = coverImage != null && !coverImage.isEmpty() ? saveFile(coverImage, "covers") : null;

        Album album = null;
        if (albumId != null) {
            album = albumRepository.findById(albumId).orElse(null);
        }

        Song song = Song.builder()
                .title(title)
                .genre(genre)
                .duration(duration)
                .audioUrl(audioUrl)
                .coverImageUrl(coverUrl)
                .artist(artist)
                .album(album)
                .playCount(0L)
                .build();

        return mapToDto(songRepository.save(song), artist.getId());
    }

    private String saveFile(MultipartFile file, String subDir) throws IOException {
        Path uploadPath = Paths.get(UPLOAD_DIR + subDir);
        Files.createDirectories(uploadPath);
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        return "http://localhost:8080/" + UPLOAD_DIR + subDir + "/" + filename;
    }

    public List<SongDto> getAllSongs(Long userId) {
        return songRepository.findAll().stream()
                .map(s -> mapToDto(s, userId))
                .collect(Collectors.toList());
    }

    public List<SongDto> getTrendingSongs(Long userId) {
        return songRepository.findTopByPlayCount().stream()
                .limit(10)
                .map(s -> mapToDto(s, userId))
                .collect(Collectors.toList());
    }

    public List<SongDto> getLatestSongs(Long userId) {
        return songRepository.findLatestSongs().stream()
                .limit(10)
                .map(s -> mapToDto(s, userId))
                .collect(Collectors.toList());
    }

    public List<SongDto> searchSongs(String query, Long userId) {
        return songRepository.findByTitleContainingIgnoreCase(query).stream()
                .map(s -> mapToDto(s, userId))
                .collect(Collectors.toList());
    }

    public List<SongDto> getArtistSongs(String artistEmail) {
        User artist = userRepository.findByEmail(artistEmail)
                .orElseThrow(() -> new RuntimeException("Artist not found"));
        return songRepository.findByArtist(artist).stream()
                .map(s -> mapToDto(s, artist.getId()))
                .collect(Collectors.toList());
    }

    public SongDto incrementPlay(Long songId, Long userId) {
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new RuntimeException("Song not found"));
        song.setPlayCount(song.getPlayCount() + 1);
        return mapToDto(songRepository.save(song), userId);
    }

    public SongDto mapToDto(Song song, Long userId) {
        SongDto dto = new SongDto();
        dto.setId(song.getId());
        dto.setTitle(song.getTitle());
        dto.setGenre(song.getGenre());
        dto.setDuration(song.getDuration());
        dto.setAudioUrl(song.getAudioUrl());
        dto.setCoverImageUrl(song.getCoverImageUrl());
        dto.setPlayCount(song.getPlayCount());
        dto.setCreatedAt(song.getCreatedAt());
        if (song.getArtist() != null) {
            dto.setArtistId(song.getArtist().getId());
            dto.setArtistName(song.getArtist().getDisplayName() != null
                    ? song.getArtist().getDisplayName() : song.getArtist().getUsername());
        }
        if (song.getAlbum() != null) {
            dto.setAlbumId(song.getAlbum().getId());
            dto.setAlbumTitle(song.getAlbum().getTitle());
        }
        if (userId != null) {
            dto.setFavorite(favoriteRepository.existsByUserIdAndSongId(userId, song.getId()));
        }
        return dto;
    }
}
