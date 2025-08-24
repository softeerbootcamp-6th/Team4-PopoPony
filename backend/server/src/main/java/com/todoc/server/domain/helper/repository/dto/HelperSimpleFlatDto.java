package com.todoc.server.domain.helper.repository.dto;

import com.todoc.server.common.enumeration.Gender;
import com.todoc.server.domain.image.entity.ImageFile;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class HelperSimpleFlatDto {
    private Long helperProfileId;

    private ImageFile helperProfileImage;

    private String strength;

    private String shortBio;

    private Long authId;

    private String name;

    private LocalDate birthDate;

    private Gender gender;;

    private String contact;

    private String certificateType;

    public HelperSimpleFlatDto(Long helperProfileId, ImageFile helperProfileImage, String strength, String shortBio, Long authId, String name, LocalDate birthDate, Gender gender, String contact, String certificateType) {
        this.helperProfileId = helperProfileId;
        this.helperProfileImage = helperProfileImage;
        this.strength = strength;
        this.shortBio = shortBio;
        this.authId = authId;
        this.name = name;
        this.birthDate = birthDate;
        this.gender = gender;
        this.contact = contact;
        this.certificateType = certificateType;
    }
}
