package com.todoc.server.domain.escort.repository;

import com.querydsl.core.types.Projections;
import com.todoc.server.domain.customer.entity.Patient;
import com.todoc.server.domain.customer.exception.PatientNotFoundException;
import com.todoc.server.domain.customer.web.dto.response.PatientSimpleResponse;
import com.todoc.server.domain.escort.exception.RecruitNotFoundException;
import com.todoc.server.domain.escort.web.dto.response.RecruitDetailResponse;
import com.todoc.server.domain.route.entity.QLocationInfo;
import java.util.List;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.web.dto.response.RecruitSimpleResponse;

import com.todoc.server.domain.route.entity.Route;
import com.todoc.server.domain.route.exception.RouteNotFoundException;
import com.todoc.server.domain.route.web.dto.response.RouteSimpleResponse;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.stereotype.Repository;

import static com.todoc.server.domain.route.entity.QRoute.route;
import static com.todoc.server.domain.escort.entity.QApplication.application;
import static com.todoc.server.domain.escort.entity.QRecruit.recruit;
import static com.todoc.server.domain.escort.entity.QEscort.escort;
import static com.todoc.server.domain.customer.entity.QPatient.patient;

@Repository
public class RecruitQueryRepository extends QuerydslRepositorySupport {

    public RecruitQueryRepository() {
        super(Recruit.class);
    }

    QLocationInfo meetingLocation = new QLocationInfo("meetingLocation");
    QLocationInfo hospitalLocation = new QLocationInfo("hospitalLocation");

    public List<RecruitSimpleResponse> findListByUserId(Long userId) {
        List<RecruitSimpleResponse> result = getQuerydsl().createQuery()
            .select(Projections.constructor(RecruitSimpleResponse.class,
                recruit.id,
                escort.id,
                recruit.status,
                application.count(),
                recruit.escortDate,
                recruit.estimatedMeetingTime,
                recruit.estimatedReturnTime,
                meetingLocation.placeName,
                hospitalLocation.placeName
            ))
            .from(recruit)
            .leftJoin(application).on(application.recruit.eq(recruit))
            .leftJoin(escort).on(escort.recruit.eq(recruit))
            .join(recruit.route, route)
            .join(route.meetingLocationInfo, meetingLocation)
            .join(route.hospitalLocationInfo, hospitalLocation)
            .where(recruit.customer.id.eq(userId))
            .groupBy(recruit.id)
            .fetch();

        return result;
    }

    public RecruitDetailResponse getRecruitDetailByRecruitId(Long recruitId) {

        QLocationInfo meetingLocation = new QLocationInfo("meetingLocation");
        QLocationInfo hospitalLocation = new QLocationInfo("hospitalLocation");
        QLocationInfo returnLocation = new QLocationInfo("returnLocation");

        // 1. 동행 신청 조회
        Recruit result = getQuerydsl().createQuery()
                .select(recruit)
                .from(recruit)
                .join(recruit.patient, patient).fetchJoin()
                .join(recruit.route, route).fetchJoin()
                .join(route.meetingLocationInfo, meetingLocation).fetchJoin()
                .join(route.hospitalLocationInfo, hospitalLocation).fetchJoin()
                .join(route.returnLocationInfo, returnLocation).fetchJoin()
                .where(recruit.id.eq(recruitId))
                .fetchOne();

        if (result == null) {
            throw new RecruitNotFoundException();
        }

        // 2. Patient → PatientSimpleResponse
        Patient patient = result.getPatient();
        if (patient == null) {
            throw new PatientNotFoundException();
        }
        PatientSimpleResponse patientResponse = PatientSimpleResponse.from(patient);

        // 3. Route → RouteSimpleResponse
        Route route = result.getRoute();
        if (route == null) {
            throw new RouteNotFoundException();
        }
        RouteSimpleResponse routeResponse = RouteSimpleResponse.from(route);

        // 4. Recruit → RecruitDetailResponse
        return RecruitDetailResponse.builder()
                .recruitId(result.getId())
                .status(result.getStatus())
                .escortDate(result.getEscortDate())
                .estimatedMeetingTime(result.getEstimatedMeetingTime())
                .estimatedReturnTime(result.getEstimatedReturnTime())
                .route(routeResponse)
                .patient(patientResponse)
                .purpose(result.getPurpose())
                .extraRequest(result.getExtraRequest())
                .build();
    }
}
