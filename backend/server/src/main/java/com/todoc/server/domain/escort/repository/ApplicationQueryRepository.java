package com.todoc.server.domain.escort.repository;

import com.querydsl.core.Tuple;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.todoc.server.domain.escort.entity.QApplication.application;
import static com.todoc.server.domain.auth.entity.QAuth.auth;
import static com.todoc.server.domain.helper.entity.QHelperProfile.helperProfile;
import static com.todoc.server.domain.helper.entity.QCertificate.certificate;
@Repository
@RequiredArgsConstructor
public class ApplicationQueryRepository {

    private final JPAQueryFactory queryFactory;

    public List<Tuple> findApplicationWithHelperByRecruitId(Long recruitId) {

        return queryFactory
                .select(
                        application.id,
                        helperProfile.id,
                        helperProfile.imageUrl,
                        auth.id,
                        auth.name,
                        auth.birthDate,
                        auth.gender,
                        auth.contact,
                        helperProfile.strength,
                        helperProfile.shortBio,
                        certificate.type
                )
                .from(application)
                .join(application.helper, auth)
                .join(helperProfile).on(helperProfile.auth.eq(auth))
                .leftJoin(certificate).on(certificate.helperProfile.eq(helperProfile))
                .where(application.recruit.id.eq(recruitId))
                .fetch();
    }
}
