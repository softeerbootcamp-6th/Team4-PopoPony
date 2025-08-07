package com.todoc.server.domain.customer.entity;

import com.todoc.server.common.enumeration.Gender;
import com.todoc.server.common.entity.BaseEntity;
import com.todoc.server.domain.auth.entity.Auth;
import com.todoc.server.domain.latestlocation.entity.LatestLocation;
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

    @Builder
    public Patient(Auth customer, LatestLocation latestLocation, String name, String imageUrl,
                   Integer age, Gender gender, String contact, Boolean needsHelping, Boolean usesWheelchair,
                   Boolean hasCognitiveIssue, String cognitiveIssueDetail, Boolean hasCommunicationIssue, String communicationIssueDetail) {
        this.customer = customer;
        this.latestLocation = latestLocation;
        this.name = name;
        this.imageUrl = imageUrl;
        this.age = age;
        this.gender = gender;
        this.contact = contact;
        this.needsHelping = needsHelping;
        this.usesWheelchair = usesWheelchair;
        this.hasCognitiveIssue = hasCognitiveIssue;
        this.cognitiveIssueDetail = cognitiveIssueDetail;
        this.hasCommunicationIssue = hasCommunicationIssue;
        this.communicationIssueDetail = communicationIssueDetail;
    }
}
