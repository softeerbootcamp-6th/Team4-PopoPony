package com.todoc.server.domain.customer.web.dto.response;

import com.todoc.server.common.enumeration.Gender;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Schema(description = "환자 요약 정보 조회 응답 DTO")
public class PatientSimpleResponse {

    @Schema(description = "환자 ID")
    private Long patientId;

    @Schema(description = "프로필 이미지 URL")
    private String imageUrl;

    @Schema(description = "성명")
    private String name;

    @Schema(description = "성별", allowableValues = {"MALE", "FEMALE"})
    private Gender gender;

    @Schema(description = "나이")
    private Integer age;

    @Schema(description = "부축 필요 여부")
    private Boolean needsHelping;

    @Schema(description = "휠체어 필요 여부")
    private Boolean usesWheelchair;

    @Schema(description = "인지 능력 문제 유무")
    private Boolean hasCognitiveIssue;

    @Schema(description = "인지 능력 상세 설명")
    private List<String> cognitiveIssueDetail;

    @Schema(description = "의사소통 문제 유무")
    private Boolean hasCommunicationIssue;

    @Schema(description = "의사소통 상세 설명")
    private String communicationIssueDetail;

    @Builder
    public PatientSimpleResponse(Long patientId, String imageUrl, String name, Gender gender, Integer age,
                                 Boolean needsHelping, Boolean usesWheelchair, Boolean hasCognitiveIssue, List<String> cognitiveIssueDetail,
                                 Boolean hasCommunicationIssue, String communicationIssueDetail) {
        this.patientId = patientId;
        this.imageUrl = imageUrl;
        this.name = name;
        this.gender = gender;
        this.age = age;
        this.needsHelping = needsHelping;
        this.usesWheelchair = usesWheelchair;
        this.hasCognitiveIssue = hasCognitiveIssue;
        this.cognitiveIssueDetail = cognitiveIssueDetail;
        this.hasCommunicationIssue = hasCommunicationIssue;
        this.communicationIssueDetail = communicationIssueDetail;
    }
}
