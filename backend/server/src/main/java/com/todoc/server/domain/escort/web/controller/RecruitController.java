package com.todoc.server.domain.escort.web.controller;

import com.todoc.server.common.response.Response;
import com.todoc.server.domain.escort.web.dto.response.RecruitListResponse;
import com.todoc.server.domain.escort.web.dto.response.RecruitSimpleResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Tag(name = "escorts", description = "동행 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("api/escorts")
public class RecruitController {

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
                .escortId(1L)
                .status("MATCHING")
                .numberOfApplication(3)
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
}
