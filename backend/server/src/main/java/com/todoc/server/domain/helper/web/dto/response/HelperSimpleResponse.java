package com.todoc.server.domain.helper.web.dto.response;

import com.todoc.server.common.enumeration.Gender;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Schema(description = "도우미 정보 요약본 응답 DTO")
public class HelperSimpleResponse {

    @Schema(description = "도우미 프로필 ID")
    private Long helperProfileId;

    @Schema(description = "프로필 이미지 URL")
    private String imageUrl;

    @Schema(description = "성명")
    private String name;

    @Schema(description = "성별", allowableValues = {"MALE", "FEMALE"})
    private Gender gender;

    @Schema(description = "나이")
    private Integer age;

    @Schema(description = "한 줄 소개")
    private String shortBio;

    @Schema(description = "연락처")
    private String contact;

    @Schema(description = "자격증 목록")
    private List<String> certificateList;

    @Schema(description = "강점 목록")
    private List<String> strengthList;

    @Builder
    public HelperSimpleResponse(Long helperProfileId, String imageUrl, String name, Gender gender, Integer age,
                                String shortBio, String contact, List<String> certificateList, List<String> strengthList) {
        this.helperProfileId = helperProfileId;
        this.imageUrl = imageUrl;
        this.name = name;
        this.gender = gender;
        this.age = age;
        this.shortBio = shortBio;
        this.contact = contact;
        this.certificateList = certificateList;
        this.strengthList = strengthList;
    }
}
