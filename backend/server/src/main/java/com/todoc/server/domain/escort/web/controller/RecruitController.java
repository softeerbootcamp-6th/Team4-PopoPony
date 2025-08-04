package com.todoc.server.domain.escort.web.controller;

import com.todoc.server.common.enumeration.Gender;
import com.todoc.server.common.enumeration.RecruitStatus;
import com.todoc.server.common.response.Response;
import com.todoc.server.domain.customer.web.dto.response.PatientSimpleResponse;
import com.todoc.server.domain.escort.service.RecruitService;
import com.todoc.server.domain.escort.web.dto.request.RecruitCreateRequest;
import com.todoc.server.domain.escort.web.dto.response.RecruitDetailResponse;
import com.todoc.server.domain.escort.web.dto.response.RecruitListResponse;
import com.todoc.server.domain.escort.web.dto.response.RecruitPaymentResponse;
import com.todoc.server.domain.escort.web.dto.response.RecruitSimpleResponse;
import com.todoc.server.domain.route.web.dto.response.LocationInfoSimpleResponse;
import com.todoc.server.domain.route.web.dto.response.RouteSimpleResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Tag(name = "recruits", description = "동행 신청 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("api/recruits")
public class RecruitController {

    private final RecruitService recruitService;

    @Operation(
            summary = "고객의 동행 목록 조회",
            description = "로그인한 고객이 신청한 동행 목록(진행중/완료)을 조회합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "동행 목록 조회 성공",
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = Response.class)
            ))
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
            summary = "특정 동행 신청의 상세 정보 조회",
            description = "recruitId에 해당하는 동행 신청의 상세 정보를 조회합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "동행 신청 상세 정보 조회 성공",
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = Response.class)
            ))
    @GetMapping("/{recruitId}")
    public Response<RecruitDetailResponse> getRecruitDetail(@PathVariable Long recruitId) {
        // TODO :: recruitId에 해당하는 동행 신청을 검색

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
                .gender(Gender.MALE)
                .needsHelping(true)
                .usesWheelchair(true)
                .hasCognitiveIssue(true)
                .cognitiveIssueDetail(new ArrayList<>(List.of("판단에 도움이 필요해요", "기억하거나 이해하는 것이 어려워요")))
                .hasCommunicationIssue(true)
                .communicationIssueDetail("이가 많이 없으셔서 발음하시는 게 불편하세요")
                .build();

        RecruitDetailResponse mock = RecruitDetailResponse.builder()
                .recruitId(1L)
                .status(RecruitStatus.MATCHING)
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
            description = "동행 신청 결제 정보 조회 성공",
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = Response.class)
            ))
    @GetMapping("/{recruitId}/payments")
    public Response<RecruitPaymentResponse> getRecruitPayment(@PathVariable Long recruitId) {
        // TODO :: recruitId에 해당하는 동행 신청의 결제 금액을 계산

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
            description = "동행 목록 신청 성공",
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = Response.class)
            ))
    @PostMapping("")
    public Response<Void> createRecruit(@RequestBody RecruitCreateRequest requestDto) {
        // TODO :: 원래라면 jwt 혹은 sessionId로부터 유저 정보를 조회해야 함
        // 현재는 우선 userId = 1로 고정


        // 각종 엔티티 생성


        return Response.from();

    }

    @Operation(
            summary = "신청 취소",
            description = "recruitId에 해당하는 신청을 취소합니다.")
    @ApiResponse(
            responseCode = "200",
            description = "신청 취소 성공",
            content = @Content(schema = @Schema(implementation = Response.class)))
    @PatchMapping("/{recruitId}/cancel")
    public Response<Void> cancelRecruit(@PathVariable Long recruitId) {
        // TODO :: recruitId에 해당하는 Recruit을 찾아, 취소 상태로 변경 후, Soft Delete

        return Response.from();
    }
}
