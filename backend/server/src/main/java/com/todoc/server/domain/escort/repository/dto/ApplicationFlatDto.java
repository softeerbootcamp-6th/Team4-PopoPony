package com.todoc.server.domain.escort.repository.dto;

import com.todoc.server.common.enumeration.Gender;
import com.todoc.server.domain.image.entity.ImageFile;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class ApplicationFlatDto {

    private Long applicationId;

    private Long helperProfileId;

    private ImageFile helperProfileImage;

    private Long authId;

    private String name;

    private LocalDate birthDate;

    private Gender gender;;

    private String contact;

    private String strength;

    private String shortBio;

    private String certificateType;

    public ApplicationFlatDto(Long applicationId, Long helperProfileId, ImageFile helperProfileImage, Long authId, String name, LocalDate birthDate, Gender gender, String contact, String strength, String shortBio, String certificateType) {
        this.applicationId = applicationId;
        this.helperProfileId = helperProfileId;
        this.helperProfileImage = helperProfileImage;
        this.authId = authId;
        this.name = name;
        this.birthDate = birthDate;
        this.gender = gender;
        this.contact = contact;
        this.strength = strength;
        this.shortBio = shortBio;
        this.certificateType = certificateType;
    }

}
