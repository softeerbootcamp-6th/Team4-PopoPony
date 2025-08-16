package com.todoc.server.domain.route.entity;

import com.todoc.server.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class RouteLeg extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 요약 값(각 구간별)
    private Integer totalDistance; // m
    private Integer totalTime;     // sec
    private Integer totalFare;     // 원(톨비 등)
    private Integer taxiFare;      // 원(예상 택시요금)

    @Lob
    @Column(columnDefinition = "TEXT")
    private String usedFavoriteRouteVertices; // 압축 좌표 원본(선택)

    @Builder
    public RouteLeg(Long id, Integer totalDistance, Integer totalTime,
                    Integer totalFare, Integer taxiFare, String usedFavoriteRouteVertices) {
        this.id = id;
        this.totalDistance = totalDistance;
        this.totalTime = totalTime;
        this.totalFare = totalFare;
        this.taxiFare = taxiFare;
        this.usedFavoriteRouteVertices = usedFavoriteRouteVertices;
    }
}
