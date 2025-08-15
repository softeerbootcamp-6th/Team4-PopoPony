package com.todoc.server.domain.escort.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.todoc.server.domain.escort.entity.Escort;
import com.todoc.server.domain.route.entity.QLocationInfo;
import com.todoc.server.domain.route.entity.QRouteLeg;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import static com.todoc.server.domain.auth.entity.QAuth.auth;
import static com.todoc.server.domain.customer.entity.QPatient.patient;
import static com.todoc.server.domain.escort.entity.QEscort.escort;
import static com.todoc.server.domain.escort.entity.QRecruit.recruit;
import static com.todoc.server.domain.route.entity.QRoute.route;

@Repository
@RequiredArgsConstructor
public class EscortQueryRepository {

    private final JPAQueryFactory queryFactory;

    QLocationInfo meetingLocation = new QLocationInfo("meetingLocation");
    QLocationInfo hospitalLocation = new QLocationInfo("hospitalLocation");
    QLocationInfo returnLocation = new QLocationInfo("returnLocation");
    QRouteLeg meetingToHospital = new QRouteLeg("meetingToHospital");
    QRouteLeg hospitalToReturn = new QRouteLeg("hospitalToReturn");

    public Escort findEscortDetailByRecruitId(Long recruitId) {

        return queryFactory
                .select(escort)
                .from(escort)
                .leftJoin(escort.recruit, recruit).fetchJoin()
                .leftJoin(recruit.customer, auth).fetchJoin()
                .leftJoin(recruit.patient, patient).fetchJoin()
                .leftJoin(recruit.route, route).fetchJoin()
                .leftJoin(route.meetingLocationInfo, meetingLocation).fetchJoin()
                .leftJoin(route.hospitalLocationInfo, hospitalLocation).fetchJoin()
                .leftJoin(route.returnLocationInfo, returnLocation).fetchJoin()
                .leftJoin(route.meetingToHospital, meetingToHospital).fetchJoin()
                .leftJoin(route.hospitalToReturn, hospitalToReturn).fetchJoin()
                .where(escort.recruit.id.eq(recruitId))
                .fetchOne();
    }
}
