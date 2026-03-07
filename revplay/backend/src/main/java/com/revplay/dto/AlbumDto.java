package com.revplay.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class AlbumDto {
    private Long id;
    private String title;
    private String coverImageUrl;
    private String description;
    private Long artistId;
    private String artistName;
    private List<SongDto> songs;
    private LocalDateTime createdAt;
}
