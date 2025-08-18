package com.todoc.server.domain.helper.repository.dto;

import com.todoc.server.domain.helper.entity.Certificate;
import com.todoc.server.domain.helper.entity.HelperProfile;
import lombok.Getter;

@Getter
public class HelperUpdateDefaultFlatDto {

    private HelperProfile helperProfile;

    private Certificate certificate;

    public HelperUpdateDefaultFlatDto(HelperProfile helperProfile, Certificate certificate) {
        this.helperProfile = helperProfile;
        this.certificate = certificate;
    }
}
