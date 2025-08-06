package com.todoc.server.domain.helper.repository;

import com.querydsl.core.Tuple;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import static com.todoc.server.domain.helper.entity.QHelperProfile.helperProfile;
import static com.todoc.server.domain.helper.entity.QCertificate.certificate;
import static com.todoc.server.domain.auth.entity.QAuth.auth;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class HelperQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Transactional(readOnly = true)
    public List<Tuple> getHelperSimpleByHelperProfileId(Long helperProfileId) {

        return queryFactory
                .select(
                        helperProfile.id,
                        helperProfile.imageUrl,
                        helperProfile.strength,
                        helperProfile.shortBio,
                        auth.id,
                        auth.name,
                        auth.birthDate,
                        auth.gender,
                        auth.contact,
                        certificate.type
                )
                .from(helperProfile)
                .join(helperProfile.auth, auth)
                .leftJoin(certificate).on(certificate.helperProfile.eq(helperProfile))
                .where(helperProfile.id.eq(helperProfileId))
                .fetch();
    }
}
