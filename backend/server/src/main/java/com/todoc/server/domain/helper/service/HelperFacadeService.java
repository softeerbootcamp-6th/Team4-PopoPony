package com.todoc.server.domain.helper.service;

import com.todoc.server.common.enumeration.Area;
import com.todoc.server.common.util.JsonUtils;
import com.todoc.server.domain.auth.entity.Auth;
import com.todoc.server.domain.auth.service.AuthService;
import com.todoc.server.domain.escort.service.EscortService;
import com.todoc.server.domain.helper.entity.Certificate;
import com.todoc.server.domain.helper.entity.HelperProfile;
import com.todoc.server.domain.helper.exception.HelperProfileAreaInvalidException;
import com.todoc.server.domain.helper.web.dto.request.CertificateCreateRequest;
import com.todoc.server.domain.helper.web.dto.request.HelperProfileCreateRequest;
import com.todoc.server.domain.helper.web.dto.response.HelperDetailResponse;
import com.todoc.server.domain.helper.web.dto.response.HelperSimpleResponse;
import com.todoc.server.domain.image.entity.ImageFile;
import com.todoc.server.domain.image.service.ImageFileService;
import com.todoc.server.domain.review.service.PositiveFeedbackChoiceService;
import com.todoc.server.domain.review.service.ReviewService;
import com.todoc.server.domain.review.web.dto.response.PositiveFeedbackStatResponse;
import com.todoc.server.domain.review.web.dto.response.ReviewSimpleResponse;
import com.todoc.server.domain.review.web.dto.response.ReviewStatResponse;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Transactional
public class HelperFacadeService {

    private final HelperService helperService;
    private final EscortService escortService;
    private final ReviewService reviewService;
    private final PositiveFeedbackChoiceService positiveFeedbackChoiceService;
    private final CertificateService certificateService;
    private final AuthService authService;
    private final ImageFileService imageFileService;

    /**
     * helperProfileId에 해당하는 도우미의 상세 정보를 조회하는 함수
     *
     * @param helperProfileId 도우미 프로필 ID
     * @return 도우미 상세 정보 (HelperDetailResponse)
     */
    @Transactional(readOnly = true)
    public HelperDetailResponse getHelperDetailByHelperProfileId(Long helperProfileId) {

        // 1. 도우미 조회
        HelperSimpleResponse helperSimple = helperService.getHelperSimpleByHelperProfileId(helperProfileId);
        Long authId = helperService.getAuthIdByHelperProfileId(helperProfileId);

        // 2. 동행 횟수 조회 (helper의 userId(authId)로 검색)
        Long escortCount = escortService.getCountByHelperUserId(authId);

        // 3. 리뷰 통계 조회 (helper의 userId(authId)로 검색)
        ReviewStatResponse reviewStat = reviewService.getReviewStatByUserId(authId);

        // 4. 후기 키워드 통계 / 최신 후기
        List<PositiveFeedbackStatResponse> positiveFeedbackStat = positiveFeedbackChoiceService.getPositiveFeedbackStatByHelperUserId(authId);
        List<ReviewSimpleResponse> latestReviews = reviewService.getLatestReviewsByHelperUserId(authId);

        // 5. 응답 객체 생성
        return HelperDetailResponse.builder()
                .helperSimple(helperSimple)
                .escortCount(escortCount)
                .reviewStat(reviewStat)
                .positiveFeedbackStatList(positiveFeedbackStat)
                .latestReviewList(latestReviews)
                .build();
    }

    /**
     * 도우미 프로필 정보를 등록하는 함수
     */
    @Transactional
    public void createHelperProfile(Long authId, HelperProfileCreateRequest requestDto) {

        HelperProfile helperProfile = helperService.register(requestDto);

        Auth auth = authService.getAuthById(authId);
        helperProfile.setAuth(auth);

        // TODO :: 마지막 위치 정보 가져오기
        helperProfile.setLatestLocation(null);

        ImageFile profileImage = imageFileService.register(requestDto.getProfileImageCreateRequest());
        helperProfile.setHelperProfileImage(profileImage);

        // 자격증 정보 저장
        List<CertificateCreateRequest> certificateInfoList = Optional.ofNullable(requestDto.getCertificateInfoList())
                        .orElse(Collections.emptyList());

        for (CertificateCreateRequest certificateInfo : certificateInfoList) {
            ImageFile certificateImage = imageFileService.register(certificateInfo.getCertificateImageCreateRequest());
            Certificate certificate = certificateService.register(certificateInfo);
            certificate.setHelperProfile(helperProfile);
            certificate.setCertificateImage(certificateImage);
        }
    }

    @Transactional
    public void updateHelperProfile(Long helperProfileId, HelperProfileCreateRequest requestDto) {

        HelperProfile helperProfile = helperService.getHelperProfileById(helperProfileId);

        if (requestDto.getProfileImageCreateRequest() != null) {
            ImageFile newProfileImage = imageFileService.register(requestDto.getProfileImageCreateRequest());
            helperProfile.setHelperProfileImage(newProfileImage);
        }

        if (requestDto.getStrengthList() != null) {
            String jsonStrength = JsonUtils.toJson(requestDto.getStrengthList());
            helperProfile.setStrength(jsonStrength);
        }

        helperProfile.setShortBio(requestDto.getShortBio());

        // area 업데이트
        Area area = Area.from(requestDto.getArea())
                .orElseThrow(HelperProfileAreaInvalidException::new);
        helperProfile.setArea(area);

        // 자격증 정보는 기존 것 삭제하고 새로 저장
        if (requestDto.getCertificateInfoList() != null) {
            certificateService.deleteAllByHelperProfileId(helperProfileId);
        }

        List<CertificateCreateRequest> certificateInfoList = Optional.ofNullable(requestDto.getCertificateInfoList())
                        .orElse(Collections.emptyList());

        for (CertificateCreateRequest certificateInfo : certificateInfoList) {
            ImageFile certificateImage = imageFileService.register(certificateInfo.getCertificateImageCreateRequest());
            Certificate certificate = certificateService.register(certificateInfo);
            certificate.setHelperProfile(helperProfile);
            certificate.setCertificateImage(certificateImage);
        }
    }
}
