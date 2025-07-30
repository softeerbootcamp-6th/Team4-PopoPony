package com.todoc.server.domain.report.entity;

import com.todoc.server.common.entity.BaseEntity;
import com.todoc.server.domain.escort.entity.Escort;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Getter
@Setter
public class Report extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "escort_id", unique = true)
    private Escort escort;

    @Column(name = "actual_meeting_time")
    private LocalTime actualMeetingTime;

    @Column(name = "actual_return_time")
    private LocalTime actualReturnTime;

    @Column(name = "has_next_appointment")
    private Boolean hasNextAppointment;

    @Column(name = "next_appointment_time")
    private LocalDateTime nextAppointmentTime;

    private String description;
}