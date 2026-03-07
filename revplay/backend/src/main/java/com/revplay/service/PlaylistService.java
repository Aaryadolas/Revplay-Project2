package com.revplay.service;

import com.revplay.dto.PlaylistDto;
import com.revplay.dto.SongDto;
import com.revplay.entity.Playlist;
import com.revplay.entity.Song;
import com.revplay.entity.User;
import com.revplay.repository.PlaylistRepository;
import com.revplay.repository.SongRepository;
import com.revplay.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlaylistService {

    private final PlaylistRepository playlistRepository;
    private final UserRepository userRepository;
    private final SongRepository songRepository;
    private final SongService songService;

    public PlaylistDto createPlaylist(String name, String description, String privacy, String userEmail) {
        User owner = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Playlist playlist = Playlist.builder()
                .name(name)
                .description(description)
                .privacy(Playlist.Privacy.valueOf(privacy != null ? privacy.toUpperCase() : "PUBLIC"))
                .owner(owner)
                .build();

        return mapToDto(playlistRepository.save(playlist), owner.getId());
    }

    public List<PlaylistDto> getUserPlaylists(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return playlistRepository.findByOwnerId(user.getId()).stream()
                .map(p -> mapToDto(p, user.getId()))
                .collect(Collectors.toList());
    }

    public PlaylistDto addSongToPlaylist(Long playlistId, Long songId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new RuntimeException("Song not found"));

        if (!playlist.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        playlist.getSongs().add(song);
        return mapToDto(playlistRepository.save(playlist), user.getId());
    }

    public PlaylistDto removeSongFromPlaylist(Long playlistId, Long songId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));

        playlist.getSongs().removeIf(s -> s.getId().equals(songId));
        return mapToDto(playlistRepository.save(playlist), user.getId());
    }

    public void deletePlaylist(Long playlistId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));
        if (!playlist.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        playlistRepository.delete(playlist);
    }

    private PlaylistDto mapToDto(Playlist playlist, Long userId) {
        PlaylistDto dto = new PlaylistDto();
        dto.setId(playlist.getId());
        dto.setName(playlist.getName());
        dto.setDescription(playlist.getDescription());
        dto.setCoverImageUrl(playlist.getCoverImageUrl());
        dto.setPrivacy(playlist.getPrivacy().name());
        dto.setCreatedAt(playlist.getCreatedAt());
        if (playlist.getOwner() != null) {
            dto.setOwnerId(playlist.getOwner().getId());
            dto.setOwnerName(playlist.getOwner().getUsername());
        }
        if (playlist.getSongs() != null) {
            dto.setSongs(playlist.getSongs().stream()
                    .map(s -> songService.mapToDto(s, userId))
                    .collect(Collectors.toList()));
        }
        return dto;
    }
}
