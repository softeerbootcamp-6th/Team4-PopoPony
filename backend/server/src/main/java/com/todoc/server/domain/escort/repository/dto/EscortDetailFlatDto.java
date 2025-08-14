package com.todoc.server.domain.escort.repository.dto;

import com.todoc.server.domain.auth.entity.Auth;
import com.todoc.server.domain.customer.entity.Patient;
import com.todoc.server.domain.escort.entity.Escort;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.route.entity.LocationInfo;
import com.todoc.server.domain.route.entity.Route;
import lombok.Getter;

@Getter
public class EscortDetailFlatDto {

    private Escort escort;

    private Recruit recruit;

    private Auth customer;

    private Patient patient;

    private Route route;

    private LocationInfo meetingLocation;

    private LocationInfo hospitalLocation;

    private LocationInfo returnLocation;

    public EscortDetailFlatDto(Escort escort, Recruit recruit, Auth customer, Patient patient, Route route,
                               LocationInfo meetingLocation, LocationInfo hospitalLocation, LocationInfo returnLocation) {
        this.escort = escort;
        this.recruit = recruit;
        this.customer = customer;
        this.patient = patient;
        this.route = route;
        this.meetingLocation = meetingLocation;
        this.hospitalLocation = hospitalLocation;
        this.returnLocation = returnLocation;
    }
}
