package com.todoc.server.domain.helper.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.querydsl.core.Tuple;
import com.todoc.server.common.dto.request.ImageCreateRequest;
import com.todoc.server.common.enumeration.Area;
import com.todoc.server.common.enumeration.Gender;
import com.todoc.server.common.util.DateTimeUtils;
import com.todoc.server.common.util.ImageUrlUtils;
import com.todoc.server.common.util.JsonUtils;
import com.todoc.server.domain.escort.repository.dto.ApplicationFlatDto;
import com.todoc.server.domain.helper.entity.Certificate;
import com.todoc.server.domain.helper.entity.HelperProfile;
import com.todoc.server.domain.helper.exception.HelperProfileAreaInvalidException;
import com.todoc.server.domain.helper.exception.HelperProfileNotFoundException;
import com.todoc.server.domain.helper.repository.HelperJpaRepository;
import com.todoc.server.domain.helper.repository.HelperQueryRepository;
import com.todoc.server.domain.helper.repository.dto.HelperSimpleFlatDto;
import com.todoc.server.domain.helper.repository.dto.HelperUpdateDefaultFlatDto;
import com.todoc.server.domain.helper.web.dto.request.CertificateCreateRequest;
import com.todoc.server.domain.helper.web.dto.request.HelperProfileCreateRequest;
import com.todoc.server.domain.helper.web.dto.response.HelperProfileExistenceResponse;
import com.todoc.server.domain.helper.web.dto.response.HelperSimpleResponse;
import com.todoc.server.domain.helper.web.dto.response.HelperUpdateDefaultResponse;
import com.todoc.server.domain.image.entity.ImageFile;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
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

        List<ApplicationFlatDto> tuples = helperQueryRepository.getHelperSimpleByHelperProfileId(helperProfileId);
        if (tuples.isEmpty()) {
            throw new HelperProfileNotFoundException();
        }
        return buildHelperSimpleByHelperProfileId(tuples);
    }

    @Transactional(readOnly = true)
    public HelperSimpleResponse buildHelperSimpleByHelperProfileId(List<ApplicationFlatDto> applicationFlatDtoList) {

        // 1. 필드 추출
        ApplicationFlatDto first = applicationFlatDtoList.getFirst();
        Long helperProfileId = first.getHelperProfileId();
        String name = first.getName();
        LocalDate birthDate = first.getBirthDate();
        Gender gender = first.getGender();
        String contact = first.getContact();

        ImageFile helperProfileImage = first.getHelperProfileImage();
        String shortBio = first.getShortBio();
        String strengthJson = first.getStrength();

        // 2. 나이 계산
        int age = (birthDate != null) ? DateTimeUtils.calculateAge(birthDate) : 0;

        // 3. 강점 JSON 파싱
        List<String> strengthList = null;
        if (strengthJson != null) {
            strengthList = JsonUtils.fromJson(strengthJson, new TypeReference<>() {
            });
        }

        // 4. certificate 중복 제거 및 수집
        List<String> certificateList = applicationFlatDtoList.stream()
                .map(t -> t.getCertificateType())
                .filter(Objects::nonNull)
                .distinct()
                .toList();

        // 5. 응답 객체 생성
        return HelperSimpleResponse.builder()
                .helperProfileId(helperProfileId)
                .imageUrl(ImageUrlUtils.getImageUrl(helperProfileImage.getId()))
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
                .build();

        return helperJpaRepository.save(helperProfile);
    }

    @Transactional(readOnly = true)
    public HelperUpdateDefaultResponse getHelperUpdateDefaultByHelperProfileId(Long helperProfileId) {

        List<HelperUpdateDefaultFlatDto> list = helperQueryRepository.getHelperUpdateDefaultByHelperProfileId(helperProfileId);
        if (list.isEmpty()) {
            throw new HelperProfileNotFoundException();
        }

        HelperUpdateDefaultFlatDto first = list.getFirst();
        HelperProfile helperProfile = first.getHelperProfile();
        ImageFile profileImage = helperProfile.getHelperProfileImage();
        String strength = helperProfile.getStrength();

        List<CertificateCreateRequest> certificateCreateRequestList = new ArrayList<>();
        for (HelperUpdateDefaultFlatDto flatDto : list) {
            Certificate certificate = flatDto.getCertificate();

            CertificateCreateRequest certificateCreateRequest = CertificateCreateRequest.builder()
                    .type(certificate.getType())
                    .certificateImageCreateRequest(ImageCreateRequest.from(certificate.getCertificateImage()))
                    .build();
            certificateCreateRequestList.add(certificateCreateRequest);
        }

        return HelperUpdateDefaultResponse.builder()
                .imageUrl(ImageUrlUtils.getImageUrl(profileImage.getId()))
                .profileImageCreateRequest(ImageCreateRequest.from(profileImage))
                .strengthList(JsonUtils.fromJson(strength, new TypeReference<>() {}))
                .shortBio(helperProfile.getShortBio())
                .area(helperProfile.getArea().getLabel())
                .certificateInfoList(certificateCreateRequestList)
                .build();
    }

    public HelperProfile getHelperProfileById(Long helperProfileId) {
        return helperJpaRepository.findById(helperProfileId)
                .orElseThrow(HelperProfileNotFoundException::new);
    }

    public List<HelperProfile> getAllHelperProfiles() {
        return helperJpaRepository.findAll();
    }


    /**
     * 도우미 프로필이 존재하는지의 정보를 담은 응답을 생성하는 함수
     */
    public HelperProfileExistenceResponse checkHelperProfileExistence(Long authId) {

        Optional<HelperProfile> optional = helperJpaRepository.findByAuthId(authId);

        boolean hasProfile = false;
        Long helperProfileId = null;
        if (optional.isPresent()) {
            hasProfile = true;
            helperProfileId = optional.get().getId();
        }

        return HelperProfileExistenceResponse.builder()
                .hasProfile(hasProfile)
                .helperProfileId(helperProfileId)
                .build();
    }

    /**
     * 도우미 프로필이 존재하는지 확인하는 함수
     */
    public boolean hasHelperProfile(Long authId) {

        Optional<HelperProfile> optional = helperJpaRepository.findByAuthId(authId);
        return optional.isPresent();
    }

    /**
     * 동행 신청에 지원한 도우미 목록을 조회하는 함수
     */
    public List<HelperProfile> getHelperProfileListByRecruitId(Long recruitId) {

        List<HelperProfile> list = helperQueryRepository.getHelperProfileListByRecruitId(recruitId);
        if (list.isEmpty()) {
            throw new HelperProfileNotFoundException();
        }
        return list;
    }
}
