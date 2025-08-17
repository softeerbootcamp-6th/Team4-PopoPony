package com.todoc.server.domain.escort.web.dto.response;

import com.todoc.server.common.enumeration.EscortStatus;
import com.todoc.server.common.enumeration.RecruitStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Schema(description = "동행 신청 정보 요약본 응답 DTO")
public class RecruitSimpleResponse {

    @NotNull
    @Schema(description = "동행 신청 ID")
    private Long recruitId;

    @Schema(description = "동행중인 경우, 동행 ID")
    private Long escortId;

    // 매칭중, 매칭완료, 동행중
    @NotNull
    @Schema(description = "동행 신청의 진행 상태", allowableValues = {"매칭중", "매칭완료", "동행중", "동행완료"})
    private String recruitStatus;

    @Schema(description = "실제 동행의 진행 상태", allowableValues = {"동행준비", "만남중", "병원행", "진료중", "복귀중", "리포트작성중", "동행완료"})
    private String escortStatus;

    @NotNull
    @Schema(description = "지원한 도우미 수")
    private Long numberOfApplication;

    @NotNull
    @Schema(description = "동행 날짜", example = "2025-08-01")
    private LocalDate escortDate;

    @NotNull
    @Schema(description = "만나는 시각", example = "09:30:00")
    private LocalTime estimatedMeetingTime;

    @NotNull
    @Schema(description = "복귀 시각", example = "12:30:00")
    private LocalTime estimatedReturnTime;

    @NotNull
    @Schema(description = "만나는 장소")
    private String departureLocation;

    @NotNull
    @Schema(description = "목적지 병원")
    private String destination;

    @NotNull
    @Schema(description = "예상 급여", example = "123000")
    private Integer estimatedPayment;

    @NotNull
    @Schema(description = "부축이 필요한지", example = "true")
    private Boolean needsHelping;

    @NotNull
    @Schema(description = "휠체어를 이용하고 있는지", example = "true")
    private Boolean usesWheelchair;

    @NotNull
    @Schema(description = "인지능력 이슈가 있는지", example = "true")
    private Boolean hasCognitiveIssue;

    @NotNull
    @Schema(description = "의사소통 이슈가 있는지", example = "true")
    private Boolean hasCommunicationIssue;

    @Builder
    public RecruitSimpleResponse(Long recruitId, Long escortId, String recruitStatus, String escortStatus, Long numberOfApplication, LocalDate escortDate, LocalTime estimatedMeetingTime, LocalTime estimatedReturnTime, String departureLocation, String destination, Integer estimatedPayment, Boolean needsHelping, Boolean usesWheelchair, Boolean hasCognitiveIssue, Boolean hasCommunicationIssue) {
        this.recruitId = recruitId;
        this.escortId = escortId;
        this.recruitStatus = recruitStatus;
        this.escortStatus = escortStatus;
        this.numberOfApplication = numberOfApplication;
        this.escortDate = escortDate;
        this.estimatedMeetingTime = estimatedMeetingTime;
        this.estimatedReturnTime = estimatedReturnTime;
        this.departureLocation = departureLocation;
        this.destination = destination;
        this.estimatedPayment = estimatedPayment;
        this.needsHelping = needsHelping;
        this.usesWheelchair = usesWheelchair;
        this.hasCognitiveIssue = hasCognitiveIssue;
        this.hasCommunicationIssue = hasCommunicationIssue;
    }

    @Builder
    public RecruitSimpleResponse(Long recruitId, Long escortId, RecruitStatus recruitStatus, EscortStatus escortStatus, Long numberOfApplication, LocalDate escortDate, LocalTime estimatedMeetingTime, LocalTime estimatedReturnTime, String departureLocation, String destination, Integer estimatedPayment, Boolean needsHelping, Boolean usesWheelchair, Boolean hasCognitiveIssue, Boolean hasCommunicationIssue) {
        String escortStatusLabel = escortStatus == null ? escortStatusLabel = null : escortStatus.getLabel();

        this.recruitId = recruitId;
        this.escortId = escortId;
        this.recruitStatus = recruitStatus.getLabel();
        this.escortStatus = escortStatusLabel;
        this.numberOfApplication = numberOfApplication;
        this.escortDate = escortDate;
        this.estimatedMeetingTime = estimatedMeetingTime;
        this.estimatedReturnTime = estimatedReturnTime;
        this.departureLocation = departureLocation;
        this.destination = destination;
        this.estimatedPayment = estimatedPayment;
        this.needsHelping = needsHelping;
        this.usesWheelchair = usesWheelchair;
        this.hasCognitiveIssue = hasCognitiveIssue;
        this.hasCommunicationIssue = hasCommunicationIssue;
    }
}
