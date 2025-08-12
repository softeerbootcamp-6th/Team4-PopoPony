package com.todoc.server.domain.report.repository;

import com.querydsl.core.Tuple;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.todoc.server.domain.escort.exception.RecruitNotFoundException;
import com.todoc.server.domain.report.repository.dto.ReportDetailFlatDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import static com.todoc.server.domain.report.entity.QReport.report;
import static com.todoc.server.domain.report.entity.QTaxiFee.taxiFee;
import static com.todoc.server.domain.escort.entity.QRecruit.recruit;
import static com.todoc.server.domain.report.entity.QImageAttachment.imageAttachment;
import static com.todoc.server.domain.image.entity.QImageFile.imageFile;

@RequiredArgsConstructor
@Repository
@Transactional
public class ReportQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Transactional(readOnly = true)
    public ReportDetailFlatDto getReportDetailByRecruitId(Long recruitId) {

        var tuple = queryFactory
                .select(report, taxiFee, recruit)
                .from(report)
                .join(report.recruit, recruit)
                .leftJoin(taxiFee).on(taxiFee.report.eq(report))
                .where(report.recruit.id.eq(recruitId))
                .fetchOne();

        if (tuple == null || tuple.get(recruit) == null) {
            throw new RecruitNotFoundException();
        }

        Long reportId = tuple.get(report).getId();

        java.util.List<Long> imageIds = queryFactory
                .select(imageFile.id)
                .from(imageAttachment)
                .join(imageAttachment.imageFile, imageFile)
                .where(imageAttachment.report.id.eq(reportId))
                .orderBy(imageAttachment.id.asc())
                .fetch();

        return new ReportDetailFlatDto(tuple.get(report), tuple.get(taxiFee), tuple.get(recruit), imageIds);
    }
}
