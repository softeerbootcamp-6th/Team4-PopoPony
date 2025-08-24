package com.todoc.server.domain.escort.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.todoc.server.common.enumeration.ApplicationStatus;
import com.todoc.server.domain.escort.entity.Application;
import com.todoc.server.domain.escort.entity.QApplication;
import com.todoc.server.domain.escort.repository.dto.ApplicationFlatDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import static com.todoc.server.domain.escort.entity.QApplication.application;
import static com.todoc.server.domain.auth.entity.QAuth.auth;
import static com.todoc.server.domain.escort.entity.QRecruit.recruit;
import static com.todoc.server.domain.helper.entity.QHelperProfile.helperProfile;
import static com.todoc.server.domain.helper.entity.QCertificate.certificate;
@Repository
@RequiredArgsConstructor
public class ApplicationQueryRepository {

    private final JPAQueryFactory queryFactory;

    /**
     * 특정 동행 신청에 대한 지원들의 목록을 도우미 정보와 함께 조회합니다.
     *
     * @param recruitId 동행 신청 ID
     * @return 지원, 도우미 정보가 담긴 튜플들의 리스트
     */
    public List<ApplicationFlatDto> findApplicationWithHelperByRecruitId(Long recruitId) {

        return queryFactory
                .select(Projections.constructor(ApplicationFlatDto.class,
                    application.id,
                    helperProfile.id,
                    helperProfile.helperProfileImage,
                    auth.id,
                    auth.name,
                    auth.birthDate,
                    auth.gender,
                    auth.contact,
                    helperProfile.strength,
                    helperProfile.shortBio,
                    certificate.type)
                )
                .from(application)
                .join(application.helper, auth)
                .join(helperProfile).on(helperProfile.auth.eq(auth))
                .leftJoin(certificate).on(certificate.helperProfile.eq(helperProfile))
                .where(application.recruit.id.eq(recruitId))
                .fetch();
    }

    /**
     * 지정된 지원과 같은 신청에 속하는 지원들의 목록을 조회합니다.
     *
     * @param applicationId 지원 ID
     * @return applicationId의 지원과 같은 신청에 속하는 지원들의 리스트
     */
    public List<Application> findAllApplicationsOfRecruitByApplicationId(Long applicationId) {
        QApplication a1 = new QApplication("a1");
        QApplication a2 = new QApplication("a2");

        return queryFactory
                .selectFrom(a2)
                .join(a2.recruit, recruit).fetchJoin() // Recruit도 함께 fetch
                .where(a2.recruit.eq(
                        JPAExpressions
                                .select(a1.recruit)
                                .from(a1)
                                .where(a1.id.eq(applicationId))
                ))
                .fetch();
    }

    /**
     * 동행 신청과 매칭된 지원을 조회합니다.
     *
     * @param recruitId 동행 신청 ID
     * @return recruitId의 동행 신청과 매칭된 지원(Optional)
     */
    public Optional<Application> findMatchedApplicationByRecruitId(Long recruitId) {
        // recruitId로 단일 조회, Recruit fetch join
        Application result = queryFactory
                .selectFrom(application)
                .join(application.recruit, recruit).fetchJoin()
                .where(recruit.id.eq(recruitId),
                        application.status.eq(ApplicationStatus.MATCHED))
                .fetchOne();

        return Optional.ofNullable(result);
    }
}
