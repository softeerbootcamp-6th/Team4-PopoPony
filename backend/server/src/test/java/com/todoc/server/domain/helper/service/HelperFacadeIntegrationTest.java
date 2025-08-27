package com.todoc.server.domain.helper.service;

import com.todoc.server.IntegrationTest;
import com.todoc.server.common.dto.request.ImageCreateRequest;
import com.todoc.server.common.enumeration.Area;
import com.todoc.server.common.util.JsonUtils;
import com.todoc.server.domain.helper.entity.HelperProfile;
import com.todoc.server.domain.helper.exception.HelperProfileAlreadyCreatedException;
import com.todoc.server.domain.helper.exception.HelperProfileAreaInvalidException;
import com.todoc.server.domain.helper.exception.HelperProfileNotFoundException;
import com.todoc.server.domain.helper.web.dto.request.CertificateCreateRequest;
import com.todoc.server.domain.helper.web.dto.request.HelperProfileCreateRequest;
import com.todoc.server.domain.helper.web.dto.response.HelperDetailResponse;
import com.todoc.server.domain.helper.web.dto.response.HelperProfileExistenceResponse;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.assertj.core.api.Assertions.assertThat;

@Transactional
public class HelperFacadeIntegrationTest extends IntegrationTest {

    @Autowired
    private HelperFacadeService helperFacadeService;

    @Autowired
    private HelperService helperService;

    @Autowired
    private CertificateService certificateService;

    @PersistenceContext
    private EntityManager em;

    @Nested
    @DisplayName("도우미 상세 조회(getHelperDetailByHelperProfileId)")
    class GetHelperDetailByHelperProfileId {

        @Test
        @DisplayName("존재하면 상세 정보를 반환한다")
        void 존재하면_상세정보반환() {
            // given
            Long helperProfileId = 4L;

            // when
            var response = helperFacadeService.getHelperDetailByHelperProfileId(helperProfileId);

            // then
            assertThat(response).isNotNull();
            assertThat(response.getHelperSimple().getName()).isEqualTo("최유진");
            assertThat(response.getEscortCount()).isEqualTo(2);
            // 통합 테스트 특성상 과도한 필드 검증은 지양하고, 핵심 지표 위주로 검증
            assertThat(response.getLatestReviewList()).isNotNull();
            assertThat(response.getPositiveFeedbackStatList()).isNotNull();
        }

        @Test
        @DisplayName("존재하지 않으면 예외를 발생시킨다")
        void 존재하지않으면_예외발생() {
            Long helperProfileId = 999L;

            assertThatThrownBy(() -> helperFacadeService.getHelperDetailByHelperProfileId(helperProfileId))
                .isInstanceOf(HelperProfileNotFoundException.class);
        }
    }

    @Nested
    @DisplayName("도우미 프로필 등록(createHelperProfile)")
    class CreateHelperProfile {

        @Test
        @DisplayName("정상 등록 시 프로필과 자격증이 저장된다")
        void 정상등록시_프로필과자격증저장() {
            // given
            var request = createHelperProfileRequest(); // 신규 등록용
            Long authId = 6L; // data.sql 기준: 프로필 없음
            int before = helperService.getAllHelperProfiles().size();

            // when
            helperFacadeService.createHelperProfile(authId, request);

            // then
            var profiles = helperService.getAllHelperProfiles();
            int after = profiles.size();
            assertThat(after - before).isEqualTo(1);

            var saved = profiles.get(profiles.size() - 1);
            assertThat(saved.getShortBio()).isEqualTo("부모님처럼 모시겠습니다!");
            assertThat(saved.getArea()).isEqualTo(Area.SEOUL);
            assertThat(saved.getHelperProfileImage().getImageMeta().getContentType()).isEqualTo("image/png");

            var certTypes = certificateService.getCertificateTypesByHelperProfileId(saved.getId());
            assertThat(certTypes).containsExactlyInAnyOrder("간호사", "응급구조사");
        }

        @Test
        @DisplayName("이미 프로필이 있으면 예외가 발생한다")
        void 기존프로필있으면_예외발생() {
            // given
            Long existingAuthId = 1L; // data.sql 기준: 이미 프로필 존재
            var request = createHelperProfileRequest();

            // expect
            assertThatThrownBy(() -> helperFacadeService.createHelperProfile(existingAuthId, request))
                .isInstanceOf(HelperProfileAlreadyCreatedException.class);
        }
    }

    @Nested
    @DisplayName("도우미 프로필 수정(updateHelperProfile)")
    class UpdateHelperProfile {

