package com.todoc.server.domain.helper.web.dto.response;

import com.todoc.server.common.dto.request.ImageCreateRequest;
import com.todoc.server.domain.helper.web.dto.request.CertificateCreateRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Schema(description = "도우미 프로필 수정 기본값 응답 DTO")
public class HelperUpdateDefaultResponse {

    @NotNull
    @Schema(description = "프로필 이미지 URL")
    private String imageUrl;

    @NotNull
    @Schema(description = "도우미 프로필 이미지 정보")
    private ImageCreateRequest profileImageCreateRequest;

    @NotNull
    @Schema(description = "강점 목록", example = "['안전한 부축으로 편안한 이동', '인지 장애 어르신 맞춤 케어']")
    private List<String> strengthList;

    @NotNull
    @Schema(description = "한 줄 소개", example = "부모님처럼 모시겠습니다!")
    private String shortBio;

    @NotNull
    @Schema(description = "활동 지역", allowableValues = {"서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종시",
            "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"})
    private String area;

    @NotNull
    @Schema(description = "자격증 정보 목록")
    private List<CertificateCreateRequest> certificateInfoList;

    @Builder
    public HelperUpdateDefaultResponse(String imageUrl, ImageCreateRequest profileImageCreateRequest,
                                       List<String> strengthList, String shortBio, String area, List<CertificateCreateRequest> certificateInfoList) {
        this.imageUrl = imageUrl;
        this.profileImageCreateRequest = profileImageCreateRequest;
        this.strengthList = strengthList;
        this.shortBio = shortBio;
        this.area = area;
        this.certificateInfoList = certificateInfoList;
    }
}
