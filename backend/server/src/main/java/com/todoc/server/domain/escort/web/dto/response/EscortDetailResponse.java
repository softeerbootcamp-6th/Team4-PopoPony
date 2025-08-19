package com.todoc.server.domain.escort.web.dto.response;

import com.todoc.server.common.util.ImageUrlUtils;
import com.todoc.server.domain.customer.entity.Patient;
import com.todoc.server.domain.helper.entity.HelperProfile;
import com.todoc.server.domain.image.entity.ImageFile;
import com.todoc.server.domain.route.web.dto.response.RouteDetailResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@Schema(description = "동행 상세 정보 조회 응답 DTO")
public class EscortDetailResponse {

    @NotNull
    @Schema(description = "동행 ID")
    private Long escortId;

    @NotNull
    @Schema(description = "동행 날짜", example = "2025-08-01")
    private LocalDate escortDate;

    @NotNull
    @Schema(description = "동행 상태", example = "병원행")
    private String escortStatus;

    @NotNull
    @Schema(description = "만나는 시각", example = "09:30:00")
    private LocalTime estimatedMeetingTime;

    @NotNull
    @Schema(description = "복귀 시각", example = "12:30:00")
    private LocalTime estimatedReturnTime;

    @NotNull
    @Schema(description = "경로 세부 정보")
    private RouteDetailResponse route;

    @NotNull
    @Schema(description = "고객 연락처")
    private String customerContact;

    @NotNull
    private EscortHelperSimpleResponse helper;

    @NotNull
    private EscortPatientSimpleResponse patient;

    @Schema(description = "동행 목적")
    private String purpose;

    @Schema(description = "요청 사항")
    private String extraRequest;

    @Builder
    public EscortDetailResponse(Long escortId, LocalDate escortDate, String escortStatus, LocalTime estimatedMeetingTime, LocalTime estimatedReturnTime,
                                RouteDetailResponse route, String customerContact, EscortPatientSimpleResponse patient,
                                EscortHelperSimpleResponse helper, String purpose, String extraRequest) {
        this.escortId = escortId;
        this.escortDate = escortDate;
        this.escortStatus = escortStatus;
        this.estimatedMeetingTime = estimatedMeetingTime;
        this.estimatedReturnTime = estimatedReturnTime;
        this.route = route;
        this.customerContact = customerContact;
        this.patient = patient;
        this.helper = helper;
        this.purpose = purpose;
        this.extraRequest = extraRequest;
    }

    @NotNull
    @Getter
    @Schema(description = "환자 정보")
    public static class EscortPatientSimpleResponse {

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
        @Schema(description = "환자 연락처", example = "010-1234-5678")
        private String contact;

        public static EscortPatientSimpleResponse from(Patient patient) {
            ImageFile patientImage = patient.getPatientProfileImage();

            return EscortPatientSimpleResponse.builder()
                    .patientId(patient.getId())
                    .imageUrl(ImageUrlUtils.getImageUrl(patientImage.getId()))
                    .name(patient.getName())
                    .contact(patient.getContact())
                    .build();
        }

        @Builder
        public EscortPatientSimpleResponse(Long patientId, String imageUrl, String name, String contact) {
            this.patientId = patientId;
            this.imageUrl = imageUrl;
            this.name = name;
            this.contact = contact;
        }
    }

    @NotNull
    @Getter
    @Schema(description = "도우미 정보")
    public static class EscortHelperSimpleResponse {

        @NotNull
        @Schema(description = "도우미 ID")
        private Long helperProfileId;

        @NotNull
        @Schema(description = "도우미 이미지 URL", example = "https://example.com/helper.png")
        private String imageUrl;

        @NotNull
        @Schema(description = "도우미 이름", example = "김도움")
        private String name;

        @NotNull
        @Schema(description = "도우미 연락처", example = "010-1234-5678")
        private String contact;

        public static EscortHelperSimpleResponse from(HelperProfile helperProfile) {
            ImageFile helperImage = helperProfile.getHelperProfileImage();

            return EscortHelperSimpleResponse.builder()
                    .helperProfileId(helperProfile.getId())
                    .imageUrl(ImageUrlUtils.getImageUrl(helperImage.getId()))
                    .name(helperProfile.getAuth().getName())
                    .contact(helperProfile.getAuth().getContact())
                    .build();
        }

        @Builder
        public EscortHelperSimpleResponse(Long helperProfileId, String imageUrl, String name, String contact) {
            this.helperProfileId = helperProfileId;
            this.imageUrl = imageUrl;
            this.name = name;
            this.contact = contact;
        }
    }
}
