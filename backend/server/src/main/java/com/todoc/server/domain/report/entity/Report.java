package com.todoc.server.domain.report.entity;

import com.todoc.server.common.entity.BaseEntity;
import com.todoc.server.domain.auth.entity.Auth;
import com.todoc.server.domain.escort.entity.Recruit;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@SQLRestriction("deleted_at is NULL")
public class Report extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruit_id")
    private Recruit recruit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Auth customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "helper_id")
    private Auth helper;

    @Column(name = "actual_meeting_time")
    private LocalTime actualMeetingTime;

    @Column(name = "actual_return_time")
    private LocalTime actualReturnTime;

    @Column(name = "has_next_appointment")
    private Boolean hasNextAppointment;

    @Column(name = "next_appointment_time")
    private LocalDateTime nextAppointmentTime;

    private String description;

    @Builder
    public Report(LocalTime actualMeetingTime, LocalTime actualReturnTime, Boolean hasNextAppointment,
                  LocalDateTime nextAppointmentTime, String description) {
        this.actualMeetingTime = actualMeetingTime;
        this.actualReturnTime = actualReturnTime;
        this.hasNextAppointment = hasNextAppointment;
        this.nextAppointmentTime = nextAppointmentTime;
        this.description = description;
    }
}