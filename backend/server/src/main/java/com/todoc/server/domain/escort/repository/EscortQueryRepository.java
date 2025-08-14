package com.todoc.server.domain.escort.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.todoc.server.domain.escort.repository.dto.EscortDetailFlatDto;
import com.todoc.server.domain.route.entity.QLocationInfo;
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

    public EscortDetailFlatDto findEscortDetailByRecruitId(Long recruitId) {

        return queryFactory
                .select(Projections.constructor(EscortDetailFlatDto.class,
                        escort,
                        recruit,
                        auth,
                        patient,
                        route,
                        meetingLocation,
                        hospitalLocation,
                        returnLocation
                ))
                .from(escort)
                .join(escort.recruit, recruit)
                .join(recruit.customer, auth)
                .join(recruit.patient, patient)
                .join(recruit.route, route)
                .join(route.meetingLocationInfo, meetingLocation)
                .join(route.hospitalLocationInfo, hospitalLocation)
                .join(route.returnLocationInfo, returnLocation)
                .where(escort.recruit.id.eq(recruitId))
                .fetchOne();
    }
}
