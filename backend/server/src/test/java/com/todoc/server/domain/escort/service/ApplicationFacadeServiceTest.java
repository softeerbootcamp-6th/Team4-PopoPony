package com.todoc.server.domain.escort.service;

import com.querydsl.core.Tuple;
import com.todoc.server.domain.escort.web.dto.response.ApplicationListResponse;
import com.todoc.server.domain.escort.web.dto.response.ApplicationSimpleResponse;
import com.todoc.server.domain.helper.service.HelperService;
import com.todoc.server.domain.helper.web.dto.response.HelperSimpleResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApplicationFacadeServiceTest {

    @Mock
    private ApplicationService applicationService;

    @Mock
    private HelperService helperService;

    @InjectMocks
    private ApplicationFacadeService facadeService;

    private Long recruitId;
    private Long applicationId;

    private List<Tuple> mockTuples;
    private HelperSimpleResponse mockHelperResponse;

    @BeforeEach
    void setUp() {
        recruitId = 1L;
        applicationId = 100L;

        // mockTuples는 실제 Tuple 대신 mock 객체 사용
        Tuple mockTuple = mock(Tuple.class);
        mockTuples = List.of(mockTuple);

        mockHelperResponse = HelperSimpleResponse.builder()
                .name("헬퍼 이름")
                .age(30)
                .gender(null)
                .certificateList(List.of("자격증1"))
                .strengthList(List.of("강점"))
                .shortBio("소개글")
                .imageUrl("img.jpg")
                .contact("010-1234-5678")
                .helperProfileId(999L)
                .build();
    }

    @Test
    @DisplayName("튜플로 ApplicationListResponse 조립하기")
    void getApplicationListByRecruitId() {
        // given
        when(applicationService.getApplicationListByRecruitId(recruitId))
                .thenReturn(Map.of(applicationId, mockTuples));

        when(helperService.buildHelperSimpleByHelperProfileId(mockTuples))
                .thenReturn(mockHelperResponse);

        // when
        ApplicationListResponse response = facadeService.getApplicationListByRecruitId(recruitId);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getApplicationList()).hasSize(1);

        ApplicationSimpleResponse item = response.getApplicationList().get(0);
        assertThat(item.getApplicationId()).isEqualTo(applicationId);
        assertThat(item.getHelper()).isEqualTo(mockHelperResponse);

        verify(applicationService).getApplicationListByRecruitId(recruitId);
        verify(helperService).buildHelperSimpleByHelperProfileId(mockTuples);
    }
}