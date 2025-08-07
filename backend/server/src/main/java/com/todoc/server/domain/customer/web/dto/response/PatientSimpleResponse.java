package com.todoc.server.domain.customer.web.dto.response;

import com.fasterxml.jackson.core.type.TypeReference;
import com.todoc.server.common.util.JsonUtils;
import com.todoc.server.domain.customer.entity.Patient;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Schema(description = "환자 요약 정보 조회 응답 DTO")
public class PatientSimpleResponse {

    @NotNull
    @Schema(description = "환자 ID")
    private Long patientId;

    @NotNull
    @Schema(description = "프로필 이미지 URL")
    private String imageUrl;

    @NotNull
    @Schema(description = "성명")
    private String name;

    @NotNull
    @Schema(description = "성별", allowableValues = {"남자", "여자"})
    private String gender;

    @NotNull
    @Schema(description = "나이")
    private Integer age;

    @NotNull
    @Schema(description = "부축 필요 여부")
    private Boolean needsHelping;

    @NotNull
    @Schema(description = "휠체어 필요 여부")
    private Boolean usesWheelchair;

    @NotNull
    @Schema(description = "인지 능력 문제 유무")
    private Boolean hasCognitiveIssue;

    @Schema(description = "인지 능력 상세 설명")
    private List<String> cognitiveIssueDetail;

    @NotNull
    @Schema(description = "의사소통 문제 유무")
    private Boolean hasCommunicationIssue;

    @Schema(description = "의사소통 상세 설명")
    private String communicationIssueDetail;

    @Builder
    public PatientSimpleResponse(Long patientId, String imageUrl, String name, String gender, Integer age,
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

    public static PatientSimpleResponse from(Patient patient) {
        List<String> cognitiveIssueDetail = null;
        if (patient.getCognitiveIssueDetail() != null) {
            cognitiveIssueDetail = JsonUtils.fromJson(patient.getCognitiveIssueDetail(), new TypeReference<>() {});
        }

        // 성별 Enum에서 문자열로 변환
        String gender = patient.getGender().getLabel();

        return PatientSimpleResponse.builder()
                .patientId(patient.getId())
                .imageUrl(patient.getImageUrl())
                .name(patient.getName())
                .gender(gender)
                .age(patient.getAge())
                .needsHelping(patient.getNeedsHelping())
                .usesWheelchair(patient.getUsesWheelchair())
                .hasCognitiveIssue(patient.getHasCognitiveIssue())
                .cognitiveIssueDetail(cognitiveIssueDetail)
                .hasCommunicationIssue(patient.getHasCommunicationIssue())
                .communicationIssueDetail(patient.getCommunicationIssueDetail())
                .build();
    }
}
