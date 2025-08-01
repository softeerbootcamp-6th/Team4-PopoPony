package com.todoc.server.domain.route.entity;

import com.todoc.server.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Route extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meeting_location_info_id")
    private LocationInfo meetingLocationInfo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_location_info_id")
    private LocationInfo hospitalLocationInfo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "return_location_info_id")
    private LocationInfo returnLocationInfo;
}