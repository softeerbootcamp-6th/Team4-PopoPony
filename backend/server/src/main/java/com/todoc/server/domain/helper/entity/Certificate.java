package com.todoc.server.domain.helper.entity;

import com.todoc.server.common.entity.BaseEntity;
import com.todoc.server.domain.image.entity.ImageFile;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Getter
@Setter
@NoArgsConstructor
@SQLRestriction("deleted_at is NULL")
public class Certificate extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "helper_profile_id")
    private HelperProfile helperProfile;

    private String type;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "certificate_image_id")
    private ImageFile certificateImage;

    @Builder
    public Certificate(HelperProfile helperProfile, String type, ImageFile certificateImage) {
        this.helperProfile = helperProfile;
        this.type = type;
        this.certificateImage = certificateImage;
    }
}