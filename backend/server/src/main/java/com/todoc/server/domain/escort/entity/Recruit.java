package com.todoc.server.domain.escort.entity;

import com.todoc.server.common.entity.BaseEntity;
import com.todoc.server.common.enumeration.RecruitStatus;
import com.todoc.server.domain.auth.entity.Auth;
import com.todoc.server.domain.customer.entity.Patient;
import com.todoc.server.domain.route.entity.Route;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Getter
@Setter
public class Recruit extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Auth customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id")
    private Route route;

    @Column(name = "escort_date")
    private LocalDate escortDate;

    @Column(name = "estimated_meeting_time")
    private LocalTime estimatedMeetingTime;

    @Column(name = "estimated_return_time")
    private LocalTime estimatedReturnTime;

    private String purpose;

    @Column(name = "extra_request")
    private String extraRequest;

    @Column(name = "estimated_fee")
    private Integer estimatedFee;

    @Enumerated(EnumType.STRING)
    private RecruitStatus status;
}