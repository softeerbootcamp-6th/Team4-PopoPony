package com.todoc.server.domain.escort.repository;

import com.querydsl.core.types.Projections;
import com.todoc.server.domain.route.entity.QLocationInfo;
import java.util.List;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.web.dto.response.RecruitSimpleResponse;

import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.stereotype.Repository;

import static com.todoc.server.domain.route.entity.QRoute.route;
import static com.todoc.server.domain.escort.entity.QApplication.application;
import static com.todoc.server.domain.escort.entity.QRecruit.recruit;
import static com.todoc.server.domain.escort.entity.QEscort.escort;

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
}
