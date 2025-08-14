package com.todoc.server.domain.escort.service;

import com.todoc.server.common.enumeration.ApplicationStatus;
import com.todoc.server.common.enumeration.Gender;
import com.todoc.server.common.enumeration.RecruitStatus;
import com.todoc.server.common.util.ImageUrlUtils;
import com.todoc.server.domain.customer.entity.Patient;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.exception.RecruitInvalidCancelException;
import com.todoc.server.domain.escort.exception.RecruitNotFoundException;
import com.todoc.server.domain.escort.repository.RecruitJpaRepository;
import com.todoc.server.domain.escort.repository.RecruitQueryRepository;
import com.todoc.server.domain.escort.repository.dto.RecruitHistoryDetailFlatDto;
import com.todoc.server.domain.escort.web.dto.response.*;
import com.todoc.server.domain.image.entity.ImageFile;
import com.todoc.server.domain.image.entity.ImageMeta;
import com.todoc.server.domain.route.entity.LocationInfo;
import java.util.ArrayList;
import java.util.Map;
import org.assertj.core.api.Assertions;
import com.todoc.server.domain.route.entity.Route;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
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
        RecruitSimpleResponse inProgress1 = new RecruitSimpleResponse(1L,1L, "동행중", 2L, LocalDate.of(2024, 6, 3), LocalTime.NOON, LocalTime.MIDNIGHT, "서울역", "병원A", 10000, true, false, false, true);
        RecruitSimpleResponse inProgress2 = new RecruitSimpleResponse(1L, 2L, "동행중", 2L, LocalDate.of(2024, 6, 1), LocalTime.NOON, LocalTime.MIDNIGHT, "서울역", "병원A", 10000, true, false, false, true);
        RecruitSimpleResponse inProgress3 = new RecruitSimpleResponse(2L, null, "매칭중", 3L, LocalDate.of(2024, 6, 2), LocalTime.NOON, LocalTime.MIDNIGHT, "학동역", "병원B", 10000, true, false, false, true);
        RecruitSimpleResponse done1 = new RecruitSimpleResponse(3L, null, "동행완료", 2L, LocalDate.of(2024, 5, 30), LocalTime.NOON, LocalTime.MIDNIGHT, "서울역", "병원C", 10000, true, false, false, true);
        RecruitSimpleResponse done2 = new RecruitSimpleResponse(4L, null, "동행완료", 1L, LocalDate.of(2024, 6, 4), LocalTime.NOON, LocalTime.MIDNIGHT, "학동역", "병원D", 10000, true, false, false, true);

        List<RecruitSimpleResponse> mockList = Arrays.asList(inProgress2, done1, inProgress1, done2, inProgress3);

        when(recruitQueryRepository.findListByUserId(userId)).thenReturn(mockList);

        // when
        RecruitListResponse result = recruitService.getRecruitListAsCustomerByUserId(userId);

        // then
        assertEquals(3, result.getInProgressList().size());
        assertEquals(2, result.getCompletedList().size());

        // 진행중인 목록: IN_PROGRESS가 최상단, 날짜 오름차순
        assertEquals("동행중", result.getInProgressList().get(0).getStatus());
        assertTrue(result.getInProgressList().get(0).getEscortDate().isBefore(result.getInProgressList().get(1).getEscortDate()));

        // 완료된 목록: 날짜 내림차순
        assertEquals("동행완료", result.getCompletedList().get(0).getStatus());
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
    void getRecruitHistoryListByUserId_정상조회() {
        // given
        Long userId = 1L;
        List<RecruitHistorySimpleResponse> mockList = Arrays.asList(
                mock(RecruitHistorySimpleResponse.class),
                mock(RecruitHistorySimpleResponse.class)
        );
        when(recruitQueryRepository.findRecruitListSortedByUserId(userId, 5)).thenReturn(mockList);

        // when
        RecruitHistoryListResponse result = recruitService.getRecruitHistoryListByUserId(userId);

        // then
        Assertions.assertThat(result.getBeforeList()).hasSize(2);
    }

    @Test
    void getRecruitHistoryDetailByRecruitId_정상조회() {
        // given
        Long recruitId = 10L;
        RecruitHistoryDetailFlatDto flatDto = mock(RecruitHistoryDetailFlatDto.class);
        Patient patient = mock(Patient.class);

        when(recruitQueryRepository.getRecruitHistoryDetailByRecruitId(recruitId)).thenReturn(flatDto);
        when(flatDto.getPatient()).thenReturn(patient);
        when(flatDto.getMeetingLocation()).thenReturn(mock(LocationInfo.class));
        when(flatDto.getDestination()).thenReturn(mock(LocationInfo.class));
        when(flatDto.getReturnLocation()).thenReturn(mock(LocationInfo.class));

        // 환자 필드 스텁
        when(patient.getName()).thenReturn("홍길동");
        when(patient.getContact()).thenReturn("010-1234-5678");
        when(patient.getGender()).thenReturn(Gender.MALE);
        when(patient.getCognitiveIssueDetail()).thenReturn("[]");

        // 이미지 스텁 (핵심)
        ImageFile img = mock(ImageFile.class);
        ImageMeta imageMeta = mock(ImageMeta.class);
        when(img.getId()).thenReturn(3001L);
        when(patient.getPatientProfileImage()).thenReturn(img);
        when(img.getImageMeta()).thenReturn(imageMeta);

        try (MockedStatic<ImageUrlUtils> urlMock = mockStatic(ImageUrlUtils.class)) {
            urlMock.when(() -> ImageUrlUtils.getImageUrl(3001L))
                    .thenReturn("http://image.test/patient-3001.jpg");

            // when
            RecruitHistoryDetailResponse result = recruitService.getRecruitHistoryDetailByRecruitId(recruitId);

            // then
            assertNotNull(result);
            assertNotNull(result.getPatientDetail());
            assertNotNull(result.getMeetingLocationDetail());
            assertNotNull(result.getDestinationDetail());
            assertNotNull(result.getReturnLocationDetail());
            assertThat(result.getPatientDetail().getImageUrl()).isEqualTo("http://image.test/patient-3001.jpg");
        }
    }

    @Test
    void getRecruitHistoryDetailByRecruitId_존재하지않는경우_예외() {
        // given
        Long recruitId = 999L;
        when(recruitQueryRepository.getRecruitHistoryDetailByRecruitId(recruitId)).thenReturn(null);

        // when & then
        assertThrows(RecruitNotFoundException.class, () -> {
            recruitService.getRecruitHistoryDetailByRecruitId(recruitId);
        });
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

    @Test
    @DisplayName("도우미 입장에서 동행 신청 목록 조회 - 진행중인 목록과 완료된 목록 분리 및 정렬")
    void getRecruitListAsHelperByUserId_정상_분리_정렬() {
        // given
        Long helperUserId = 7L;

        RecruitSimpleResponse r1 = new RecruitSimpleResponse(1L, 1L, "동행중", 2L, LocalDate.of(2024, 6, 3), LocalTime.NOON, LocalTime.MIDNIGHT, "서울역", "병원A", 10000, true, false, false, true);
        RecruitSimpleResponse r2 = new RecruitSimpleResponse(2L, null, "매칭중", 3L, LocalDate.of(2024, 6, 4), LocalTime.NOON, LocalTime.MIDNIGHT, "학동역", "병원B", 10000, true, false, false, true);
        RecruitSimpleResponse r3 = new RecruitSimpleResponse(3L, 3L, "매칭완료", 4L, LocalDate.of(2024, 6, 2), LocalTime.NOON, LocalTime.MIDNIGHT, "시청역", "병원C", 10000, true, false, false, true);
        RecruitSimpleResponse r4 = new RecruitSimpleResponse(4L, 4L, "동행완료", 5L, LocalDate.of(2024, 6, 4), LocalTime.NOON, LocalTime.MIDNIGHT, "강남역", "병원D", 10000, true, false, false, true);
        RecruitSimpleResponse r5 = new RecruitSimpleResponse(5L, 5L, "동행완료", 6L, LocalDate.of(2024, 5, 30), LocalTime.NOON, LocalTime.MIDNIGHT, "교대역", "병원E", 10000, true, false, false, true);

        when(recruitQueryRepository.findListByHelperUserIdAndApplicationStatus(
            eq(helperUserId), eq(List.of(ApplicationStatus.MATCHED, ApplicationStatus.PENDING))))
            .thenReturn(List.of(r1, r2, r3, r4, r5));

        // when
        RecruitListResponse result = recruitService.getRecruitListAsHelperByUserId(helperUserId);

        // then
        assertEquals(3, result.getInProgressList().size()); // MATCHING(매칭중) 1 + COMPLETED(매칭완료) 1 + IN_PROGRESS(동행중) 1
        assertEquals(2, result.getCompletedList().size());  // DONE 2

        // 진행중 목록
        List<RecruitSimpleResponse> inProgress = result.getInProgressList();

        assertEquals(1L, inProgress.get(0).getRecruitId());  // r1 (동행중이므로 첫번째로 와야함)
        assertEquals("동행중", inProgress.get(0).getStatus());
        assertEquals(LocalDate.of(2024, 6, 3), inProgress.get(0).getEscortDate());

        assertEquals(3L, inProgress.get(1).getRecruitId()); // r3 (매칭중/매칭완료 상태의 경우 동행일 기준 오름차순이므로 r3가 두번째로 와야함)
        assertEquals("매칭완료", inProgress.get(1).getStatus());
        assertEquals(LocalDate.of(2024, 6, 2), inProgress.get(1).getEscortDate());

        assertEquals(2L, inProgress.get(2).getRecruitId()); // r2 (동행중 상태가 아님, 동행일 기준 오름차순이므로 마지막에 와야함)
        assertEquals("매칭중", inProgress.get(2).getStatus());
        assertEquals(LocalDate.of(2024, 6, 4), inProgress.get(2).getEscortDate());

        // 완료 목록
        List<RecruitSimpleResponse> completed = result.getCompletedList();

        assertEquals(4L, completed.get(0).getRecruitId());  // r4 (최신순으로 와야 하므로)
        assertEquals(5L, completed.get(1).getRecruitId());  // r5
    }

    @Test
    @DisplayName("검색 - 지역/날짜로 조회 후 escortDate 오름차순 정렬 및 DTO 매핑")
    void getRecruitListBySearch_정상조회_정렬_매핑() {
        // given
        String area = "서울";
        LocalDate d1 = LocalDate.of(2024, 6, 1);
        LocalDate d2 = LocalDate.of(2024, 6, 2);

        LocationInfo meet = LocationInfo.builder().placeName("만남장소").upperAddrName(area).build();
        LocationInfo hosp = LocationInfo.builder().placeName("병원A").upperAddrName(area).build();
        Route route = Route.builder().meetingLocationInfo(meet).hospitalLocationInfo(hosp).build();

        Patient p = Patient.builder().needsHelping(true).usesWheelchair(false)
            .hasCognitiveIssue(false).hasCommunicationIssue(true).build();

        Recruit r1 = Recruit.builder().id(1L).status(RecruitStatus.MATCHING).escortDate(d2).estimatedMeetingTime(LocalTime.of(9, 30)).estimatedReturnTime(LocalTime.of(11, 30)).estimatedFee(75000).route(route).patient(p).build();

        Recruit r2 = Recruit.builder().id(2L).status(RecruitStatus.MATCHING).escortDate(d1).estimatedMeetingTime(LocalTime.of(10, 0)).estimatedReturnTime(LocalTime.of(12, 0)).estimatedFee(123000).route(route).patient(p).build();

        Recruit r3 = Recruit.builder().id(3L).status(RecruitStatus.MATCHING).escortDate(d2).estimatedMeetingTime(LocalTime.of(14, 0)).estimatedReturnTime(LocalTime.of(16, 0)).estimatedFee(98000).route(route).patient(p).build();

        when(recruitQueryRepository.findListByDateRangeAndStatus(
            eq(area), eq(d1), eq(d2), eq(List.of(RecruitStatus.MATCHING))
        )).thenReturn(List.of(r1, r3, r2));  // 섞어서 반환


        // when
        RecruitSearchListResponse res = recruitService.getRecruitListBySearch(area, d1, d2);


        // then
        Map<LocalDate, List<RecruitSimpleResponse>> map = res.getInProgressMap();

        assertEquals(2, map.size());  // 날짜가 2종류 뿐이므로

        List<LocalDate> keys = new ArrayList<>(map.keySet());
        assertEquals(d1, keys.get(0));  // 키 순서: d1 -> d2 (서비스에서 escortDate 오름차순 정렬 후 그룹핑)
        assertEquals(d2, keys.get(1));

        // d1 그룹 검증
        List<RecruitSimpleResponse> g1 = map.get(d1);
        assertEquals(1, g1.size());
        RecruitSimpleResponse day1Item = g1.get(0);  // 2024-06-01에 해당하는 RecruitSimpleResponse
        assertEquals(2L, day1Item.getRecruitId());
        assertEquals("만남장소", day1Item.getDepartureLocation());
        assertEquals("병원A", day1Item.getDestination());
        assertEquals(123000, day1Item.getEstimatedPayment());

        List<RecruitSimpleResponse> g2 = map.get(d2);
        assertEquals(2, g2.size());
    }
}