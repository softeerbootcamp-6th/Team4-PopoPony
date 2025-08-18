package com.todoc.server.domain.helper.web.dto.request;

import com.todoc.server.common.dto.request.ImageCreateRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Schema(description = "자격증 정보 생성 요청 DTO")
public class CertificateCreateRequest {

    @Schema(description = "자격증 이미지 정보")
    private ImageCreateRequest certificateImageCreateRequest;

    @Schema(description = "자격증 종류", example = "간호조무사")
    private String type;

    @Builder
    public CertificateCreateRequest(ImageCreateRequest certificateImageCreateRequest, String type) {
        this.certificateImageCreateRequest = certificateImageCreateRequest;
        this.type = type;
    }
}
