package com.todoc.server.domain.escort.repository;

import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.todoc.server.common.enumeration.EscortStatus;
import com.todoc.server.common.enumeration.RecruitStatus;
import com.todoc.server.domain.escort.entity.Escort;
import com.todoc.server.domain.escort.entity.QEscort;
import com.todoc.server.domain.escort.entity.QRecruit;
import com.todoc.server.domain.route.entity.QLocationInfo;
import com.todoc.server.domain.route.entity.QRouteLeg;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.*;

import static com.todoc.server.domain.auth.entity.QAuth.auth;
import static com.todoc.server.domain.customer.entity.QPatient.patient;
import static com.todoc.server.domain.escort.entity.QEscort.escort;
import static com.todoc.server.domain.escort.entity.QRecruit.recruit;
import static com.todoc.server.domain.route.entity.QRoute.route;


@Repository
@RequiredArgsConstructor
public class EscortQueryRepository {

    private final JPAQueryFactory queryFactory;

    /**
     * 0시 ~ 21시 이전
     * 다음 기준을 충족하는 Escort 대해 Status를 PREPARING("동행준비") -> MEETING("만남중")으로 업데이트
     * 1. Escort.Recruit의 status가 COMPLETED("매칭완료")
     * 2. Escort의 status가 PREPARING("동행준비")
     * 3. Recruit의 escortDate가 현재 날짜와 같고,
     * 4. Recruit의 estimatedMeetingTime이 현재 시간으로부터 3시간 이내 (180분)인 경우
     */
    public long updateStatusForEscortBeforeMeeting(LocalDate today,
                                                   LocalTime from, LocalTime to, ZonedDateTime now) {
        QEscort e = escort;
        QRecruit r = new QRecruit("rForUpdate");

        return queryFactory.update(e)
                .set(e.status, EscortStatus.MEETING)
                .set(e.updatedAt, now.toLocalDateTime())
                .where(
                        e.deletedAt.isNull(),
                        e.status.eq(EscortStatus.PREPARING),
                        // recruit 조건은 id 서브쿼리로 필터
                        e.recruit.id.in(
                                JPAExpressions
                                        .select(r.id)
                                        .from(r)
                                        .where(
                                                r.status.eq(RecruitStatus.COMPLETED),
                                                r.escortDate.eq(today),
                                                r.estimatedMeetingTime.between(from, to)
                                        )
                        )
                )
                .execute();
    }

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
