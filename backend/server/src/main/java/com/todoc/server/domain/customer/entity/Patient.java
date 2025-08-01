package com.todoc.server.domain.customer.entity;

import com.todoc.server.common.enumeration.Gender;
import com.todoc.server.common.entity.BaseEntity;
import com.todoc.server.domain.auth.entity.Auth;
import com.todoc.server.domain.latestlocation.entity.LatestLocation;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Patient extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Auth customer;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "latest_location_id")
    private LatestLocation latestLocation;

    private String name;

    @Column(name = "image_url")
    private String imageUrl;

    private Integer age;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private String contact;

    @Column(name = "needs_helping")
    private Boolean needsHelping;

    @Column(name = "uses_wheelchair")
    private Boolean usesWheelchair;

    @Column(name = "has_cognitive_issue")
    private Boolean hasCognitiveIssue;

    @Column(columnDefinition = "json",
            name = "cognitive_issue_detail")
    private String cognitiveIssueDetail;

    @Column(name = "has_communication_issue")
    private Boolean hasCommunicationIssue;

    @Column(name = "communication_issue_detail")
    private String communicationIssueDetail;
}
