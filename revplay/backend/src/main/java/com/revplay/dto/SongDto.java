package com.revplay.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SongDto {
    private Long id;
    private String title;
    private String genre;
    private String duration;
    private String audioUrl;
    private String coverImageUrl;
    private Long playCount;
    private Long artistId;
    private String artistName;
    private Long albumId;
    private String albumTitle;
    private LocalDateTime createdAt;
    private boolean isFavorite;
}
