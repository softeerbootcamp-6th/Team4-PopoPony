package com.todoc.server.domain.escort.web.controller;

import com.todoc.server.common.enumeration.RecruitStatus;
import com.todoc.server.common.response.Response;
import com.todoc.server.domain.customer.web.dto.response.PatientSimpleResponse;
import com.todoc.server.domain.escort.service.RecruitFacadeService;
import com.todoc.server.domain.escort.service.RecruitService;
import com.todoc.server.domain.escort.web.dto.request.RecruitCreateRequest;
import com.todoc.server.domain.escort.web.dto.response.*;
import com.todoc.server.domain.route.web.dto.response.LocationInfoSimpleResponse;
import com.todoc.server.domain.route.web.dto.response.RouteSimpleResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Tag(name = "recruits", description = "동행 신청 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/recruits")
public class RecruitController {

    private final RecruitFacadeService recruitFacadeService;
    private final RecruitService recruitService;

    @Operation(
            summary = "고객의 동행 목록 조회",
            description = "로그인한 고객이 신청한 동행 목록(진행중/완료)을 조회합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "동행 목록 조회 성공" )
    @GetMapping("/customer")
    public Response<RecruitListResponse> getRecruitListAsCustomer() {
        // TODO :: 원래라면 jwt 혹은 sessionId로부터 유저 정보를 조회해야 함
        // 현재는 우선 userId = 1로 고정

        RecruitSimpleResponse dto = RecruitSimpleResponse.builder()
                .recruitId(1L)
                .status(RecruitStatus.MATCHING)
                .numberOfApplication(3L)
                .destination("서울아산병원")
                .departureLocation("꿈에그린아파트")
                .escortDate(LocalDate.now())
                .estimatedMeetingTime(LocalTime.NOON)
                .estimatedReturnTime(LocalTime.MIDNIGHT)
                .build();

        List<RecruitSimpleResponse> list = new ArrayList<>();
        list.add(dto);
        list.add(dto);

        RecruitListResponse mock = RecruitListResponse.builder()
                .completedList(list)
                .inProgressList(list).build();

        return Response.from(mock);
    }

    @Operation(
            summary = "이전 환자(동행) 정보 목록 불러오기",
            description = "로그인한 고객이 이전에 동행했던 환자(동행) 정보 목록을 조회합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "이전 환자(동행) 정보 목록 조회 성공")
    @GetMapping("/patients")
    public Response<RecruitHistoryListResponse> getRecruitHistoryList() {
        // TODO :: 원래라면 jwt 혹은 sessionId로부터 유저 정보를 조회해야 함
        // 현재는 우선 userId = 1로 고정
        //
        // recruitService.getRecruitHistoryListByUserId(1L);

        RecruitHistorySimpleResponse dto = RecruitHistorySimpleResponse.builder()
                .recruitId(1L)
                .name("김토닥")
                .destination("서울성모병원")
                .escortDate(LocalDate.now())
                .build();

        List<RecruitHistorySimpleResponse> list = new ArrayList<>();
        for (int i=0; i<5; i++) {
            list.add(dto);
        }

        RecruitHistoryListResponse mock = RecruitHistoryListResponse.builder()
                .beforeList(list)
                .build();

        return Response.from(mock);
    }

    @Operation(
            summary = "이전 환자(동행) 기록 불러오기",
            description = "로그인한 고객이 이전에 동행했던 환자(동행)에 대한 기록을 불러옵니다.")
    @ApiResponse(
            responseCode = "200",
            description = "이전 환자(동행)에 대한 기록 조회 성공 ")
    @GetMapping("/{recruitId}/history")
    public Response<RecruitHistoryDetailResponse> getRecruitHistory(@PathVariable Long recruitId) {
        // TODO :: 원래라면 jwt 혹은 sessionId로부터 유저 정보를 조회해야 함
        // 현재는 우선 userId = 1로 고정
        // recruitService.getRecruitHistoryDetailByRecruitId(recruitId);

        RecruitHistoryDetailResponse.PatientDetail patientDetail = RecruitHistoryDetailResponse.PatientDetail.builder()
                .patientId(1L)
                .imageUrl("")
                .name("홍길동")
                .age(75)
                .gender("남자")
                .phoneNumber("010-1234-5678")
                .needsHelping(true)
                .usesWheelchair(true)
                .hasCognitiveIssue(true)
                .cognitiveIssueDetail(new ArrayList<>(List.of("판단에 도움이 필요해요")))
                .hasCommunicationIssue(true)
                .communicationIssueDetail("이가 많이 없으셔서 발음하시는 게 불편하세요")
                .build();

        RecruitHistoryDetailResponse.LocationDetail meetingLocationDetail = RecruitHistoryDetailResponse.LocationDetail.builder()
                .placeName("홍짬뽕")
                .upperAddrName("서울")
                .middleAddrName("강서구")
                .lowerAddrName("보람동")
                .firstAddrNo("123")
                .secondAddrNo("45")
                .roadName("보람로")
                .firstBuildingNo("456")
                .secondBuildingNo("5")
                .detailAddress("식당 정문")
                .longitude(BigDecimal.valueOf(127.2581225))
                .latitude(BigDecimal.valueOf(36.1234567))
                .build();

        RecruitHistoryDetailResponse.LocationDetail destinationDetail = RecruitHistoryDetailResponse.LocationDetail.builder()
                .placeName("홍짬뽕")
                .upperAddrName("서울")
                .middleAddrName("강서구")
                .lowerAddrName("보람동")
                .firstAddrNo("123")
                .secondAddrNo("45")
                .roadName("보람로")
                .firstBuildingNo("456")
                .secondBuildingNo("5")
                .detailAddress("식당 정문")
                .longitude(BigDecimal.valueOf(127.2581225))
                .latitude(BigDecimal.valueOf(36.1234567))
                .build();

        RecruitHistoryDetailResponse.LocationDetail returnLocationDetail = RecruitHistoryDetailResponse.LocationDetail.builder()
                .placeName("홍짬뽕")
                .upperAddrName("서울")
                .middleAddrName("강서구")
                .lowerAddrName("보람동")
                .firstAddrNo("123")
                .secondAddrNo("45")
                .roadName("보람로")
                .firstBuildingNo("456")
                .secondBuildingNo("5")
                .detailAddress("식당 정문")
                .longitude(BigDecimal.valueOf(127.2581225))
                .latitude(BigDecimal.valueOf(36.1234567))
                .build();

        RecruitHistoryDetailResponse mock = RecruitHistoryDetailResponse.builder()
                .patientDetail(patientDetail)
                .meetingLocationDetail(meetingLocationDetail)
                .destinationDetail(destinationDetail)
                .returnLocationDetail(returnLocationDetail)
                .build();

        return Response.from(mock);
    }

    @Operation(
            summary = "특정 동행 신청의 상세 정보 조회",
            description = "recruitId에 해당하는 동행 신청의 상세 정보를 조회합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "동행 신청 상세 정보 조회 성공")
    @GetMapping("/{recruitId}")
    public Response<RecruitDetailResponse> getRecruitDetail(@PathVariable Long recruitId) {

//        return Response.from(recruitService.getRecruitDetailByRecruitId(recruitId));

        LocationInfoSimpleResponse meetingLocationInfo = LocationInfoSimpleResponse.builder()
                .locationInfoId(1L)
                .placeName("신촌역 3번 출구")
                .address("서울특별시 서대문구 연세로 2")
                .detailAddress("출구 앞 파란 의자 근처")
                .build();

        LocationInfoSimpleResponse hospitalLocationInfo = LocationInfoSimpleResponse.builder()
                .locationInfoId(1L)
                .placeName("서울성모병원")
                .address("서울특별시 서초구 반포대로 222")
                .detailAddress("본관 3층 내과 외래")
                .build();

        LocationInfoSimpleResponse returnLocationInfo = LocationInfoSimpleResponse.builder()
                .locationInfoId(1L)
                .placeName("신촌역 3번 출구")
                .address("서울특별시 서대문구 연세로 2")
                .detailAddress("출구 앞 파란 의자 근처")
                .build();

        RouteSimpleResponse route = RouteSimpleResponse.builder()
                .routeId(1L)
                .meetingLocationInfo(meetingLocationInfo)
                .hospitalLocationInfo(hospitalLocationInfo)
                .returnLocationInfo(returnLocationInfo)
                .build();

        PatientSimpleResponse patient = PatientSimpleResponse.builder()
                .patientId(1L)
                .imageUrl("https://example.com/images/sample.jpg")
                .name("김토닥")
                .age(80)
                .gender("남자")
                .needsHelping(true)
                .usesWheelchair(true)
                .hasCognitiveIssue(true)
                .cognitiveIssueDetail(new ArrayList<>(List.of("판단에 도움이 필요해요", "기억하거나 이해하는 것이 어려워요")))
                .hasCommunicationIssue(true)
                .communicationIssueDetail("이가 많이 없으셔서 발음하시는 게 불편하세요")
                .build();

        RecruitDetailResponse mock = RecruitDetailResponse.builder()
                .recruitId(1L)
                .status("매칭중")
                .escortDate(LocalDate.now())
                .estimatedMeetingTime(LocalTime.NOON)
                .estimatedReturnTime(LocalTime.MIDNIGHT)
                .route(route)
                .patient(patient)
                .purpose("고혈압 정기 검진")
                .extraRequest("다음 정기 검진 예약 꼭 잡아주세요!")
                .build();

        return Response.from(mock);
    }

    @Operation(
            summary = "특정 동행 신청의 결제 정보 조회",
            description = "recruitId에 해당하는 동행 신청의 결제 정보를 조회합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "동행 신청 결제 정보 조회 성공")
    @GetMapping("/{recruitId}/payments")
    public Response<RecruitPaymentResponse> getRecruitPayment(@PathVariable Long recruitId) {
        // TODO :: recruitId에 해당하는 동행 신청의 결제 금액을 계산

//        return Response.from(recruitService.getRecruitPaymentByRecruitId(recruitId));

        LocationInfoSimpleResponse meetingLocationInfo = LocationInfoSimpleResponse.builder()
                .locationInfoId(1L)
                .placeName("신촌역 3번 출구")
                .address("서울특별시 서대문구 연세로 2")
                .detailAddress("출구 앞 파란 의자 근처")
                .build();

        LocationInfoSimpleResponse hospitalLocationInfo = LocationInfoSimpleResponse.builder()
                .locationInfoId(1L)
                .placeName("서울성모병원")
                .address("서울특별시 서초구 반포대로 222")
                .detailAddress("본관 3층 내과 외래")
                .build();

        LocationInfoSimpleResponse returnLocationInfo = LocationInfoSimpleResponse.builder()
                .locationInfoId(1L)
                .placeName("신촌역 3번 출구")
                .address("서울특별시 서대문구 연세로 2")
                .detailAddress("출구 앞 파란 의자 근처")
                .build();

        RouteSimpleResponse route = RouteSimpleResponse.builder()
                .routeId(1L)
                .meetingLocationInfo(meetingLocationInfo)
                .hospitalLocationInfo(hospitalLocationInfo)
                .returnLocationInfo(returnLocationInfo)
                .build();

        RecruitPaymentResponse mock = RecruitPaymentResponse.builder()
                .recruitId(1L)
                .route(route)
                .baseFee(30000)
                .expectedTaxiFee(100000)
                .build();

        return Response.from(mock);
    }

    @Operation(
            summary = "고객의 동행 신청",
            description = "로그인한 고객이 동행을 신청합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "동행 신청 성공")
    @PostMapping("")
    public Response<Void> createRecruit(@RequestBody RecruitCreateRequest requestDto) {
        // TODO :: 원래라면 jwt 혹은 sessionId로부터 유저 정보를 조회해야 함
        // 현재는 우선 userId = 1로 고정


        // 각종 엔티티 생성

        return Response.from();
    }

    @Operation(
            summary = "동행 신청 취소",
            description = "recruitId에 해당하는 동행 신청을 취소합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "동행 신청 취소 성공")
    @PatchMapping("/{recruitId}/cancel")
    public Response<Void> cancelRecruit(@PathVariable Long recruitId) {

        // recruitService.cancelRecruit(recruitId);

        return Response.from();
    }

    @Operation(
        summary = "도우미의 동행 목록 조회",
        description = "로그인한 도우미가 신청한 동행 목록(진행중/완료)을 조회합니다.")
    @ApiResponse(
        responseCode = "200",
        description = "동행 목록 조회 성공" )
    @GetMapping("/helper")
    public Response<RecruitListResponse> getRecruitListAsHelper() {
        // TODO :: 원래라면 jwt 혹은 sessionId로부터 유저 정보를 조회해야 함
        // 현재는 우선 userId = 1로 고정

        RecruitSimpleResponse dto = RecruitSimpleResponse.builder()
            .recruitId(1L)
            .status(RecruitStatus.MATCHING)
            .numberOfApplication(3L)
            .destination("서울아산병원")
            .departureLocation("꿈에그린아파트")
            .escortDate(LocalDate.now())
            .estimatedMeetingTime(LocalTime.NOON)
            .estimatedReturnTime(LocalTime.MIDNIGHT)
            .estimatedPayment(123000)
            .needsHelping(true)
            .hasCommunicationIssue(true)
            .hasCognitiveIssue(true)
            .usesWheelchair(true)
            .build();

        List<RecruitSimpleResponse> list = new ArrayList<>();
        list.add(dto);
        list.add(dto);

        RecruitListResponse mock = RecruitListResponse.builder()
            .completedList(list)
            .inProgressList(list).build();

        return Response.from(mock);
    }

    @Operation(
        summary = "동행 지원 목록 검색",
        description = "지역 및 날짜에 해당하는 동행 지원 목록을 검색합니다. datetime의 입력 형식 값은 (yyyy-mm-dd)입니다.")
    @ApiResponse(
        responseCode = "200",
        description = "동행 지원 목록 조회 성공")
    @GetMapping("")
    public Response<RecruitSearchListResponse> getRecruitListBySearch(@RequestParam("area") String area, @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        // TODO :: 원래라면 jwt 혹은 sessionId로부터 유저 정보를 조회해야 함
        // 현재는 우선 userId = 1로 고정

        RecruitSimpleResponse dto = RecruitSimpleResponse.builder()
            .recruitId(1L)
            .escortDate(date)
            .status(RecruitStatus.MATCHING)
            .estimatedMeetingTime(LocalTime.NOON)
            .estimatedReturnTime(LocalTime.MIDNIGHT)
            .departureLocation("꿈에그린아파트")
            .destination("서울아산병원")
            .estimatedPayment(123000)
            .needsHelping(true)
            .hasCommunicationIssue(true)
            .hasCognitiveIssue(true)
            .usesWheelchair(true)
            .build();

        List<RecruitSimpleResponse> list = new ArrayList<>();
        list.add(dto);
        list.add(dto);

        RecruitSearchListResponse mock = RecruitSearchListResponse.builder()
            .inProgressList(list).build();

        return Response.from(mock);
    }
}
