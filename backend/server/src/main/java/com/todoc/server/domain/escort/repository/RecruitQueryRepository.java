package com.todoc.server.domain.escort.repository;

import com.querydsl.core.Tuple;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.todoc.server.common.enumeration.ApplicationStatus;
import com.todoc.server.common.enumeration.RecruitStatus;
import com.todoc.server.domain.escort.repository.dto.RecruitHistoryDetailFlatDto;
import com.todoc.server.domain.escort.web.dto.response.RecruitHistorySimpleResponse;
import com.todoc.server.domain.route.entity.QLocationInfo;
import java.time.LocalDate;
import java.util.List;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.web.dto.response.RecruitSimpleResponse;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import static com.todoc.server.domain.route.entity.QRoute.route;
import static com.todoc.server.domain.escort.entity.QApplication.application;
import static com.todoc.server.domain.escort.entity.QRecruit.recruit;
import static com.todoc.server.domain.escort.entity.QEscort.escort;
import static com.todoc.server.domain.customer.entity.QPatient.patient;

@Repository
@RequiredArgsConstructor
public class RecruitQueryRepository {

    private final JPAQueryFactory queryFactory;

    QLocationInfo meetingLocation = new QLocationInfo("meetingLocation");
    QLocationInfo hospitalLocation = new QLocationInfo("hospitalLocation");
    QLocationInfo returnLocation = new QLocationInfo("returnLocation");

    public List<RecruitSimpleResponse> findListByUserId(Long userId) {
        List<RecruitSimpleResponse> result = queryFactory
            .select(Projections.constructor(RecruitSimpleResponse.class,
                recruit.id,
                escort.id,
                recruit.status,
                application.count(),
                recruit.escortDate,
                recruit.estimatedMeetingTime,
                recruit.estimatedReturnTime,
                meetingLocation.placeName,
                hospitalLocation.placeName,
                recruit.estimatedFee,
                patient.needsHelping,
                patient.usesWheelchair,
                patient.hasCognitiveIssue,
                patient.hasCommunicationIssue
            ))
            .from(recruit)
            .leftJoin(application).on(application.recruit.eq(recruit))
            .leftJoin(escort).on(escort.recruit.eq(recruit))
            .join(recruit.route, route)
            .join(route.meetingLocationInfo, meetingLocation)
            .join(route.hospitalLocationInfo, hospitalLocation)
            .join(recruit.patient, patient)
            .where(recruit.customer.id.eq(userId))
            .groupBy(recruit.id)
            .fetch();

        return result;
    }

    /**
     * 환자, 경로 정보를 포함한 동행 신청 정보 조회
     */
    public Recruit getRecruitWithPatientAndRouteByRecruitId(Long recruitId) {

        QLocationInfo meetingLocation = new QLocationInfo("meetingLocation");
        QLocationInfo hospitalLocation = new QLocationInfo("hospitalLocation");
        QLocationInfo returnLocation = new QLocationInfo("returnLocation");

        return queryFactory
                .select(recruit)
                .from(recruit)
                .join(recruit.patient, patient).fetchJoin()
                .join(recruit.route, route).fetchJoin()
                .join(route.meetingLocationInfo, meetingLocation).fetchJoin()
                .join(route.hospitalLocationInfo, hospitalLocation).fetchJoin()
                .join(route.returnLocationInfo, returnLocation).fetchJoin()
                .where(recruit.id.eq(recruitId))
                .fetchOne();
    }

    public List<RecruitHistorySimpleResponse> findRecruitListSortedByUserId(Long userId, int limit) {
        return queryFactory
                .select(Projections.constructor(RecruitHistorySimpleResponse.class,
                            recruit.id,
                            patient.name,
                            hospitalLocation.placeName,
                            recruit.escortDate
                ))
                .from(recruit)
                .join(recruit.patient, patient)
                .join(recruit.route, route)
                .join(route.hospitalLocationInfo, hospitalLocation)
                .where(recruit.customer.id.eq(userId))
                .orderBy(recruit.escortDate.desc())
                .limit(limit)
                .fetch();
    }

