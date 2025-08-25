package com.todoc.server.domain.helper.service;

import com.todoc.server.common.enumeration.Area;
import com.todoc.server.domain.auth.entity.Auth;
import com.todoc.server.domain.auth.service.AuthService;
import com.todoc.server.domain.escort.service.EscortService;
import com.todoc.server.domain.helper.entity.Certificate;
import com.todoc.server.domain.helper.entity.HelperProfile;
import com.todoc.server.domain.helper.web.dto.request.CertificateCreateRequest;
import com.todoc.server.domain.helper.web.dto.request.HelperProfileCreateRequest;
import com.todoc.server.domain.helper.web.dto.response.HelperDetailResponse;
import com.todoc.server.domain.helper.web.dto.response.HelperSimpleResponse;
import com.todoc.server.domain.image.entity.ImageFile;
import com.todoc.server.domain.image.entity.ImageMeta;
import com.todoc.server.domain.image.service.ImageFileService;
import com.todoc.server.domain.review.service.PositiveFeedbackChoiceService;
import com.todoc.server.domain.review.service.ReviewService;
import com.todoc.server.domain.review.web.dto.response.PositiveFeedbackStatResponse;
import com.todoc.server.domain.review.web.dto.response.ReviewSimpleResponse;
import com.todoc.server.domain.review.web.dto.response.ReviewStatResponse;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;
import static org.assertj.core.api.Assertions.*;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@ExtendWith(MockitoExtension.class)
class HelperFacadeServiceTest {

    @Mock
    private HelperService helperService;
    @Mock
    private CertificateService certificateService;
    @Mock
    private EscortService escortService;
    @Mock
    private ReviewService reviewService;
    @Mock
    private PositiveFeedbackChoiceService positiveFeedbackChoiceService;
    @Mock
    private AuthService authService;
    @Mock
    private ImageFileService imageFileService;

    @InjectMocks
    private HelperFacadeService helperFacadeService;

    @Nested
    class GetHelperDetailByHelperProfileId {

        @Test
        void getHelperDetailByHelperProfileId_정상조회() {
            // given
            Long helperProfileId = 1L;
            Long authId = 10L;

            given(helperService.getHelperSimpleByHelperProfileId(helperProfileId))
                .willReturn(HelperSimpleResponse.builder()
                    .helperProfileId(helperProfileId)
                    .name("홍길동")
                    .age(30)
                    .gender("남자")
                    .build());

            given(helperService.getAuthIdByHelperProfileId(helperProfileId))
                .willReturn(authId);

            given(escortService.getCountByHelperUserId(authId))
                .willReturn(5L);

            given(reviewService.getReviewStatByUserId(authId))
                .willReturn(ReviewStatResponse.builder()
                    .reviewCount(7L)
                    .goodRate(71)
                    .averageRate(29)
                    .badRate(0)
                    .build());

            given(positiveFeedbackChoiceService.getPositiveFeedbackStatByHelperUserId(authId))
                .willReturn(List.of(
                    PositiveFeedbackStatResponse.builder()
                        .description("친절해요")
                        .count(3L)
                        .build()
                ));

            given(reviewService.getLatestReviewsByHelperUserId(authId))
                .willReturn(List.of(
                    ReviewSimpleResponse.builder()
                        .satisfactionLevel("GOOD")
                        .shortComment("정말 좋았습니다!!!")
                        .createdAt(LocalDateTime.now().minusDays(1))
                        .build()
                ));

            // when
            HelperDetailResponse response = helperFacadeService.getHelperDetailByHelperProfileId(helperProfileId);

            // then
            assertThat(response).isNotNull();
            assertThat(response.getHelperSimple().getHelperProfileId()).isEqualTo(helperProfileId);
            assertThat(response.getEscortCount()).isEqualTo(5L);
            assertThat(response.getReviewStat().getAverageRate()).isEqualTo(29);
            assertThat(response.getPositiveFeedbackStatList()).hasSize(1);
            assertThat(response.getLatestReviewList()).hasSize(1);
        }
    }

    @Nested
    class CreateHelperProfile {