        @Test
        @DisplayName("정상 수정 시 값이 반영된다(소개/지역/강점/프로필이미지/자격증 대체)")
        void 정상수정시_값반영() {
            // given
            Long helperProfileId = 1L;
            var request = createHelperProfileRequest(); // 베이스
            // 수정 내용 덮어쓰기
            ReflectionTestUtils.setField(request, "shortBio", "수정된 소개글");
            ReflectionTestUtils.setField(request, "area", "부산"); // Area.BUSAN
            ReflectionTestUtils.setField(request, "strengthList", List.of("수정된 강점1", "수정된 강점2"));
            // 새 프로필 이미지로 교체
            ReflectionTestUtils.setField(request, "profileImageCreateRequest",
                image("uploads/helpers/new-profile.jpg", "image/jpeg", 321_000L, "\"etag-new-profile\""));

            // 자격증은 1개로 대체
            var only = new CertificateCreateRequest();
            ReflectionTestUtils.setField(only, "type", "요양보호사");
            ReflectionTestUtils.setField(only, "certificateImageCreateRequest",
                image("uploads/certs/cert-new.jpg", "image/jpeg", 77_777L, "\"etag-cert-new\""));
            ReflectionTestUtils.setField(request, "certificateInfoList", List.of(only));

            // when
            helperFacadeService.updateHelperProfile(helperProfileId, request);
            em.flush();
            em.clear();

            // then
            var updated = helperService.getHelperProfileById(helperProfileId);
            assertThat(updated.getShortBio()).isEqualTo("수정된 소개글");
            assertThat(updated.getArea()).isEqualTo(Area.BUSAN);
            assertThat(JsonUtils.fromJson(updated.getStrength(), List.class))
                .containsExactlyInAnyOrder("수정된 강점1", "수정된 강점2");
            assertThat(updated.getHelperProfileImage().getImageMeta().getContentType()).isEqualTo("image/jpeg");

            var certTypes = certificateService.getCertificateTypesByHelperProfileId(helperProfileId);
            assertThat(certTypes).containsExactly("요양보호사"); // 기존 것은 삭제되고 1개로 대체
        }

        @Test
        @DisplayName("존재하지 않는 ID면 예외가 발생한다")
        void 존재하지않는ID면_예외발생() {
            Long invalidId = 999L;
            var request = createHelperProfileRequest();

            assertThatThrownBy(() -> helperFacadeService.updateHelperProfile(invalidId, request))
                .isInstanceOf(HelperProfileNotFoundException.class);
        }

        @Test
        @DisplayName("유효하지 않은 지역이면 예외가 발생한다")
        void 지역값유효하지않으면_예외발생() {
            Long helperProfileId = 1L;
            var request = createHelperProfileRequest();
            ReflectionTestUtils.setField(request, "area", "유효하지 않은 지역");

            assertThatThrownBy(() -> helperFacadeService.updateHelperProfile(helperProfileId, request))
                .isInstanceOf(HelperProfileAreaInvalidException.class);
        }

        @Test
        @DisplayName("자격증 목록을 null로 주면 기존 자격증은 유지된다")
        void 자격증목록_null이면_기존자격증유지() {
            // given
            Long helperProfileId = 1L;
            var beforeTypes = certificateService.getCertificateTypesByHelperProfileId(helperProfileId);
            // null 로 설정하면 deleteAll 이 호출되지 않음
            var request = createHelperProfileRequest();
            ReflectionTestUtils.setField(request, "certificateInfoList", null);

            // when
            helperFacadeService.updateHelperProfile(helperProfileId, request);
            em.flush();
            em.clear();

            // then
            var afterTypes = certificateService.getCertificateTypesByHelperProfileId(helperProfileId);
            assertThat(afterTypes).containsExactlyInAnyOrderElementsOf(beforeTypes);
        }
    }

    @Nested
    @DisplayName("도우미 프로필 존재 여부 확인")
    class CheckHelperProfileExistence {

        @Test
        @DisplayName("프로필이 존재하면 true와 ID를 반환한다")
        void 존재하면_true와ID반환() {
            var response = helperService.checkHelperProfileExistence(1L);

            assertThat(response.isHasProfile()).isTrue();
            assertThat(response.getHelperProfileId()).isEqualTo(1L);
        }

        @Test
        @DisplayName("프로필이 없으면 false와 null을 반환한다")
        void 존재하지않으면_false와null반환() {
            var response = helperService.checkHelperProfileExistence(6L);

            assertThat(response.isHasProfile()).isFalse();
            assertThat(response.getHelperProfileId()).isNull();
        }
    }

    private HelperProfileCreateRequest createHelperProfileRequest() {
        // 자격증 1
        var cert1 = new CertificateCreateRequest();
        ReflectionTestUtils.setField(cert1, "type", "간호사");
        ReflectionTestUtils.setField(cert1, "certificateImageCreateRequest",
            image("uploads/certs/cert1.jpg", "image/jpeg", 123_456L, "\"etag-cert1\""));

        // 자격증 2
        var cert2 = new CertificateCreateRequest();
        ReflectionTestUtils.setField(cert2, "type", "응급구조사");
        ReflectionTestUtils.setField(cert2, "certificateImageCreateRequest",
            image("uploads/certs/cert2.jpg", "image/jpeg", 234_567L, "\"etag-cert2\""));

        var req = new HelperProfileCreateRequest();
        ReflectionTestUtils.setField(req, "profileImageCreateRequest",
            image("uploads/helpers/profile.png", "image/png", 99_999L, "\"etag-profile\""));
        ReflectionTestUtils.setField(req, "strengthList",
            List.of("안전한 부축으로 편안한 이동", "인지 장애 어르신 맞춤 케어"));
        ReflectionTestUtils.setField(req, "shortBio", "부모님처럼 모시겠습니다!");
        ReflectionTestUtils.setField(req, "area", "서울"); // Area.SEOUL
        ReflectionTestUtils.setField(req, "certificateInfoList", List.of(cert1, cert2));

        return req;
    }

    private ImageCreateRequest image(String s3Key, String contentType, long size, String checksum) {
        var dto = new ImageCreateRequest();
        ReflectionTestUtils.setField(dto, "s3Key", s3Key);
        ReflectionTestUtils.setField(dto, "contentType", contentType);
        ReflectionTestUtils.setField(dto, "size", size);
        ReflectionTestUtils.setField(dto, "checksum", checksum);
        return dto;
    }
}
