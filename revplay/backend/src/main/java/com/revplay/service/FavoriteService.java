package com.revplay.service;

import com.revplay.dto.SongDto;
import com.revplay.entity.Favorite;
import com.revplay.entity.Song;
import com.revplay.entity.User;
import com.revplay.repository.FavoriteRepository;
import com.revplay.repository.SongRepository;
import com.revplay.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final SongRepository songRepository;
    private final SongService songService;

    public boolean toggleFavorite(Long songId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new RuntimeException("Song not found"));

        if (favoriteRepository.existsByUserIdAndSongId(user.getId(), songId)) {
            Favorite fav = favoriteRepository.findByUserIdAndSongId(user.getId(), songId)
                    .orElseThrow();
            favoriteRepository.delete(fav);
            return false;
        } else {
            Favorite fav = Favorite.builder().user(user).song(song).build();
            favoriteRepository.save(fav);
            return true;
        }
    }

    public List<SongDto> getFavorites(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return favoriteRepository.findByUserId(user.getId()).stream()
                .map(f -> songService.mapToDto(f.getSong(), user.getId()))
                .collect(Collectors.toList());
    }
}
