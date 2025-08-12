package com.todoc.server.domain.helper.service;

import com.todoc.server.common.enumeration.Area;
import com.todoc.server.domain.helper.entity.HelperProfile;
import com.todoc.server.domain.helper.exception.HelperProfileNotFoundException;
import com.todoc.server.domain.helper.web.dto.request.HelperProfileCreateRequest;
import com.todoc.server.domain.helper.web.dto.response.HelperDetailResponse;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.junit.jupiter.api.DisplayName;
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

@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE) // 실제 DB 사용 시
@Transactional
@ActiveProfiles("test")
@Sql("/sql/data.sql")
public class HelperIntegrationTest {

    @Autowired
    private HelperFacadeService helperFacadeService;

    @Autowired
    private HelperService helperService;

    @Autowired
    private CertificateService certificateService;

    @PersistenceContext
    private EntityManager em;

    // TODO :: 주석 해제하기
    @Test
    @DisplayName("도우미 상세 정보 조회 - 정상")
    void getHelperDetailByHelperProfileId_정상() {
        // given
        Long helperProfileId = 4L;

        // when
        HelperDetailResponse response = helperFacadeService.getHelperDetailByHelperProfileId(helperProfileId);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getHelperSimple().getName()).isEqualTo("최유진");
        assertThat(response.getReviewStat().getGoodRate()).isEqualTo(100);
        assertThat(response.getPositiveFeedbackStatList().size()).isEqualTo(3);
        assertThat(response.getLatestReviewList().getFirst().getShortComment()).isEqualTo("말벗도 되어주셔서 감사했어요.");
        assertThat(response.getLatestReviewList().getFirst().getSatisfactionLevel()).isEqualTo("좋았어요");
        assertThat(response.getEscortCount()).isEqualTo(2);
    }

    @Test
    @DisplayName("도우미 상세 정보 조회 - 존재하지 않는 도우미")
    void getHelperDetailByHelperProfileId_존재하지않는도우미() {
        // given
        Long helperProfileId = 999L;

        // when & then
        assertThatThrownBy(() -> helperFacadeService.getHelperDetailByHelperProfileId(helperProfileId))
                .isInstanceOf(HelperProfileNotFoundException.class);
    }

    @Test
    @DisplayName("도우미 프로필 등록 - 정상")
    void createHelperProfile_정상() {
        // given
        HelperProfileCreateRequest request = createHelperProfileRequest();
        int beforeCount = helperService.getAllHelperProfiles().size();

        // when
        helperFacadeService.createHelperProfile(request);

        // then
        List<HelperProfile> profiles = helperService.getAllHelperProfiles();
        int afterCount = profiles.size();
        assertThat(afterCount - beforeCount).isEqualTo(1);

        HelperProfile profile = profiles.getLast();
        assertThat(profile.getHelperProfileImage().getImageMeta().getContentType()).isEqualTo("image/png");
        assertThat(profile.getShortBio()).isEqualTo("부모님처럼 모시겠습니다!");
        assertThat(profile.getStrength()).isEqualTo("[\"안전한 부축으로 편안한 이동\",\"인지 장애 어르신 맞춤 케어\"]");
        assertThat(profile.getArea()).isEqualTo(Area.SEOUL);

        // 자격증 저장 확인
        List<String> certificateTypeList = certificateService.getCertificateTypesByHelperProfileId(profile.getId());
        assertThat(certificateTypeList).containsExactlyInAnyOrder("간호사 자격증", "응급구조사");
    }

    private HelperProfileCreateRequest createHelperProfileRequest() {
        // 자격증 1
        HelperProfileCreateRequest.CertificateInfo cert1 = new HelperProfileCreateRequest.CertificateInfo();
        ReflectionTestUtils.setField(cert1, "certificateImageCreateRequest", image(
                "uploads/certs/cert1.jpg", "image/jpeg", 123_456L, "\"etag-cert1\""
        ));
        ReflectionTestUtils.setField(cert1, "type", "간호사 자격증");

        // 자격증 2
        HelperProfileCreateRequest.CertificateInfo cert2 = new HelperProfileCreateRequest.CertificateInfo();
        ReflectionTestUtils.setField(cert2, "certificateImageCreateRequest", image(
                "uploads/certs/cert2.jpg", "image/jpeg", 234_567L, "\"etag-cert2\""
        ));
        ReflectionTestUtils.setField(cert2, "type", "응급구조사");

        HelperProfileCreateRequest request = new HelperProfileCreateRequest();
        ReflectionTestUtils.setField(request, "profileImageCreateRequest", image(
                "uploads/helpers/profile.png", "image/png", 99_999L, "\"etag-profile\""
        ));
        ReflectionTestUtils.setField(request, "strengthList",
                List.of("안전한 부축으로 편안한 이동", "인지 장애 어르신 맞춤 케어"));
        ReflectionTestUtils.setField(request, "shortBio", "부모님처럼 모시겠습니다!");
        ReflectionTestUtils.setField(request, "area", "서울"); // 서버에서 Area.from("서울") 처리
        ReflectionTestUtils.setField(request, "certificateInfoList", List.of(cert1, cert2));

        return request;
    }

    private com.todoc.server.common.dto.request.ImageCreateRequest image(
            String s3Key, String contentType, long size, String checksum
    ) {
        var dto = new com.todoc.server.common.dto.request.ImageCreateRequest();
        ReflectionTestUtils.setField(dto, "s3Key", s3Key);
        ReflectionTestUtils.setField(dto, "contentType", contentType);
        ReflectionTestUtils.setField(dto, "size", size);
        ReflectionTestUtils.setField(dto, "checksum", checksum);
        return dto;
    }
}
