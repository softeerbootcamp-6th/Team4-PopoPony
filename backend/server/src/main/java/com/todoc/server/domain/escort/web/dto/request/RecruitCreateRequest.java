package com.todoc.server.domain.escort.web.dto.request;

import com.todoc.server.common.enumeration.Gender;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Schema(description = "동행 신청 요청 DTO")
public class RecruitCreateRequest {
    
    @Schema(description = "환자 이미지 URL")
    private String imageUrl;

    @Schema(description = "환자 이름")
    private String patientName;
    
    @Schema(description = "환자 나이")
    private String patientAge;

    @Schema(description = "환자 성별", example = "GENDER.MALE")
    private Gender patientGender;

    @Schema(description = "환자 연락처", example = "010-1234-5678")
    private String patientPhoneNumber;
    
    @Schema(description = "부축이 필요한지", example = "true")
    private boolean needsHelping;
    
    @Schema(description = "휠체어를 이용하고 있는지", example = "true")
    private boolean usesWheelchair;
    
    @Schema(description = "인지능력 이슈가 있는지", example = "true")
    private boolean hasCognitiveIssue;
    
    @Schema(description = "인지능력 이슈가 있다면, 디테일 설명", example = "['판단에 도움이 필요해요', '기억하거나 이해하는 것이 어려워요]")
    private boolean cognitiveIssueDetail;

    @Schema(description = "의사소통 이슈가 있는지", example = "true")
    private boolean hasCommunicationIssue;

    @Schema(description = "의사소통 이슈가 있다면, 디테일 설명")
    private boolean communicationIssueDetail;

    @Schema(description = "동행 날짜", example = "2025-08-01")
    private LocalDate escortDate;

    @Schema(description = "만나는 시각", example = "09:30:00")
    private LocalTime estimatedMeetingTime;

    @Schema(description = "복귀 시각", example = "12:30:00")
    private LocalTime estimatedReturnTime;

    @Schema(description = "만나는 장소")
    private String departureLocation;

    @Schema(description = "만나는 장소에 대한 추가 정보", example = "103동 402호 현관 앞")
    private String departureLocationDetail;

    @Schema(description = "목적지 병원")
    private String destination;

    @Schema(description = "방문하실 과", example = "내과")
    private String destinationDetail;

    @Schema(description = "복귀 장소")
    private String returnLocation;

    @Schema(description = "복귀 장소에 대한 추가 정보", example = "103동 402호 현관 앞")
    private String returnLocationDetail;

    @Schema(description = "동행 목적")
    private String purpose;

    @Schema(description = "기타 요청사항")
    private String otherRequestDetail;

    @Builder
    public RecruitCreateRequest(String imageUrl, String patientName, String patientAge, Gender patientGender,
                                String patientPhoneNumber, boolean needsHelping, boolean usesWheelchair, boolean hasCognitiveIssue,
                                boolean cognitiveIssueDetail, boolean hasCommunicationIssue, boolean communicationIssueDetail,
                                LocalDate escortDate, LocalTime estimatedMeetingTime, LocalTime estimatedReturnTime, String departureLocation,
                                String departureLocationDetail, String destination, String destinationDetail, String returnLocation,
                                String returnLocationDetail, String purpose, String otherRequestDetail) {
        this.imageUrl = imageUrl;
        this.patientName = patientName;
        this.patientAge = patientAge;
        this.patientGender = patientGender;
        this.patientPhoneNumber = patientPhoneNumber;
        this.needsHelping = needsHelping;
        this.usesWheelchair = usesWheelchair;
        this.hasCognitiveIssue = hasCognitiveIssue;
        this.cognitiveIssueDetail = cognitiveIssueDetail;
        this.hasCommunicationIssue = hasCommunicationIssue;
        this.communicationIssueDetail = communicationIssueDetail;
        this.escortDate = escortDate;
        this.estimatedMeetingTime = estimatedMeetingTime;
        this.estimatedReturnTime = estimatedReturnTime;
        this.departureLocation = departureLocation;
        this.departureLocationDetail = departureLocationDetail;
        this.destination = destination;
        this.destinationDetail = destinationDetail;
        this.returnLocation = returnLocation;
        this.returnLocationDetail = returnLocationDetail;
        this.purpose = purpose;
        this.otherRequestDetail = otherRequestDetail;
    }
}
