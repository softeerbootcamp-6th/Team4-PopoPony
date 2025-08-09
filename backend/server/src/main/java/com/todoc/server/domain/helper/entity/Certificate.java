package com.todoc.server.domain.helper.entity;

import com.todoc.server.common.entity.BaseEntity;
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

    @Column(name = "image_url")
    private String imageUrl;

    @Builder
    public Certificate(HelperProfile helperProfile, String type, String imageUrl) {
        this.helperProfile = helperProfile;
        this.type = type;
        this.imageUrl = imageUrl;
    }
}