package com.revplay.dto;

import lombok.Data;
import java.util.List;

@Data
public class AnalyticsDto {
    private Long totalSongs;
    private Long totalPlays;
    private Long totalFavorites;
    private List<SongDto> topSongs;
}
