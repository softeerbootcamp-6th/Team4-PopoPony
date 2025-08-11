package com.todoc.server.domain.helper.web.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

import java.util.List;

@Getter
@Schema(description = "도우미 프로필 등록 요청 DTO")
public class HelperProfileCreateRequest {

    @Schema(description = "도우미 프로필 이미지 URL", example = "https://example.com/helper.png")
    private String imageUrl;

    @Schema(description = "강점 목록", example = "['안전한 부축으로 편안한 이동', '인지 장애 어르신 맞춤 케어']")
    private List<String> strengthList;

    @Schema(description = "한 줄 소개", example = "부모님처럼 모시겠습니다!")
    private String shortBio;

    @Schema(description = "만족도", allowableValues = {"서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종시",
            "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"})
    private String area;

    @Schema(description = "자격증 정보 목록")
    private List<CertificateInfo> certificateInfoList;

    @Getter
    @Schema(description = "환자 상태 정보")
    public static class CertificateInfo {

        @Schema(description = "자격증 이미지 URL", example = "https://example.com/certificate.png")
        private String imageUrl;

        @Schema(description = "자격증 종류", example = "간호조무사")
        private String type;
    }
}
