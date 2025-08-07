package com.todoc.server.domain.helper.web.dto.response;

import com.todoc.server.common.enumeration.Gender;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Schema(description = "도우미 정보 요약본 응답 DTO")
public class HelperSimpleResponse {

    @Schema(description = "도우미 프로필 ID")
    private Long helperProfileId;

    @NotNull
    @Schema(description = "프로필 이미지 URL")
    private String imageUrl;

    @NotNull
    @Schema(description = "성명")
    private String name;

    @NotNull
    @Schema(description = "성별", allowableValues = {"MALE", "FEMALE"})
    private Gender gender;

    @NotNull
    @Schema(description = "나이")
    private Integer age;

    @Schema(description = "한 줄 소개")
    private String shortBio;

    @NotNull
    @Schema(description = "연락처")
    private String contact;

    @NotNull
    @Schema(description = "자격증 목록")
    private List<String> certificateList;

    @NotNull
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
