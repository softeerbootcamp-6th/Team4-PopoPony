package com.todoc.server.domain.escort.web.dto.response;

import com.fasterxml.jackson.core.type.TypeReference;
import com.todoc.server.common.util.ImageUrlUtils;
import com.todoc.server.common.util.JsonUtils;
import com.todoc.server.domain.customer.entity.Patient;
import com.todoc.server.domain.image.entity.ImageFile;
import com.todoc.server.domain.image.entity.ImageMeta;
import com.todoc.server.domain.route.entity.LocationInfo;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Schema(description = "이전 동행 신청 정보 상세 응답 DTO")
public class RecruitHistoryDetailResponse {

    private PatientDetail patientDetail;

    private LocationDetail meetingLocationDetail;

    private LocationDetail destinationDetail;

    private LocationDetail returnLocationDetail;

    @Getter
    @Schema(description = "환자 상태 정보")
    public static class PatientDetail {

        @NotNull
        @Schema(description = "환자 ID")
        private Long patientId;

        @NotNull
        @Schema(description = "환자 이미지 URL", example = "https://example.com/patient.png")
        private String imageUrl;

        @NotNull
        @Schema(description = "S3 오브젝트 키(버킷 내부 경로). presigned 업로드 시 사용했던 key 그대로 전달")
        private String s3Key;

        @NotNull
        @Schema(description = "원본 Content-Type (이미지 MIME 타입)")
        private String contentType;

        @NotNull
        @Schema(description = "파일 크기(byte)")
        private Long size;

        @NotNull
        @Schema(description = "무결성 해시(일반적으로 S3 ETag)")
        private String checksum;

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

        public static PatientDetail from(Patient patient) {

            List<String> cognitiveIssueDetail = JsonUtils.fromJson(patient.getCognitiveIssueDetail(), new TypeReference<>() {});
            String gender = patient.getGender().getLabel();
            ImageFile patientImage = patient.getPatientProfileImage();
            ImageMeta imageMeta = patientImage.getImageMeta();

            return PatientDetail.builder()
                    .patientId(patient.getId())
                    .imageUrl(ImageUrlUtils.getImageUrl(patientImage.getId()))
                    .s3Key(imageMeta.getS3Key())
                    .contentType(imageMeta.getContentType())
                    .size(imageMeta.getSize())
                    .checksum(imageMeta.getChecksum())
                    .name(patient.getName())
                    .age(patient.getAge())
                    .gender(gender)
                    .phoneNumber(patient.getContact())
                    .needsHelping(patient.getNeedsHelping())
                    .usesWheelchair(patient.getUsesWheelchair())
                    .hasCognitiveIssue(patient.getHasCognitiveIssue())
                    .cognitiveIssueDetail(cognitiveIssueDetail)
                    .hasCommunicationIssue(patient.getHasCommunicationIssue())
                    .communicationIssueDetail(patient.getCommunicationIssueDetail())
                    .build();
        }

        @Builder
        public PatientDetail(Long patientId, String imageUrl, String s3Key, String contentType, Long size, String checksum, String name, Integer age, String gender, String phoneNumber, boolean needsHelping, boolean usesWheelchair, boolean hasCognitiveIssue, List<String> cognitiveIssueDetail, boolean hasCommunicationIssue, String communicationIssueDetail) {
            this.patientId = patientId;
            this.imageUrl = imageUrl;
            this.s3Key = s3Key;
            this.contentType = contentType;
            this.size = size;
            this.checksum = checksum;
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
        }
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

        public static LocationDetail from(LocationInfo locationInfo) {
            return LocationDetail.builder()
                    .placeName(locationInfo.getPlaceName())
                    .upperAddrName(locationInfo.getUpperAddrName())
                    .middleAddrName(locationInfo.getMiddleAddrName())
                    .lowerAddrName(locationInfo.getLowerAddrName())
                    .firstAddrNo(locationInfo.getFirstAddrNo())
                    .secondAddrNo(locationInfo.getSecondAddrNo())
                    .roadName(locationInfo.getRoadName())
                    .firstBuildingNo(locationInfo.getFirstBuildingNo())
                    .secondBuildingNo(locationInfo.getSecondBuildingNo())
                    .detailAddress(locationInfo.getDetailAddress())
                    .longitude(locationInfo.getLongitude())
                    .latitude(locationInfo.getLatitude())
                    .build();
        }

        @Builder
        public LocationDetail(String placeName, String upperAddrName, String middleAddrName, String lowerAddrName,
                              String firstAddrNo, String secondAddrNo, String roadName, String firstBuildingNo,
                              String secondBuildingNo, String detailAddress, BigDecimal longitude, BigDecimal latitude) {
            this.placeName = placeName;
            this.upperAddrName = upperAddrName;
            this.middleAddrName = middleAddrName;
            this.lowerAddrName = lowerAddrName;
            this.firstAddrNo = firstAddrNo;
            this.secondAddrNo = secondAddrNo;
            this.roadName = roadName;
            this.firstBuildingNo = firstBuildingNo;
            this.secondBuildingNo = secondBuildingNo;
            this.detailAddress = detailAddress;
            this.longitude = longitude;
            this.latitude = latitude;
        }
    }

    @Builder
    public RecruitHistoryDetailResponse(PatientDetail patientDetail, LocationDetail meetingLocationDetail, LocationDetail destinationDetail, LocationDetail returnLocationDetail) {
        this.patientDetail = patientDetail;
        this.meetingLocationDetail = meetingLocationDetail;
        this.destinationDetail = destinationDetail;
        this.returnLocationDetail = returnLocationDetail;
    }
}
