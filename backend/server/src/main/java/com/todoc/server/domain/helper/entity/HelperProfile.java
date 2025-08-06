package com.todoc.server.domain.helper.entity;

import com.todoc.server.common.enumeration.Area;
import com.todoc.server.common.entity.BaseEntity;
import com.todoc.server.domain.auth.entity.Auth;
import com.todoc.server.domain.latestlocation.entity.LatestLocation;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
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

    @Column(name = "image_url")
    private String imageUrl;

    @Column(columnDefinition = "json")
    private String strength;

    @Column(name = "short_bio")
    private String shortBio;

    @Enumerated(EnumType.STRING)
    private Area area;
}