package com.todoc.server.domain.report.repository.dto;

import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.report.entity.Report;
import com.todoc.server.domain.report.entity.TaxiFee;
import lombok.Getter;

import java.util.List;

@Getter
public class ReportDetailFlatDto {

    private Report report;

    private TaxiFee taxiFee;

    private Recruit recruit;

    private List<Long> imageIdList;

    public ReportDetailFlatDto(Report report, TaxiFee taxiFee, Recruit recruit, List<Long> imageIdList) {
        this.report = report;
        this.taxiFee = taxiFee;
        this.recruit = recruit;
        this.imageIdList = imageIdList;
    }
}
