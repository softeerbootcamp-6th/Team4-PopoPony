package com.todoc.server.domain.escort.service;

import com.todoc.server.common.enumeration.RecruitStatus;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.exception.RecruitInvalidCancelException;
import com.todoc.server.domain.escort.exception.RecruitNotFoundException;
import com.todoc.server.domain.escort.repository.RecruitJpaRepository;
import com.todoc.server.domain.escort.repository.RecruitQueryRepository;
import com.todoc.server.domain.escort.web.dto.response.RecruitDetailResponse;
import com.todoc.server.domain.escort.web.dto.response.RecruitListResponse;
import com.todoc.server.domain.escort.web.dto.response.RecruitSimpleResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

class RecruitServiceTest {

    @Mock
    private RecruitJpaRepository recruitJpaRepository;

    @Mock
    private RecruitQueryRepository recruitQueryRepository;

    @InjectMocks
    private RecruitService recruitService;

    public RecruitServiceTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("고객 입장에서 동행 신청 목록 조회 - 진행중인 목록과 완료된 목록 분리 및 정렬")
    public void getRecruitListAsCustomerByUserId_ShouldReturnSortedRecruitList() {
        // given
        Long userId = 1L;
        RecruitSimpleResponse inProgress1 = new RecruitSimpleResponse(1L,1L, RecruitStatus.IN_PROGRESS, 2L, LocalDate.of(2024, 6, 3), LocalTime.NOON, LocalTime.MIDNIGHT, "서울역", "병원A");
        RecruitSimpleResponse inProgress2 = new RecruitSimpleResponse(1L, 2L, RecruitStatus.IN_PROGRESS, 2L, LocalDate.of(2024, 6, 1), LocalTime.NOON, LocalTime.MIDNIGHT, "서울역", "병원A");
        RecruitSimpleResponse inProgress3 = new RecruitSimpleResponse(2L, null, RecruitStatus.MATCHING, 3L, LocalDate.of(2024, 6, 2), LocalTime.NOON, LocalTime.MIDNIGHT, "학동역", "병원B");
        RecruitSimpleResponse done1 = new RecruitSimpleResponse(3L, null, RecruitStatus.DONE, 2L, LocalDate.of(2024, 5, 30), LocalTime.NOON, LocalTime.MIDNIGHT, "서울역", "병원C");
        RecruitSimpleResponse done2 = new RecruitSimpleResponse(4L, null, RecruitStatus.DONE, 1L, LocalDate.of(2024, 6, 4), LocalTime.NOON, LocalTime.MIDNIGHT, "학동역", "병원D");

        List<RecruitSimpleResponse> mockList = Arrays.asList(inProgress2, done1, inProgress1, done2, inProgress3);

        when(recruitQueryRepository.findListByUserId(userId)).thenReturn(mockList);

        // when
        RecruitListResponse result = recruitService.getRecruitListAsCustomerByUserId(userId);

        // then
        assertEquals(3, result.getInProgressList().size());
        assertEquals(2, result.getCompletedList().size());

        // 진행중인 목록: IN_PROGRESS가 최상단, 날짜 오름차순
        assertEquals(RecruitStatus.IN_PROGRESS, result.getInProgressList().get(0).getStatus());
        assertTrue(result.getInProgressList().get(0).getEscortDate().isBefore(result.getInProgressList().get(1).getEscortDate()));

        // 완료된 목록: 날짜 내림차순
        assertEquals(RecruitStatus.DONE, result.getCompletedList().get(0).getStatus());
        assertTrue(result.getCompletedList().get(0).getEscortDate().isAfter(result.getCompletedList().get(1).getEscortDate()));
    }

    @Test
    @DisplayName("recruitId로 취소 실패 - 이미 매칭된 동행 신청")
    void cancelRecruit_notMatching_shouldThrowException() {
        // given
        Long recruitId = 2L;
        Recruit recruit = new Recruit();
        recruit.setStatus(RecruitStatus.DONE);  // 이미 매칭된 상태

        when(recruitJpaRepository.findById(recruitId)).thenReturn(Optional.of(recruit));

        // when & then
        assertThrows(RecruitInvalidCancelException.class, () -> recruitService.cancelRecruit(recruitId));
    }

    @Test
    @DisplayName("recruitId로 취소 실패 - 동행 신청이 존재하지 않음")
    void cancelRecruit_notFound_shouldThrowException() {
        // given
        Long recruitId = 999L;
        when(recruitJpaRepository.findById(recruitId)).thenReturn(Optional.empty());

        // when & then
        assertThrows(RecruitNotFoundException.class, () -> recruitService.cancelRecruit(recruitId));
    }

    @Test
    void findById_존재하는_경우() {
        // given
        Recruit recruit = Recruit.builder().id(1L).status(RecruitStatus.MATCHING).build();
        given(recruitJpaRepository.findById(1L)).willReturn(Optional.of(recruit));

        // when
        Recruit result = recruitService.findById(1L);

        // then
        assertThat(result.getId()).isEqualTo(1L);
    }

    @Test
    void findById_존재하지_않는_경우() {
        // given
        given(recruitJpaRepository.findById(1L)).willReturn(Optional.empty());

        // then
        assertThatThrownBy(() -> recruitService.findById(1L))
                .isInstanceOf(RecruitNotFoundException.class);
    }

    @Test
    void cancelRecruit_정상_취소() {
        // given
        Recruit recruit = Recruit.builder().id(1L).status(RecruitStatus.MATCHING).build();
        given(recruitJpaRepository.findById(1L)).willReturn(Optional.of(recruit));

        // when
        recruitService.cancelRecruit(1L);

        // then
        assertThat(recruit.isDeleted()).isTrue();
    }

    @Test
    void cancelRecruit_이미_매칭이_완료된_경우() {
        // given
        Recruit recruit = Recruit.builder()
                .id(1L)
                .status(RecruitStatus.IN_PROGRESS)
                .build();
        given(recruitJpaRepository.findById(1L)).willReturn(Optional.of(recruit));

        // then
        assertThatThrownBy(() -> recruitService.cancelRecruit(1L))
                .isInstanceOf(RecruitInvalidCancelException.class);
    }

    @Test
    void getRecruitDetailByRecruitId_정상_조회() {
        // given
        Long recruitId = 1L;
        RecruitDetailResponse mockDetail = RecruitDetailResponse.builder()
                .recruitId(recruitId)
                .escortDate(LocalDate.now())
                .purpose("진료")
                .build();

        given(recruitQueryRepository.getRecruitDetailByRecruitId(recruitId)).willReturn(mockDetail);

        // when
        RecruitDetailResponse result = recruitService.getRecruitDetailByRecruitId(recruitId);

        // then
        assertThat(result.getRecruitId()).isEqualTo(recruitId);
        assertThat(result.getPurpose()).isEqualTo("진료");
    }
}