    public RecruitHistoryDetailFlatDto getRecruitHistoryDetailByRecruitId(Long recruitId) {

        return queryFactory
                .select(Projections.constructor(RecruitHistoryDetailFlatDto.class,
                        patient,
                        meetingLocation,
                        hospitalLocation,
                        returnLocation
                ))
                .from(recruit)
                .join(recruit.patient, patient)
                .join(recruit.route, route)
                .join(route.meetingLocationInfo, meetingLocation)
                .join(route.hospitalLocationInfo, hospitalLocation)
                .join(route.returnLocationInfo, returnLocation)
                .where(recruit.id.eq(recruitId))
                .fetchOne();
      }
  
    /**
     * 경로 정보를 포함한 동행 신청 정보 조회
     */
    public Recruit getRecruitWithRouteByRecruitId(Long recruitId) {

        QLocationInfo meetingLocation = new QLocationInfo("meetingLocation");
        QLocationInfo hospitalLocation = new QLocationInfo("hospitalLocation");
        QLocationInfo returnLocation = new QLocationInfo("returnLocation");

        return queryFactory
                .select(recruit)
                .from(recruit)
                .join(recruit.route, route).fetchJoin()
                .join(route.meetingLocationInfo, meetingLocation).fetchJoin()
                .join(route.hospitalLocationInfo, hospitalLocation).fetchJoin()
                .join(route.returnLocationInfo, returnLocation).fetchJoin()
                .where(recruit.id.eq(recruitId))
                .fetchOne();
    }

    /**
     * HelperUserId로 신청한 동행 목록 조회 (도우미 userId와 신청 상태를 기준으로 필터링)
     */
    public List<RecruitSimpleResponse> findListByHelperUserIdAndApplicationStatus(Long helperUserId, List<ApplicationStatus> status) {

        return queryFactory
            .select(Projections.constructor(RecruitSimpleResponse.class,
                recruit.id,
                escort.id,
                recruit.status,
                application.count(),
                recruit.escortDate,
                recruit.estimatedMeetingTime,
                recruit.estimatedReturnTime,
                meetingLocation.placeName,
                hospitalLocation.placeName,
                recruit.estimatedFee,
                patient.needsHelping,
                patient.usesWheelchair,
                patient.hasCognitiveIssue,
                patient.hasCommunicationIssue
            ))
            .from(recruit)
            .join(application).on(application.recruit.eq(recruit))
            .leftJoin(escort).on(escort.recruit.eq(recruit))
            .join(recruit.route, route)
            .join(route.meetingLocationInfo, meetingLocation)
            .join(route.hospitalLocationInfo, hospitalLocation)
            .join(recruit.patient, patient)
            .where(application.helper.id.eq(helperUserId)
                .and(application.status.in(status))
                .and(application.deletedAt.isNull()))
            .groupBy(recruit.id)
            .fetch();
    }

    /**
     * 시작일과 종료일 사이에 해당하는 동행 신청 목록 조회 (페치조인)
     */
    public List<Recruit> findListByDateRangeAndStatus(String area, LocalDate startDate, LocalDate endDate, List<RecruitStatus> status) {

        return queryFactory
            .selectFrom(recruit)
            .join(recruit.route, route).fetchJoin()
            .join(recruit.patient, patient).fetchJoin()
            .join(route.meetingLocationInfo, meetingLocation).fetchJoin()
            .join(route.hospitalLocationInfo, hospitalLocation).fetchJoin()
            .where(areaEq(area)
                .and(escortDateBetween(startDate, endDate))
                .and(recruit.status.in(status)))
            .fetch();
    }

    private BooleanExpression areaEq(String area) {
        return (area != null && !area.isBlank())
            ? meetingLocation.upperAddrName.eq(area)
            : null; // null이면 where에서 무시
    }

    private BooleanExpression escortDateBetween(LocalDate start, LocalDate end) {
        if (start != null && end != null) return recruit.escortDate.between(start, end);
        if (start != null) return recruit.escortDate.goe(start);
        if (end != null) return recruit.escortDate.loe(end);
        return null;
    }
}
