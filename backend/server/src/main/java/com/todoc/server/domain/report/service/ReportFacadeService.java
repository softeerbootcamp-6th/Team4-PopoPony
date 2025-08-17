package com.todoc.server.domain.report.service;

import com.todoc.server.common.dto.request.ImageCreateRequest;
import com.todoc.server.domain.auth.entity.Auth;
import com.todoc.server.domain.auth.exception.AuthNotFoundException;
import com.todoc.server.domain.escort.entity.Application;
import com.todoc.server.domain.escort.entity.Escort;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.exception.RecruitNotFoundException;
import com.todoc.server.domain.escort.service.ApplicationService;
import com.todoc.server.domain.escort.service.EscortService;
import com.todoc.server.domain.image.entity.ImageFile;
import com.todoc.server.domain.image.service.ImageFileService;
import com.todoc.server.domain.report.entity.ImageAttachment;
import com.todoc.server.domain.report.entity.Report;
import com.todoc.server.domain.report.entity.TaxiFee;
import com.todoc.server.domain.report.web.dto.request.ReportCreateRequest;
import com.todoc.server.domain.report.web.dto.response.ReportDefaultValueResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
@Transactional
public class ReportFacadeService {

    private final ReportService reportService;
    private final EscortService escortService;
    private final ApplicationService applicationService;
    private final TaxiFeeService taxiFeeService;
    private final ImageAttachmentService imageAttachmentService;
    private final ImageFileService imageFileService;

    /**
     * 동행 리포트를 등록할 때 필요한 기본값을 조회
     */
    @Transactional(readOnly = true)
    public ReportDefaultValueResponse getReportDefaultValue(Long recruitId) {

        Escort escort = escortService.getByRecruitId(recruitId);

        return ReportDefaultValueResponse.builder()
                .actualMeetingTime(escort.getActualMeetingTime())
                .actualReturnTime(escort.getActualReturnTime())
                .memo(escort.getMemo())
                .build();
    }

    /**
     * 동행 리포트를 등록하는 함수
     */
    @Transactional
    public void createReport(ReportCreateRequest requestDto, Long recruitId) {

        // 1. 리포트 등록
        Report report = reportService.register(requestDto);
        Application application = applicationService.getMatchedApplicationByRecruitId(recruitId);

        Recruit recruit = application.getRecruit();
        Auth customer = recruit.getCustomer();
        Auth helper = application.getHelper();

        if (recruit == null) throw new RecruitNotFoundException();
        if (customer == null) throw new AuthNotFoundException();
        if (helper == null) throw new AuthNotFoundException();

        report.setRecruit(recruit);
        report.setCustomer(customer);
        report.setHelper(helper);

        // 2. 첨부 이미지 등록
        List<ImageCreateRequest> imageCreateRequestList = requestDto.getImageCreateRequestList();
        for (ImageCreateRequest imageCreateRequest : imageCreateRequestList) {
            ImageFile imageFile = imageFileService.register(imageCreateRequest);
            ImageAttachment imageAttachment = imageAttachmentService.register();
            imageAttachment.setReport(report);
            imageAttachment.setImageFile(imageFile);
        }

        // 3. 택시 요금 정보 등록
        ImageFile departureReceipt = imageFileService.register(requestDto.getTaxiFeeCreateRequest().getDepartureReceipt());
        ImageFile returnReceipt = imageFileService.register(requestDto.getTaxiFeeCreateRequest().getReturnReceipt());

        TaxiFee taxiFee = taxiFeeService.register(requestDto.getTaxiFeeCreateRequest());
        taxiFee.setReport(report);
        taxiFee.setDepartureReceiptImage(departureReceipt);
        taxiFee.setReturnReceiptImage(returnReceipt);
    }
}
