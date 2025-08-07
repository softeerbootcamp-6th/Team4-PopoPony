package com.todoc.server.domain.helper.service;

import com.querydsl.core.Tuple;
import com.todoc.server.common.enumeration.Gender;
import com.todoc.server.domain.helper.repository.HelperQueryRepository;
import com.todoc.server.domain.helper.web.dto.response.HelperSimpleResponse;
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

    @Mock
    private HelperQueryRepository helperQueryRepository;

    @InjectMocks
    private HelperService helperService;

    @Mock
    private Tuple tuple1;

    @Mock
    private Tuple tuple2;

    private final Long helperProfileId = 123L;

    @BeforeEach
    void setUp() {
        when(tuple1.get(auth.name)).thenReturn("홍길동");
        when(tuple1.get(auth.birthDate)).thenReturn(LocalDate.of(1990, 1, 1));
        when(tuple1.get(auth.gender)).thenReturn(Gender.MALE);
        when(tuple1.get(auth.contact)).thenReturn("010-1111-2222");

        when(tuple1.get(helperProfile.id)).thenReturn(helperProfileId);
        when(tuple1.get(helperProfile.imageUrl)).thenReturn("http://image.com/photo.jpg");
        when(tuple1.get(helperProfile.shortBio)).thenReturn("도우미 소개입니다");
        when(tuple1.get(helperProfile.strength)).thenReturn("[\"친절함\", \"정확함\"]");

        when(tuple1.get(certificate.type)).thenReturn("간호조무사");
        when(tuple2.get(certificate.type)).thenReturn("응급처치");
    }

    @Test
    @DisplayName("도우미 프로필 ID로 튜플이 존재하면 HelperSimpleResponse 반환")
    void getHelperSimpleByHelperProfileId_shouldReturnResponse_whenExists() {
        // given
        List<Tuple> tuples = List.of(tuple1, tuple2);
        when(helperQueryRepository.getHelperSimpleByHelperProfileId(helperProfileId))
                .thenReturn(tuples);

        // when
        HelperSimpleResponse response = helperService.getHelperSimpleByHelperProfileId(helperProfileId);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getName()).isEqualTo("홍길동");
        assertThat(response.getAge()).isGreaterThan(30);
        assertThat(response.getStrengthList()).contains("친절함", "정확함");
        assertThat(response.getCertificateList()).containsExactlyInAnyOrder("간호조무사", "응급처치");
        assertThat(response.getShortBio()).isEqualTo("도우미 소개입니다");
    }

    @Test
    @DisplayName("buildHelperSimpleByHelper는 튜플로부터 정확한 요약 응답을 생성한다")
    void buildHelperSimpleByHelper_shouldBuildResponseCorrectly() {
        // given
        List<Tuple> tuples = List.of(tuple1, tuple2);

        // when
        HelperSimpleResponse result = helperService.buildHelperSimpleByHelperProfileId(tuples);

        // then
        assertThat(result.getName()).isEqualTo("홍길동");
        assertThat(result.getCertificateList()).containsExactlyInAnyOrder("간호조무사", "응급처치");
    }
}