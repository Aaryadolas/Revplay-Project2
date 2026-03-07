package com.revplay.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PlaylistDto {
    private Long id;
    private String name;
    private String description;
    private String coverImageUrl;
    private String privacy;
    private Long ownerId;
    private String ownerName;
    private List<SongDto> songs;
    private LocalDateTime createdAt;
}
