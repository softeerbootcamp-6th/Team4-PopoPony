package com.todoc.server.domain.escort.repository.dto;

import com.todoc.server.domain.customer.entity.Patient;
import com.todoc.server.domain.route.entity.LocationInfo;
import lombok.Getter;

@Getter
public class RecruitHistoryDetailFlatDto {

    private Patient patient;

    private LocationInfo meetingLocation;

    private LocationInfo destination;

    private LocationInfo returnLocation;

    public RecruitHistoryDetailFlatDto(Patient patient, LocationInfo meetingLocation, LocationInfo destination, LocationInfo returnLocation) {
        this.patient = patient;
        this.meetingLocation = meetingLocation;
        this.destination = destination;
        this.returnLocation = returnLocation;
    }
}
