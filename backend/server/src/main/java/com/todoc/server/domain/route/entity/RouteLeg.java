package com.todoc.server.domain.route.entity;

import com.todoc.server.common.entity.BaseEntity;
import com.todoc.server.common.enumeration.RouteLegType;
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

    @ManyToOne(fetch = FetchType.LAZY) // 하나의 Route에 2개의 RouteLeg이 존재
    @JoinColumn(name = "route_id")
    private Route route;

    @Enumerated(EnumType.STRING)
    @Column(name = "leg_type")
    private RouteLegType legType;

    // 요약 값(각 구간별)
    private Integer totalDistance; // m
    private Integer totalTime;     // sec
    private Integer totalFare;     // 원(톨비 등)
    private Integer taxiFare;      // 원(예상 택시요금)

    @Lob
    @Column(columnDefinition = "TEXT")
    private String usedFavoriteRouteVertices; // 압축 좌표 원본(선택)

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String coordinates;

    @Builder
    public RouteLeg(Long id, Route route, RouteLegType legType, Integer totalDistance, Integer totalTime,
        Integer totalFare, Integer taxiFare, String usedFavoriteRouteVertices, String coordinates) {
        this.id = id;
        this.route = route;
        this.legType = legType;
        this.totalDistance = totalDistance;
        this.totalTime = totalTime;
        this.totalFare = totalFare;
        this.taxiFare = taxiFare;
        this.usedFavoriteRouteVertices = usedFavoriteRouteVertices;
        this.coordinates = coordinates;
    }
}
