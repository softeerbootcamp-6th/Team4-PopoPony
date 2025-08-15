package com.todoc.server.domain.escort.repository;

import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.todoc.server.common.enumeration.EscortStatus;
import com.todoc.server.common.enumeration.RecruitStatus;
import com.todoc.server.domain.escort.entity.QEscort;
import com.todoc.server.domain.escort.entity.QRecruit;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.*;

import static com.todoc.server.domain.escort.entity.QEscort.escort;
import static com.todoc.server.domain.escort.entity.QRecruit.recruit;

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
    public long updateStatusForEscortBeforeMeeting(LocalDate todayUtc,
                                                   LocalTime from, LocalTime to) {
        var nowUtc = OffsetDateTime.now(ZoneOffset.UTC).toLocalDateTime();

        QEscort e = escort;
        QRecruit r = new QRecruit("rForUpdate");

        return queryFactory.update(e)
                .set(e.status, EscortStatus.MEETING)
                .set(e.updatedAt, nowUtc)
                .where(
                        e.deletedAt.isNull(),
                        e.status.eq(EscortStatus.PREPARING),
                        // recruit 조건은 id 서브쿼리로 필터
                        e.recruit.id.in(
                                JPAExpressions
                                        .select(r.id)
                                        .from(r)
                                        .where(
                                                r.deletedAt.isNull(),
                                                r.status.eq(RecruitStatus.COMPLETED),
                                                r.escortDate.eq(todayUtc),
                                                r.estimatedMeetingTime.between(from, to)
                                        )
                        )
                )
                .execute();
    }

}
