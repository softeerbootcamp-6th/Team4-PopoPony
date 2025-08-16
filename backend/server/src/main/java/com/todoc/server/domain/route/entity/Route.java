package com.todoc.server.domain.route.entity;

import com.todoc.server.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Getter
@Setter
@NoArgsConstructor
@SQLRestriction("deleted_at is NULL")
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meeting_to_hospital_id")
    private RouteLeg meetingToHospital;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_to_return_id")
    private RouteLeg hospitalToReturn;

    @Builder
    public Route(LocationInfo meetingLocationInfo, LocationInfo hospitalLocationInfo, LocationInfo returnLocationInfo,
                 RouteLeg meetingToHospital, RouteLeg hospitalToReturn) {
        this.meetingLocationInfo = meetingLocationInfo;
        this.hospitalLocationInfo = hospitalLocationInfo;
        this.returnLocationInfo = returnLocationInfo;
        this.meetingToHospital = meetingToHospital;
        this.hospitalToReturn = hospitalToReturn;
    }
}