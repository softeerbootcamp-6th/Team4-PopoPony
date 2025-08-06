package com.todoc.server.domain.escort.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.querydsl.core.Tuple;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.todoc.server.common.enumeration.Gender;
import com.todoc.server.common.util.DateTimeUtils;
import com.todoc.server.common.util.JsonUtils;
import com.todoc.server.domain.escort.web.dto.response.ApplicationListResponse;
import com.todoc.server.domain.escort.web.dto.response.ApplicationSimpleResponse;
import com.todoc.server.domain.helper.web.dto.response.HelperSimpleResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import static com.todoc.server.domain.escort.entity.QApplication.application;
import static com.todoc.server.domain.auth.entity.QAuth.auth;
import static com.todoc.server.domain.helper.entity.QHelperProfile.helperProfile;
import static com.todoc.server.domain.helper.entity.QCertificate.certificate;
@Repository
@RequiredArgsConstructor
public class ApplicationQueryRepository {

    private final JPAQueryFactory queryFactory;

    public ApplicationListResponse findApplicationListByRecruitId(Long recruitId) {
        // 1. 평면 데이터 조회
        List<Tuple> tuples = queryFactory
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

        // 2. application.id 기준으로 groupBy
        Map<Long, List<Tuple>> groupedByApplication = tuples.stream()
                .collect(Collectors.groupingBy(t -> t.get(application.id)));

        // 3. 결과 매핑
        List<ApplicationSimpleResponse> list = groupedByApplication.entrySet().stream()
                .map(entry -> {
                    Long applicationId = entry.getKey();
                    List<Tuple> groupedTuples = entry.getValue();

                    // 대표값 (모든 튜플에 동일)
                    Tuple first = groupedTuples.get(0);
                    Long authId = first.get(auth.id);
                    Long helperId = first.get(helperProfile.id);
                    String imageUrl = first.get(helperProfile.imageUrl);
                    String name = first.get(auth.name);
                    LocalDate birthDate = first.get(auth.birthDate);
                    Gender gender = first.get(auth.gender);
                    String strengthJson = first.get(helperProfile.strength);
                    String shortBio = first.get(helperProfile.shortBio);
                    String contact = first.get(auth.contact);

                    // 나이 계산
                    Integer age = birthDate != null ? DateTimeUtils.calculateAge(birthDate) : null;

                    // 강점 JSON 파싱
                    List<String> strengthList = null;
                    if (strengthJson != null) {
                        strengthList = JsonUtils.fromJson(strengthJson, new TypeReference<>() {});
                    }

                    // certificate 중복 제거 및 수집
                    List<String> certificateList = groupedTuples.stream()
                            .map(t -> t.get(certificate.type))
                            .filter(Objects::nonNull)
                            .distinct()
                            .toList();

                    // HelperSimpleResponse 생성
                    HelperSimpleResponse helperResponse = HelperSimpleResponse.builder()
                            .authId(authId)
                            .helperProfileId(helperId)
                            .imageUrl(imageUrl)
                            .name(name)
                            .gender(gender)
                            .age(age)
                            .shortBio(shortBio)
                            .contact(contact)
                            .certificateList(certificateList)
                            .strengthList(strengthList)
                            .build();

                    return ApplicationSimpleResponse.builder()
                            .applicationId(applicationId)
                            .helper(helperResponse)
                            .build();
                })
                .toList();

        return ApplicationListResponse.builder()
                .applicationList(list)
                .build();
    }
}
