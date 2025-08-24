package com.todoc.server.domain.helper.service;

import com.todoc.server.common.enumeration.Area;
import com.todoc.server.common.enumeration.Gender;
import com.todoc.server.domain.helper.entity.Certificate;
import com.todoc.server.domain.helper.entity.HelperProfile;
import com.todoc.server.domain.helper.exception.HelperProfileAreaInvalidException;
import com.todoc.server.domain.helper.exception.HelperProfileNotFoundException;
import com.todoc.server.domain.helper.repository.HelperJpaRepository;
import com.todoc.server.domain.helper.repository.HelperQueryRepository;
import com.todoc.server.domain.helper.repository.dto.HelperSimpleFlatDto;
import com.todoc.server.domain.helper.repository.dto.HelperUpdateDefaultFlatDto;
import com.todoc.server.domain.helper.web.dto.request.HelperProfileCreateRequest;
import com.todoc.server.domain.helper.web.dto.response.HelperProfileExistenceResponse;
import com.todoc.server.domain.helper.web.dto.response.HelperSimpleResponse;
import com.todoc.server.domain.helper.web.dto.response.HelperUpdateDefaultResponse;
import com.todoc.server.domain.image.entity.ImageFile;
import com.todoc.server.domain.image.entity.ImageMeta;
import java.util.Optional;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HelperServiceTest {

    @Mock
    private HelperQueryRepository helperQueryRepository;
    @Mock
    private HelperJpaRepository helperJpaRepository;

    @InjectMocks
    private HelperService helperService;

    private final Long helperProfileId = 123L;

    private final Long HELPER_PROFILE_ID = 123L;

    @Nested
    class GetHelperSimpleByHelperProfileId {

        @Test
        void getHelperSimpleByHelperProfileId_정상조회() {
            // given
            ImageFile imageFile = new ImageFile();
            imageFile.setId(999L);

            HelperSimpleFlatDto dto = new HelperSimpleFlatDto(
                HELPER_PROFILE_ID,
                imageFile,
                "[\"안전한 부축\"]",
                "소개글",
                1L,
                "홍길동",
                LocalDate.of(1990, 1, 1),
                Gender.MALE,
                "010-1111-2222",
                "간호조무사"
            );

            when(helperQueryRepository.getHelperSimpleByHelperProfileId(HELPER_PROFILE_ID))
                .thenReturn(List.of(dto));

            // when
            HelperSimpleResponse response = helperService.getHelperSimpleByHelperProfileId(
                HELPER_PROFILE_ID);

            // then
            assertThat(response.getHelperProfileId()).isEqualTo(HELPER_PROFILE_ID);
            assertThat(response.getName()).isEqualTo("홍길동");
            assertThat(response.getStrengthList()).contains("안전한 부축");
            assertThat(response.getCertificateList()).contains("간호조무사");
        }

        @Test
        void getHelperSimpleByHelperProfileId_없으면_예외() {
            // given
            when(helperQueryRepository.getHelperSimpleByHelperProfileId(HELPER_PROFILE_ID))
                .thenReturn(List.of());

            // when & then
            assertThatThrownBy(
                () -> helperService.getHelperSimpleByHelperProfileId(HELPER_PROFILE_ID))
                .isInstanceOf(HelperProfileNotFoundException.class);
        }
    }

    @Nested
    class GetAuthIdByHelperProfileId {

        @Test
        void getAuthIdByHelperProfileId_존재하면_반환() {
            // given
            when(helperJpaRepository.findAuthIdByHelperProfileId(HELPER_PROFILE_ID))
                .thenReturn(Optional.of(77L));

            // when
            Long authId = helperService.getAuthIdByHelperProfileId(HELPER_PROFILE_ID);

            // then
            assertThat(authId).isEqualTo(77L);
        }

        @Test
        void getAuthIdByHelperProfileId_없으면_예외() {
            // given
            when(helperJpaRepository.findAuthIdByHelperProfileId(HELPER_PROFILE_ID))
                .thenReturn(Optional.empty());

            // when & then
            assertThatThrownBy(() -> helperService.getAuthIdByHelperProfileId(HELPER_PROFILE_ID))
                .isInstanceOf(HelperProfileNotFoundException.class);
        }
    }

    @Nested
    class Register {

        @Test
        void register_정상등록() {
            // given
            HelperProfileCreateRequest request = new HelperProfileCreateRequest();
            ReflectionTestUtils.setField(request, "area", "서울");
            ReflectionTestUtils.setField(request, "strengthList", List.of("친절"));
            ReflectionTestUtils.setField(request, "shortBio", "소개글");

            HelperProfile profile = HelperProfile.builder().id(1L).build();
            when(helperJpaRepository.save(any(HelperProfile.class))).thenReturn(profile);

            // when
            HelperProfile result = helperService.register(request);

            // then
            assertThat(result.getId()).isEqualTo(1L);
        }

        @Test
        void register_Area잘못되면_예외() {
            // given
            HelperProfileCreateRequest request = new HelperProfileCreateRequest();
            org.springframework.test.util.ReflectionTestUtils.setField(request, "area", "유효하지않은필드");

            // when & then
            assertThatThrownBy(() -> helperService.register(request))
                .isInstanceOf(HelperProfileAreaInvalidException.class);
        }
    }

    @Nested
    class GetHelperUpdateDefaultByHelperProfileId {

        @Test
        void getHelperUpdateDefaultByHelperProfileId_정상조회() {
            // given
            // 프로필 이미지
            ImageMeta profileMeta = new ImageMeta("helpers/1/profile.jpg", "image/jpeg", 12345L, "\"etag\"");
            ImageFile profileImage = new ImageFile();
            profileImage.setId(55L);
            profileImage.setImageMeta(profileMeta);

            HelperProfile helperProfile = HelperProfile.builder()
                .id(HELPER_PROFILE_ID)
                .helperProfileImage(profileImage)
                .strength("[\"안전한 부축\"]")
                .shortBio("소개글")
                .area(Area.SEOUL)
                .build();

            // 자격증 이미지 세팅 (없으면 NPE 발생!)
            ImageMeta certMeta = new ImageMeta("helpers/1/cert.jpg", "image/jpeg", 54321L, "\"etag-cert\"");
            ImageFile certImage = new ImageFile();
            certImage.setId(77L);
            certImage.setImageMeta(certMeta);

            Certificate cert = new Certificate();
            cert.setType("간호조무사");
            cert.setCertificateImage(certImage);

            HelperUpdateDefaultFlatDto flatDto = new HelperUpdateDefaultFlatDto(helperProfile, cert);

            when(helperQueryRepository.getHelperUpdateDefaultByHelperProfileId(HELPER_PROFILE_ID))
                .thenReturn(List.of(flatDto));

            // when
            HelperUpdateDefaultResponse response =
                helperService.getHelperUpdateDefaultByHelperProfileId(HELPER_PROFILE_ID);

            // then
            assertThat(response.getImageUrl()).contains("/api/images/55/presigned");
            assertThat(response.getShortBio()).isEqualTo("소개글");
            assertThat(response.getStrengthList()).contains("안전한 부축");
            assertThat(response.getCertificateInfoList())
                .extracting("type")
                .containsExactly("간호조무사");
        }

        @Test
        void getHelperUpdateDefaultByHelperProfileId_없으면_예외() {
            // given
            when(helperQueryRepository.getHelperUpdateDefaultByHelperProfileId(HELPER_PROFILE_ID))
                .thenReturn(List.of());

            // when & then
            assertThatThrownBy(
                () -> helperService.getHelperUpdateDefaultByHelperProfileId(HELPER_PROFILE_ID))
                .isInstanceOf(HelperProfileNotFoundException.class);
        }
    }

    @Nested
    class GetHelperProfileById {

        @Test
        void getHelperProfileById_존재하면_반환() {
            // given
            HelperProfile profile = HelperProfile.builder().id(5L).build();
            when(helperJpaRepository.findById(5L)).thenReturn(Optional.of(profile));

            // when
            HelperProfile result = helperService.getHelperProfileById(5L);

            // then
            assertThat(result.getId()).isEqualTo(5L);
        }

        @Test
        void getHelperProfileById_없으면_예외() {
            // given
            when(helperJpaRepository.findById(5L)).thenReturn(Optional.empty());

            // when & then
            assertThatThrownBy(() -> helperService.getHelperProfileById(5L))
                .isInstanceOf(HelperProfileNotFoundException.class);
        }
    }

    @Nested
    class GetAllHelperProfiles {

        @Test
        void getAllHelperProfiles_정상조회() {
            // given
            when(helperJpaRepository.findAll()).thenReturn(
                List.of(new HelperProfile(), new HelperProfile()));

            // when
            List<HelperProfile> list = helperService.getAllHelperProfiles();

            // then
            assertThat(list).hasSize(2);
        }
    }

    @Nested
    class CheckHelperProfileExistence {

        @Test
        void checkHelperProfileExistence_존재함() {
            // given
            HelperProfile profile = HelperProfile.builder().id(100L).build();
            when(helperJpaRepository.findByAuthId(1L)).thenReturn(Optional.of(profile));

            // when
            HelperProfileExistenceResponse response = helperService.checkHelperProfileExistence(1L);

            // then
            assertThat(response.isHasProfile()).isTrue();
            assertThat(response.getHelperProfileId()).isEqualTo(100L);
        }

        @Test
        void checkHelperProfileExistence_없음() {
            // given
            when(helperJpaRepository.findByAuthId(2L)).thenReturn(Optional.empty());

            // when
            HelperProfileExistenceResponse response = helperService.checkHelperProfileExistence(2L);

            // then
            assertThat(response.isHasProfile()).isFalse();
            assertThat(response.getHelperProfileId()).isNull();
        }
    }

    @Nested
    class HasHelperProfile {

        @Test
        void hasHelperProfile_true반환() {
            // given
            when(helperJpaRepository.findByAuthId(1L)).thenReturn(Optional.of(new HelperProfile()));

            // when
            boolean result = helperService.hasHelperProfile(1L);

            // then
            assertThat(result).isTrue();
        }

        @Test
        void hasHelperProfile_false반환() {
            // given
            when(helperJpaRepository.findByAuthId(2L)).thenReturn(Optional.empty());

            // when
            boolean result = helperService.hasHelperProfile(2L);

            // then
            assertThat(result).isFalse();
        }
    }

    @Nested
    class GetHelperProfileByEscortId {

        @Test
        void getHelperProfileByEscortId_정상조회() {
            // given
            Long escortId = 55L;
            HelperProfile profile = HelperProfile.builder().id(101L).build();
            when(helperQueryRepository.findHelperProfileByEscortId(escortId))
                .thenReturn(profile);

            // when
            HelperProfile result = helperService.getHelperProfileByEscortId(escortId);

            // then
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(101L);
        }

        @Test
        void getHelperProfileByEscortId_없으면_예외() {
            // given
            Long escortId = 55L;
            when(helperQueryRepository.findHelperProfileByEscortId(escortId))
                .thenReturn(null);

            // when & then
            assertThatThrownBy(() -> helperService.getHelperProfileByEscortId(escortId))
                .isInstanceOf(HelperProfileNotFoundException.class);
        }
    }
}