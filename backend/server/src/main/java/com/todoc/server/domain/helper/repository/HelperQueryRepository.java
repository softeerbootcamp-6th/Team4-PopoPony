package com.todoc.server.domain.helper.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.todoc.server.domain.escort.repository.dto.ApplicationFlatDto;
import com.todoc.server.domain.helper.entity.HelperProfile;
import com.todoc.server.domain.helper.repository.dto.HelperSimpleFlatDto;
import com.todoc.server.domain.helper.repository.dto.HelperUpdateDefaultFlatDto;
import com.todoc.server.domain.helper.web.dto.response.HelperSimpleResponse;
import com.todoc.server.domain.image.entity.QImageFile;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import static com.todoc.server.domain.escort.entity.QApplication.application;
import static com.todoc.server.domain.escort.entity.QEscort.escort;
import static com.todoc.server.domain.helper.entity.QHelperProfile.helperProfile;
import static com.todoc.server.domain.helper.entity.QCertificate.certificate;
import static com.todoc.server.domain.auth.entity.QAuth.auth;
import static com.todoc.server.domain.image.entity.QImageFile.imageFile;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class HelperQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Transactional(readOnly = true)
    public List<HelperSimpleFlatDto> getHelperSimpleByHelperProfileId(Long helperProfileId) {

        return queryFactory
                .select(Projections.constructor(HelperSimpleFlatDto.class,
                        helperProfile.id,
                        helperProfile.helperProfileImage,
                        helperProfile.strength,
                        helperProfile.shortBio,
                        auth.id,
                        auth.name,
                        auth.birthDate,
                        auth.gender,
                        auth.contact,
                        certificate.type)
                )
                .from(helperProfile)
                .join(helperProfile.auth, auth)
                .leftJoin(certificate).on(certificate.helperProfile.eq(helperProfile))
                .where(helperProfile.id.eq(helperProfileId))
                .fetch();
    }

    @Transactional(readOnly = true)
    public List<HelperUpdateDefaultFlatDto> getHelperUpdateDefaultByHelperProfileId(Long helperProfileId) {

        QImageFile profileImage = new QImageFile("profileImage");
        QImageFile certificateImage = new QImageFile("certificateImage");

        return queryFactory
                .select(Projections.constructor(HelperUpdateDefaultFlatDto.class,
                        helperProfile,
                        certificate
                ))
                .from(helperProfile)
                .leftJoin(helperProfile.helperProfileImage, profileImage).fetchJoin()
                .leftJoin(certificate).on(certificate.helperProfile.eq(helperProfile)).fetchJoin()
                .leftJoin(certificate.certificateImage, certificateImage).fetchJoin()
                .where(helperProfile.id.eq(helperProfileId))
                .fetch();
    }

    @Transactional(readOnly = true)
    public List<HelperProfile> findHelperProfileListByRecruitId(Long recruitId) {

        return queryFactory
                .select(helperProfile)
                .from(application)
                .join(application.helper, auth)
                .join(helperProfile).on(helperProfile.auth.eq(auth))
                .where(application.recruit.id.eq(recruitId))
                .fetch();
    }

    @Transactional(readOnly = true)
    public HelperProfile findHelperProfileByEscortId(Long escortId) {

        return queryFactory
            .select(helperProfile)
            .from(escort)
            .join(escort.helper, auth)
            .join(helperProfile).on(helperProfile.auth.eq(auth))
            .join(helperProfile.helperProfileImage, imageFile).fetchJoin()
            .where(escort.id.eq(escortId))
            .fetchOne();
    }
}
