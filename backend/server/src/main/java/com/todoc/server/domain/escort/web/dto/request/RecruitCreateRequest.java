package com.todoc.server.domain.escort.web.dto.request;

import com.todoc.server.common.enumeration.Gender;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Schema(description = "동행 신청 요청 DTO")
public class RecruitCreateRequest {

    private PatientDetail patientDetail;

    private EscortDetail escortDetail;

    private LocationDetail meetingLocationDetail;

    private LocationDetail destinationDetail;

    private LocationDetail returnLocationDetail;

    @Getter
    @Schema(description = "환자 상태 정보")
    public static class PatientDetail {

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
    }

    @Getter
    @Schema(description = "동행 정보")
    public static class EscortDetail {

        @Schema(description = "동행 날짜", example = "2025-08-01")
        private LocalDate escortDate;

        @Schema(description = "만나는 시각", example = "09:30:00")
        private LocalTime estimatedMeetingTime;

        @Schema(description = "복귀 시각", example = "12:30:00")
        private LocalTime estimatedReturnTime;

        @Schema(description = "동행 목적", example = "정기 진료")
        private String purpose;

        @Schema(description = "기타 요청사항", example = "약 수령도 대신 부탁드립니다.")
        private String extraRequest;
    }

    @Getter
    @Schema(description = "위치 정보")
    public static class LocationDetail {

        @Schema(description = "장소 이름", example = "세종시청")
        private String placeName;

        @Schema(description = "시/도", example = "서울")
        private String upperAddrName;

        @Schema(description = "시/군/구", example = "강서구")
        private String middleAddrName;

        @Schema(description = "읍/면/동", example = "보람동")
        private String lowerAddrName;

        @Schema(description = "지번 본번", example = "123")
        private String firstAddrNo;

        @Schema(description = "지번 부번", example = "45")
        private String secondAddrNo;

        @Schema(description = "도로명", example = "보람로")
        private String roadName;

        @Schema(description = "건물 본번", example = "123")
        private String firstBuildingNo;

        @Schema(description = "건물 부번", example = "2")
        private String secondBuildingNo;

        @Schema(description = "상세 주소", example = "세종시청 본관 3층")
        private String detailAddress;

        @Schema(description = "경도 (Longitude)", example = "127.2581225")
        private BigDecimal longitude;

        @Schema(description = "위도 (Latitude)", example = "36.4809912")
        private BigDecimal latitude;
    }

}
