package com.revplay.service;

import com.revplay.dto.AnalyticsDto;
import com.revplay.entity.User;
import com.revplay.repository.FavoriteRepository;
import com.revplay.repository.SongRepository;
import com.revplay.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final SongRepository songRepository;
    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final SongService songService;

    public AnalyticsDto getArtistAnalytics(String artistEmail) {
        User artist = userRepository.findByEmail(artistEmail)
                .orElseThrow(() -> new RuntimeException("Artist not found"));

        AnalyticsDto dto = new AnalyticsDto();
        dto.setTotalSongs(songRepository.countByArtistId(artist.getId()));

        Long totalPlays = songRepository.sumPlayCountByArtistId(artist.getId());
        dto.setTotalPlays(totalPlays != null ? totalPlays : 0L);

        dto.setTotalFavorites(favoriteRepository.countBySongArtistId(artist.getId()));

        dto.setTopSongs(songRepository.findByArtistId(artist.getId()).stream()
                .sorted((a, b) -> Long.compare(b.getPlayCount(), a.getPlayCount()))
                .limit(5)
                .map(s -> songService.mapToDto(s, artist.getId()))
                .collect(Collectors.toList()));

        return dto;
    }
}
