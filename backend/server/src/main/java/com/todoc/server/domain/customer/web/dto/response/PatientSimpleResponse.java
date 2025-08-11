package com.todoc.server.domain.customer.web.dto.response;

import com.fasterxml.jackson.core.type.TypeReference;
import com.todoc.server.common.util.ImageUrlUtils;
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
    @Schema(description = "환자 이미지 URL", example = "https://example.com/patient.png")
    private String imageUrl;

    @NotNull
    @Schema(description = "환자 이름", example = "홍길동")
    private String name;

    @NotNull
    @Schema(description = "환자 나이", example = "81")
    private Integer age;

    @NotNull
    @Schema(description = "환자 성별", example = "남자")
    private String gender;

    @NotNull
    @Schema(description = "환자 연락처", example = "010-1234-5678")
    private String phoneNumber;

    @NotNull
    @Schema(description = "부축이 필요한지", example = "true")
    private boolean needsHelping;

    @NotNull
    @Schema(description = "휠체어를 이용하고 있는지", example = "true")
    private boolean usesWheelchair;

    @NotNull
    @Schema(description = "인지능력 이슈가 있는지", example = "true")
    private boolean hasCognitiveIssue;

    @Schema(description = "인지능력 이슈가 있다면, 디테일 설명", example = "['판단에 도움이 필요해요', '기억하거나 이해하는 것이 어려워요]")
    private List<String> cognitiveIssueDetail;

    @NotNull
    @Schema(description = "의사소통 이슈가 있는지", example = "true")
    private boolean hasCommunicationIssue;

    @Schema(description = "의사소통 이슈가 있다면, 디테일 설명", example = "이가 많이 없으셔서.. 천천히 이야기 들어주세요")
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
                .imageUrl(ImageUrlUtils.getImageUrl(patient.getPatientProfileImage().getId()))
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
