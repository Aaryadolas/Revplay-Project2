package com.revplay.service;

import com.revplay.dto.AlbumDto;
import com.revplay.entity.Album;
import com.revplay.entity.User;
import com.revplay.repository.AlbumRepository;
import com.revplay.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlbumService {

    private final AlbumRepository albumRepository;
    private final UserRepository userRepository;
    private final SongService songService;

    public AlbumDto createAlbum(String title, String description, String artistEmail) {
        User artist = userRepository.findByEmail(artistEmail)
                .orElseThrow(() -> new RuntimeException("Artist not found"));

        Album album = Album.builder()
                .title(title)
                .description(description)
                .artist(artist)
                .build();

        return mapToDto(albumRepository.save(album), artist.getId());
    }

    public List<AlbumDto> getArtistAlbums(String artistEmail) {
        User artist = userRepository.findByEmail(artistEmail)
                .orElseThrow(() -> new RuntimeException("Artist not found"));
        return albumRepository.findByArtistId(artist.getId()).stream()
                .map(a -> mapToDto(a, artist.getId()))
                .collect(Collectors.toList());
    }

    public List<AlbumDto> getArtistAlbumsById(Long artistId) {
        return albumRepository.findByArtistId(artistId).stream()
                .map(a -> mapToDto(a, artistId))
                .collect(Collectors.toList());
    }

    private AlbumDto mapToDto(Album album, Long userId) {
        AlbumDto dto = new AlbumDto();
        dto.setId(album.getId());
        dto.setTitle(album.getTitle());
        dto.setCoverImageUrl(album.getCoverImageUrl());
        dto.setDescription(album.getDescription());
        dto.setCreatedAt(album.getCreatedAt());
        if (album.getArtist() != null) {
            dto.setArtistId(album.getArtist().getId());
            dto.setArtistName(album.getArtist().getDisplayName() != null
                    ? album.getArtist().getDisplayName() : album.getArtist().getUsername());
        }
        if (album.getSongs() != null) {
            dto.setSongs(album.getSongs().stream()
                    .map(s -> songService.mapToDto(s, userId))
                    .collect(Collectors.toList()));
        }
        return dto;
    }
}
