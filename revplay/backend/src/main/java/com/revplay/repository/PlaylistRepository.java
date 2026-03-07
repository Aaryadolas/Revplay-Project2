package com.revplay.repository;

import com.revplay.entity.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PlaylistRepository extends JpaRepository<Playlist, Long> {
    List<Playlist> findByOwnerId(Long ownerId);
    List<Playlist> findByOwnerIdAndPrivacy(Long ownerId, Playlist.Privacy privacy);
}
