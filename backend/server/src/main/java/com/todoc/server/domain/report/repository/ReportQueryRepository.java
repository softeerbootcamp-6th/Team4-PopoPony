package com.todoc.server.domain.report.repository;

import com.querydsl.core.Tuple;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.todoc.server.domain.escort.exception.RecruitNotFoundException;
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

    public Tuple getReportDetailByRecruitId(Long recruitId) {

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
        return tuple;
    }
}
