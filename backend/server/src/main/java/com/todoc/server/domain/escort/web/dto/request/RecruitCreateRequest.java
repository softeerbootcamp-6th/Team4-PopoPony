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
    
    @Schema(description = "환자 이미지 URL", example = "https://example.com/patient.png")
    private String imageUrl;

    @Schema(description = "환자 이름", example = "홍길동")
    private String name;
    
    @Schema(description = "환자 나이", example = "81")
    private Integer age;

    @Schema(description = "환자 성별", example = "GENDER.MALE")
    private Gender gender;

    @Schema(description = "환자 연락처", example = "010-1234-5678")
    private String phoneNumber;
    
    @Schema(description = "부축이 필요한지", example = "true")
    private boolean needsHelping;
    
    @Schema(description = "휠체어를 이용하고 있는지", example = "true")
    private boolean usesWheelchair;
    
    @Schema(description = "인지능력 이슈가 있는지", example = "true")
    private boolean hasCognitiveIssue;
    
    @Schema(description = "인지능력 이슈가 있다면, 디테일 설명", example = "['판단에 도움이 필요해요', '기억하거나 이해하는 것이 어려워요]")
    private String cognitiveIssueDetail;

    @Schema(description = "의사소통 이슈가 있는지", example = "true")
    private boolean hasCommunicationIssue;

    @Schema(description = "의사소통 이슈가 있다면, 디테일 설명", example = "이가 많이 없으셔서.. 천천히 이야기 들어주세요")
    private String communicationIssueDetail;

    @Schema(description = "동행 날짜", example = "2025-08-01")
    private LocalDate escortDate;

    @Schema(description = "만나는 시각", example = "09:30:00")
    private LocalTime estimatedMeetingTime;

    @Schema(description = "복귀 시각", example = "12:30:00")
    private LocalTime estimatedReturnTime;

    @Schema(description = "만나는 장소")
    private String meetingLocation;

    @Schema(description = "만나는 장소에 대한 추가 정보", example = "103동 402호 현관 앞")
    private String meetingLocationInfo;

    @Schema(description = "목적지 병원")
    private String destination;

    @Schema(description = "방문하실 과", example = "내과")
    private String destinationDetail;

    @Schema(description = "복귀 장소")
    private String returnLocation;

    @Schema(description = "복귀 장소에 대한 추가 정보", example = "103동 402호 현관 앞")
    private String returnLocationDetail;

    @Schema(description = "동행 목적", example = "정기 진료")
    private String purpose;

    @Schema(description = "기타 요청사항", example = "약 수령도 대신 부탁드립니다.")
    private String extraRequest;

    @Builder
    public RecruitCreateRequest(String imageUrl, String name, Integer age, Gender gender,
                                String phoneNumber, boolean needsHelping, boolean usesWheelchair, boolean hasCognitiveIssue,
                                String cognitiveIssueDetail, boolean hasCommunicationIssue, String communicationIssueDetail,
                                LocalDate escortDate, LocalTime estimatedMeetingTime, LocalTime estimatedReturnTime, String meetingLocation,
                                String meetingLocationInfo, String destination, String destinationDetail, String returnLocation,
                                String returnLocationDetail, String purpose, String extraRequest) {
        this.imageUrl = imageUrl;
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.phoneNumber = phoneNumber;
        this.needsHelping = needsHelping;
        this.usesWheelchair = usesWheelchair;
        this.hasCognitiveIssue = hasCognitiveIssue;
        this.cognitiveIssueDetail = cognitiveIssueDetail;
        this.hasCommunicationIssue = hasCommunicationIssue;
        this.communicationIssueDetail = communicationIssueDetail;
        this.escortDate = escortDate;
        this.estimatedMeetingTime = estimatedMeetingTime;
        this.estimatedReturnTime = estimatedReturnTime;
        this.meetingLocation = meetingLocation;
        this.meetingLocationInfo = meetingLocationInfo;
        this.destination = destination;
        this.destinationDetail = destinationDetail;
        this.returnLocation = returnLocation;
        this.returnLocationDetail = returnLocationDetail;
        this.purpose = purpose;
        this.extraRequest = extraRequest;
    }
}
