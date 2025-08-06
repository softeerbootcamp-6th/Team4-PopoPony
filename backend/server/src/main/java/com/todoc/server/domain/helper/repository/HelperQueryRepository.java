package com.todoc.server.domain.helper.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.querydsl.core.Tuple;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.todoc.server.common.enumeration.Gender;
import com.todoc.server.common.util.DateTimeUtils;
import com.todoc.server.common.util.JsonUtils;
import com.todoc.server.domain.helper.exception.HelperProfileNotFoundException;
import com.todoc.server.domain.helper.web.dto.response.HelperSimpleResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import static com.todoc.server.domain.helper.entity.QHelperProfile.helperProfile;
import static com.todoc.server.domain.helper.entity.QCertificate.certificate;
import static com.todoc.server.domain.auth.entity.QAuth.auth;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Repository
@RequiredArgsConstructor
public class HelperQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Transactional(readOnly = true)
    public HelperSimpleResponse getHelperSimpleByHelperProfileId(Long helperProfileId) {

        // 1. 튜플 조회
        List<Tuple> tuples = queryFactory
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

        // 2. 대표 튜플 추출
        if (tuples.isEmpty()) {
            throw new HelperProfileNotFoundException();
        }

        Tuple first = tuples.getFirst();
        Long authId = first.get(auth.id);
        String name = first.get(auth.name);
        LocalDate birthDate = first.get(auth.birthDate);
        Gender gender = first.get(auth.gender);
        String contact = first.get(auth.contact);

        String imageUrl = first.get(helperProfile.imageUrl);
        String shortBio = first.get(helperProfile.shortBio);
        String strengthJson = first.get(helperProfile.strength);

        // 3. 나이 계산
        int age = (birthDate != null) ? DateTimeUtils.calculateAge(birthDate) : 0;

        // 4. 강점 JSON 파싱
        List<String> strengthList = null;
        if (strengthJson != null) {
            strengthList = JsonUtils.fromJson(strengthJson, new TypeReference<>() {});
        }

        // 5. certificate 중복 제거 및 수집
        List<String> certificateList = tuples.stream()
                .map(t -> t.get(certificate.type))
                .filter(Objects::nonNull)
                .distinct()
                .toList();

        // 6. 응답 객체 생성
        return HelperSimpleResponse.builder()
                .authId(authId)
                .helperProfileId(helperProfileId)
                .imageUrl(imageUrl)
                .name(name)
                .gender(gender)
                .age(age)
                .shortBio(shortBio)
                .contact(contact)
                .strengthList(strengthList)
                .certificateList(certificateList)
                .build();
    }
}
