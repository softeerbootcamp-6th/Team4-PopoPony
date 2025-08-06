package com.todoc.server.domain.report.repository;

import com.querydsl.core.Tuple;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.todoc.server.common.util.DateTimeUtils;
import com.todoc.server.common.util.FeeUtils;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.exception.RecruitNotFoundException;
import com.todoc.server.domain.report.entity.Report;
import com.todoc.server.domain.report.entity.TaxiFee;
import com.todoc.server.domain.report.web.dto.response.ReportDetailResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import static com.todoc.server.domain.report.entity.QReport.report;
import static com.todoc.server.domain.report.entity.QTaxiFee.taxiFee;
import static com.todoc.server.domain.escort.entity.QRecruit.recruit;

@RequiredArgsConstructor
@Repository
@Transactional
public class ReportQueryRepository {

    private final JPAQueryFactory queryFactory;

    public ReportDetailResponse getReportDetailByRecruitId(Long recruitId) {

        // 1. 데이터 한번에 조회 (Report + TaxiFee + Recruit)
        Tuple tuple = queryFactory
                .select(report, taxiFee, recruit)
                .from(report)
                .join(report.recruit, recruit)
                .leftJoin(taxiFee).on(taxiFee.report.eq(report))
                .where(report.recruit.id.eq(recruitId))
                .fetchOne();

        if (tuple == null || tuple.get(recruit) == null) {
            throw new RecruitNotFoundException();
        }

        Report r = tuple.get(report);
        TaxiFee tf = tuple.get(taxiFee);
        Recruit rc = tuple.get(recruit);

        // 2. 시간 및 요금 계산
        int actualDuration = DateTimeUtils.getMinuteDifference(r.getActualMeetingTime(), r.getActualReturnTime());
        int estimatedDuration = DateTimeUtils.getMinuteDifference(rc.getEstimatedMeetingTime(), rc.getEstimatedReturnTime());
        int extraMinutes = actualDuration - estimatedDuration;

        int baseFee = FeeUtils.calculateTotalFee(rc.getEstimatedMeetingTime(), rc.getEstimatedReturnTime());
        int extraFee = FeeUtils.calculateTotalFee(r.getActualMeetingTime(), r.getActualReturnTime()) - baseFee;

        // 3. 응답 생성
        return ReportDetailResponse.builder()
                .reportId(r.getId())
                .actualMeetingTime(r.getActualMeetingTime())
                .actualReturnTime(r.getActualReturnTime())
                .extraMinutes(Math.max(extraMinutes, 0))
                .hasNextAppointment(r.getHasNextAppointment())
                .nextAppointmentTime(r.getNextAppointmentTime())
                .description(r.getDescription())
                .baseFee(baseFee)
                .extraTimeFee(Math.max(extraFee, 0))
                .taxiFee((tf != null ? tf.getDepartureFee() : 0) + (tf != null ? tf.getReturnFee() : 0))
                .build();
    }
}
