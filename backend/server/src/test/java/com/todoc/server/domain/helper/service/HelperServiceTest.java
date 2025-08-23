package com.todoc.server.domain.helper.service;

import com.querydsl.core.Tuple;
import com.todoc.server.common.enumeration.Gender;
import com.todoc.server.domain.escort.repository.dto.ApplicationFlatDto;
import com.todoc.server.domain.helper.entity.HelperProfile;
import com.todoc.server.domain.helper.repository.HelperJpaRepository;
import com.todoc.server.domain.helper.repository.HelperQueryRepository;
import com.todoc.server.domain.helper.repository.dto.HelperSimpleFlatDto;
import com.todoc.server.domain.helper.web.dto.response.HelperProfileExistenceResponse;
import com.todoc.server.domain.helper.web.dto.response.HelperSimpleResponse;
import com.todoc.server.domain.image.entity.ImageFile;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;

import static com.todoc.server.domain.auth.entity.QAuth.auth;
import static com.todoc.server.domain.helper.entity.QCertificate.certificate;
import static com.todoc.server.domain.helper.entity.QHelperProfile.helperProfile;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HelperServiceTest {

    @Mock private HelperQueryRepository helperQueryRepository;
    @Mock private HelperJpaRepository helperJpaRepository;

    @InjectMocks
    private HelperService helperService;

    private final Long helperProfileId = 123L;

    @Test
    @DisplayName("도우미 프로필 ID로 조회 시 ApplicationFlatDto 리스트를 기반으로 HelperSimpleResponse 반환")
    void getHelperSimpleByHelperProfileId_shouldReturnResponse_whenExists() {
        // given
        ImageFile imageFile = mock(ImageFile.class);
        when(imageFile.getId()).thenReturn(999L);

        HelperSimpleFlatDto dto1 = new HelperSimpleFlatDto(
                helperProfileId, imageFile,
            "[\"안전한 부축\"]", "도우미 소개입니다", 10L, "홍길동", LocalDate.of(1990, 1, 1), Gender.MALE,
                "010-1111-2222", "간호조무사"
        );

        HelperSimpleFlatDto dto2 = new HelperSimpleFlatDto(
                helperProfileId, imageFile,
            "[\"안전한 부축\"]", "도우미 소개입니다", 10L, "김옥순", LocalDate.of(1990, 1, 1), Gender.FEMALE,
                "010-1111-2222", "간호조무사"
        );

        when(helperQueryRepository.getHelperSimpleByHelperProfileId(helperProfileId))
                .thenReturn(List.of(dto1, dto2));

        // when
        HelperSimpleResponse response = helperService.getHelperSimpleByHelperProfileId(helperProfileId);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getName()).isEqualTo("홍길동");
        assertThat(response.getAge()).isGreaterThan(30);
        assertThat(response.getStrengthList()).contains("안전한 부축");
        assertThat(response.getCertificateList()).containsExactlyInAnyOrder("간호조무사");
        assertThat(response.getShortBio()).isEqualTo("도우미 소개입니다");
        assertThat(response.getImageUrl()).isEqualTo("/api/images/999/presigned");
    }

    @Test
    @DisplayName("도우미 프로필이 존재하는지 확인하고 HelperProfileExistenceResponse를 반환")
    void checkHelperProfileExistence() {
        // given
        Long authIdWithProfile = 1L;  // 존재하는 경우
        HelperProfile mockProfileWithProfile = HelperProfile.builder()
                .id(100L)
                .build();
        when(helperJpaRepository.findByAuthId(authIdWithProfile))
                .thenReturn(Optional.of(mockProfileWithProfile));

        Long authIdWithoutProfile = 2L;  // 존재하지 않는 경우
        when(helperJpaRepository.findByAuthId(authIdWithoutProfile))
                .thenReturn(Optional.empty());

        // when
        var responseExist = helperService.checkHelperProfileExistence(authIdWithProfile);
        var responseNoExist = helperService.checkHelperProfileExistence(authIdWithoutProfile);

        // then
        assertThat(responseExist.isHasProfile()).isTrue();
        assertThat(responseExist.getHelperProfileId()).isEqualTo(100L);

        assertThat(responseNoExist.isHasProfile()).isFalse();
        assertThat(responseNoExist.getHelperProfileId()).isNull();
    }
}