        @Test
        void createHelperProfile_정상등록() {
            // given
            HelperProfileCreateRequest request = new HelperProfileCreateRequest();
            List<CertificateCreateRequest> certs = new ArrayList<>();

            for (int i = 1; i <= 2; i++) {
                CertificateCreateRequest certificateInfo = new CertificateCreateRequest();
                ReflectionTestUtils.setField(certificateInfo, "type", "자격증" + i);

                var imageCreateRequest = new com.todoc.server.common.dto.request.ImageCreateRequest();
                ReflectionTestUtils.setField(imageCreateRequest, "s3Key", "helpers/1/cert-" + i + ".jpg");
                ReflectionTestUtils.setField(imageCreateRequest, "contentType", "image/jpeg");
                ReflectionTestUtils.setField(imageCreateRequest, "size", 12345L * i);
                ReflectionTestUtils.setField(imageCreateRequest, "checksum", "\"etag-cert-" + i + "\"");

                ReflectionTestUtils.setField(certificateInfo, "certificateImageCreateRequest", imageCreateRequest);
                certs.add(certificateInfo);
            }
            ReflectionTestUtils.setField(request, "certificateInfoList", certs);

            Long authId = 1L;
            Auth auth = Auth.builder().id(authId).build();
            HelperProfile helperProfile = HelperProfile.builder().build();

            given(helperService.hasHelperProfile(authId)).willReturn(false);
            given(helperService.register(request)).willReturn(helperProfile);
            given(authService.getAuthById(authId)).willReturn(auth);
            given(certificateService.register(any(CertificateCreateRequest.class)))
                .willReturn(new Certificate());

            // when // then
            assertThatCode(() -> helperFacadeService.createHelperProfile(authId, request))
                .doesNotThrowAnyException();
        }

        @Test
        void createHelperProfile_이미존재하면_예외() {
            // given
            Long authId = 1L;
            HelperProfileCreateRequest request = new HelperProfileCreateRequest();
            given(helperService.hasHelperProfile(authId)).willReturn(true);

            // when // then
            assertThatThrownBy(() -> helperFacadeService.createHelperProfile(authId, request))
                .isInstanceOf(com.todoc.server.domain.helper.exception.HelperProfileAlreadyCreatedException.class);
        }
    }

    @Nested
    class UpdateHelperProfile {
        @Test
        void updateHelperProfile_정상수정() {
            // given
            Long helperProfileId = 1L;

            HelperProfile existingProfile = HelperProfile.builder()
                .id(helperProfileId)
                .shortBio("old bio")
                .area(Area.SEOUL)
                .build();

            HelperProfileCreateRequest request = new HelperProfileCreateRequest();
            // 새 shortBio
            ReflectionTestUtils.setField(request, "shortBio", "새로운 소개글");
            // strengthList
            ReflectionTestUtils.setField(request, "strengthList", List.of("친절", "책임감"));
            // area
            ReflectionTestUtils.setField(request, "area", "부산");
            // profileImageCreateRequest (간단히 mock)
            var imageReq = new com.todoc.server.common.dto.request.ImageCreateRequest();
            ReflectionTestUtils.setField(imageReq, "s3Key", "helpers/1/profile.jpg");
            ReflectionTestUtils.setField(imageReq, "contentType", "image/jpeg");
            ReflectionTestUtils.setField(imageReq, "size", 1234L);
            ReflectionTestUtils.setField(imageReq, "checksum", "\"etag-1\"");
            ReflectionTestUtils.setField(request, "profileImageCreateRequest", imageReq);

            given(helperService.getHelperProfileById(helperProfileId))
                .willReturn(existingProfile);

            // 이미지 파일 리턴
            ImageMeta meta = new ImageMeta("helpers/1/profile.jpg", "image/jpeg", 1234L, "\"etag-1\"");
            ImageFile newProfileImage = new ImageFile();
            newProfileImage.setId(99L);
            newProfileImage.setImageMeta(meta);
            given(imageFileService.register(imageReq)).willReturn(newProfileImage);

            // certificate info list
            CertificateCreateRequest certReq = new CertificateCreateRequest();
            ReflectionTestUtils.setField(certReq, "type", "간호조무사");
            ReflectionTestUtils.setField(request, "certificateInfoList", List.of(certReq));
            given(certificateService.register(certReq)).willReturn(new Certificate());
            given(imageFileService.register(certReq.getCertificateImageCreateRequest())).willReturn(new ImageFile());

            // when
            helperFacadeService.updateHelperProfile(helperProfileId, request);

            // then
            assertThat(existingProfile.getShortBio()).isEqualTo("새로운 소개글");
            assertThat(existingProfile.getArea()).isEqualTo(Area.BUSAN);
            assertThat(existingProfile.getStrength()).contains("친절"); // JSON 변환 확인
            assertThat(existingProfile.getHelperProfileImage()).isEqualTo(newProfileImage);
        }

        @Test
        void updateHelperProfile_area잘못되면_예외() {
            // given
            Long helperProfileId = 1L;
            HelperProfileCreateRequest request = new HelperProfileCreateRequest();
            ReflectionTestUtils.setField(request, "area", "UNKNOWN_AREA");

            given(helperService.getHelperProfileById(helperProfileId))
                .willReturn(HelperProfile.builder().build());

            // when // then
            assertThatThrownBy(() -> helperFacadeService.updateHelperProfile(helperProfileId, request))
                .isInstanceOf(com.todoc.server.domain.helper.exception.HelperProfileAreaInvalidException.class);
        }
    }
}