package com.todoc.server.domain.escort.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.querydsl.core.Tuple;
import com.todoc.server.common.enumeration.Gender;
import com.todoc.server.common.util.DateTimeUtils;
import com.todoc.server.common.util.JsonUtils;
import com.todoc.server.domain.escort.entity.Application;
import com.todoc.server.domain.escort.web.dto.response.ApplicationListResponse;
import com.todoc.server.domain.escort.web.dto.response.ApplicationSimpleResponse;
import com.todoc.server.domain.helper.web.dto.response.HelperSimpleResponse;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import static com.todoc.server.domain.escort.entity.QApplication.application;
import static com.todoc.server.domain.auth.entity.QAuth.auth;
import static com.todoc.server.domain.helper.entity.QHelper.helper;
import static com.todoc.server.domain.helper.entity.QCertificate.certificate;

@Repository
public class ApplicationQueryRepository extends QuerydslRepositorySupport {

    public ApplicationQueryRepository() {
        super(Application.class);
    }

    public ApplicationListResponse findApplicationListByRecruitId(Long recruitId) {
        // 1. 평면 데이터 조회
        List<Tuple> tuples = getQuerydsl().createQuery()
                .select(
                        application.id,
                        helper.id,
                        helper.imageUrl,
                        auth.name,
                        auth.birthDate,
                        auth.gender,
                        helper.strength,
                        certificate.type
                )
                .from(application)
                .join(auth).on(application.helper.eq(auth))
                .join(helper).on(helper.auth.eq(auth))
                .leftJoin(certificate).on(certificate.helper.eq(helper))
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
                    Long helperId = first.get(helper.id);
                    String imageUrl = first.get(helper.imageUrl);
                    String name = first.get(auth.name);
                    LocalDate birthDate = first.get(auth.birthDate);
                    Gender gender = first.get(auth.gender);
                    String strengthJson = first.get(helper.strength);

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
                            .helperId(helperId)
                            .imageUrl(imageUrl)
                            .name(name)
                            .gender(gender)
                            .age(age)
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
