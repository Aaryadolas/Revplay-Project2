package com.revplay.repository;

import com.revplay.entity.Song;
import com.revplay.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface SongRepository extends JpaRepository<Song, Long> {
    List<Song> findByArtist(User artist);
    List<Song> findByArtistId(Long artistId);
    List<Song> findByGenreIgnoreCase(String genre);
    List<Song> findByTitleContainingIgnoreCase(String title);
    
    @Query("SELECT s FROM Song s ORDER BY s.playCount DESC")
    List<Song> findTopByPlayCount();
    
    @Query("SELECT s FROM Song s ORDER BY s.createdAt DESC")
    List<Song> findLatestSongs();
    
    Long countByArtistId(Long artistId);
    
    @Query("SELECT SUM(s.playCount) FROM Song s WHERE s.artist.id = :artistId")
    Long sumPlayCountByArtistId(Long artistId);
}
