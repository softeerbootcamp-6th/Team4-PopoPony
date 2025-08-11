package com.todoc.server.domain.helper.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.querydsl.core.Tuple;
import com.todoc.server.common.enumeration.Area;
import com.todoc.server.common.enumeration.Gender;
import com.todoc.server.common.enumeration.RecruitStatus;
import com.todoc.server.common.util.DateTimeUtils;
import com.todoc.server.common.util.JsonUtils;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.web.dto.request.RecruitCreateRequest;
import com.todoc.server.domain.helper.entity.HelperProfile;
import com.todoc.server.domain.helper.exception.HelperProfileAreaInvalidException;
import com.todoc.server.domain.helper.exception.HelperProfileNotFoundException;
import com.todoc.server.domain.helper.repository.HelperJpaRepository;
import com.todoc.server.domain.helper.repository.HelperQueryRepository;
import com.todoc.server.domain.helper.web.dto.request.HelperProfileCreateRequest;
import com.todoc.server.domain.helper.web.dto.response.HelperSimpleResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

import static com.todoc.server.domain.auth.entity.QAuth.auth;
import static com.todoc.server.domain.helper.entity.QCertificate.certificate;
import static com.todoc.server.domain.helper.entity.QHelperProfile.helperProfile;

@Service
@RequiredArgsConstructor
@Transactional
public class HelperService {

    private final HelperJpaRepository helperJpaRepository;
    private final HelperQueryRepository helperQueryRepository;

    /**
     * helperProfileId에 해당하는 도우미 요약 정보를 조회하는 함수
     *
     * @param helperProfileId 도우미 프로필 ID
     * @return HelperSimpleResponse 인스턴스
     */
    @Transactional(readOnly = true)
    public HelperSimpleResponse getHelperSimpleByHelperProfileId(Long helperProfileId) {

        List<Tuple> tuples = helperQueryRepository.getHelperSimpleByHelperProfileId(helperProfileId);
        if (tuples.isEmpty()) {
            throw new HelperProfileNotFoundException();
        }
        return buildHelperSimpleByHelperProfileId(tuples);
    }

    @Transactional(readOnly = true)
    public HelperSimpleResponse buildHelperSimpleByHelperProfileId(List<Tuple> tuples) {

        // 1. 필드 추출
        Tuple first = tuples.getFirst();
        Long helperProfileId = first.get(helperProfile.id);
        String name = first.get(auth.name);
        LocalDate birthDate = first.get(auth.birthDate);
        Gender gender = first.get(auth.gender);
        String contact = first.get(auth.contact);

        String imageUrl = first.get(helperProfile.imageUrl);
        String shortBio = first.get(helperProfile.shortBio);
        String strengthJson = first.get(helperProfile.strength);

        // 2. 나이 계산
        int age = (birthDate != null) ? DateTimeUtils.calculateAge(birthDate) : 0;

        // 3. 강점 JSON 파싱
        List<String> strengthList = null;
        if (strengthJson != null) {
            strengthList = JsonUtils.fromJson(strengthJson, new TypeReference<>() {
            });
        }

        // 4. certificate 중복 제거 및 수집
        List<String> certificateList = tuples.stream()
                .map(t -> t.get(certificate.type))
                .filter(Objects::nonNull)
                .distinct()
                .toList();

        // 5. 응답 객체 생성
        return HelperSimpleResponse.builder()
                .helperProfileId(helperProfileId)
                .imageUrl(imageUrl)
                .name(name)
                .gender(gender.getLabel())
                .age(age)
                .shortBio(shortBio)
                .contact(contact)
                .strengthList(strengthList)
                .certificateList(certificateList)
                .build();
    }

    @Transactional(readOnly = true)
    public Long getAuthIdByHelperProfileId(Long helperProfileId) {
        return helperJpaRepository.findAuthIdByHelperProfileId(helperProfileId)
                .orElseThrow(HelperProfileNotFoundException::new);
    }

    public HelperProfile register(HelperProfileCreateRequest request) {

        Area area = Area.from(request.getArea())
                .orElseThrow(HelperProfileAreaInvalidException::new);

        HelperProfile helperProfile = HelperProfile.builder()
                .area(area)
                .strength(JsonUtils.toJson(request.getStrengthList()))
                .shortBio(request.getShortBio())
                .imageUrl(request.getImageUrl())
                .build();

        return helperJpaRepository.save(helperProfile);
    }

    public List<HelperProfile> getAllHelperProfiles() {
        return helperJpaRepository.findAll();
    }
}
