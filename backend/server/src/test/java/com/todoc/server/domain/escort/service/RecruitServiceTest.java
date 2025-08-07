package com.todoc.server.domain.escort.service;

import com.todoc.server.common.enumeration.RecruitStatus;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.exception.RecruitInvalidCancelException;
import com.todoc.server.domain.escort.exception.RecruitNotFoundException;
import com.todoc.server.domain.escort.repository.RecruitJpaRepository;
import com.todoc.server.domain.escort.repository.RecruitQueryRepository;
import com.todoc.server.domain.escort.web.dto.response.RecruitListResponse;
import com.todoc.server.domain.escort.web.dto.response.RecruitPaymentResponse;
import com.todoc.server.domain.escort.web.dto.response.RecruitSimpleResponse;
import com.todoc.server.domain.route.entity.LocationInfo;
import com.todoc.server.domain.route.entity.Route;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
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
        Recruit result = recruitService.getRecruitById(1L);

        // then
        assertThat(result.getId()).isEqualTo(1L);
    }

    @Test
    void findById_존재하지_않는_경우() {
        // given
        given(recruitJpaRepository.findById(1L)).willReturn(Optional.empty());

        // then
        assertThatThrownBy(() -> recruitService.getRecruitById(1L))
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
    void getRecruitPaymentByRecruitId_정상조회() {
        // given
        LocationInfo meetingLocation = LocationInfo.builder()
                .placeName("만남장소")
                .upperAddrName("서울특별시")
                .middleAddrName("강남구")
                .roadName("테헤란로")
                .firstBuildingNo("123")
                .longitude(BigDecimal.valueOf(127.027621))
                .latitude(BigDecimal.valueOf(37.497942))
                .build();

        LocationInfo hospitalLocation = LocationInfo.builder()
                .placeName("병원")
                .upperAddrName("서울특별시")
                .middleAddrName("서초구")
                .roadName("반포대로")
                .firstBuildingNo("321")
                .longitude(BigDecimal.valueOf(127.015112))
                .latitude(BigDecimal.valueOf(37.504406))
                .build();

        LocationInfo returnLocation = LocationInfo.builder()
                .placeName("귀가장소")
                .upperAddrName("서울특별시")
                .middleAddrName("송파구")
                .roadName("올림픽로")
                .firstBuildingNo("456")
                .longitude(BigDecimal.valueOf(127.100095))
                .latitude(BigDecimal.valueOf(37.515702))
                .build();

        Route route = Route.builder()
                .meetingLocationInfo(meetingLocation)
                .hospitalLocationInfo(hospitalLocation)
                .returnLocationInfo(returnLocation)
                .build();

        Recruit recruit = Recruit.builder()
                .id(10L)
                .route(route)
                .estimatedMeetingTime(LocalTime.of(10, 0))
                .estimatedReturnTime(LocalTime.of(15, 0))
                .build();

        when(recruitQueryRepository.getRecruitWithRouteByRecruitId(10L)).thenReturn(recruit);

        // when
        RecruitPaymentResponse response = recruitService.getRecruitPaymentByRecruitId(10L);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getRecruitId()).isEqualTo(10L);
        assertThat(response.getRoute()).isNotNull();
        assertThat(response.getBaseFee()).isEqualTo(53000);
        assertThat(response.getExpectedTaxiFee()).isEqualTo(0);
    }

    @Test
    void getRecruitPaymentByRecruitId_리크루트없으면예외() {
        // given
        when(recruitQueryRepository.getRecruitWithRouteByRecruitId(999L)).thenReturn(null);

        // when & then
        assertThatThrownBy(() -> recruitService.getRecruitPaymentByRecruitId(999L))
                .isInstanceOf(RecruitNotFoundException.class);
    }
}