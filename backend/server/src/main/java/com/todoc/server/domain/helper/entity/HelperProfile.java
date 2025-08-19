package com.todoc.server.domain.helper.entity;

import com.todoc.server.common.enumeration.Area;
import com.todoc.server.common.entity.BaseEntity;
import com.todoc.server.domain.auth.entity.Auth;
import com.todoc.server.domain.image.entity.ImageFile;
import com.todoc.server.domain.realtime.entity.LatestLocation;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class HelperProfile extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auth_id")
    private Auth auth;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "latest_location_id")
    private LatestLocation latestLocation;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "helper_profile_image_id")
    private ImageFile helperProfileImage;

    @Column(columnDefinition = "json")
    private String strength;

    @Column(name = "short_bio")
    private String shortBio;

    @Enumerated(EnumType.STRING)
    private Area area;

    @Builder
    public HelperProfile(Long id, Auth auth, LatestLocation latestLocation, ImageFile helperProfileImage,
                         String strength, String shortBio, Area area) {
        this.id = id;
        this.auth = auth;
        this.latestLocation = latestLocation;
        this.helperProfileImage = helperProfileImage;
        this.strength = strength;
        this.shortBio = shortBio;
        this.area = area;
    }
}