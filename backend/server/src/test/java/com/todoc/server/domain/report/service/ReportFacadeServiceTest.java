package com.todoc.server.domain.report.service;

import com.todoc.server.common.dto.request.ImageCreateRequest;
import com.todoc.server.domain.auth.entity.Auth;
import com.todoc.server.domain.auth.exception.AuthNotFoundException;
import com.todoc.server.domain.escort.entity.Application;
import com.todoc.server.domain.escort.entity.Escort;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.service.ApplicationService;
import com.todoc.server.domain.escort.service.EscortService;
import com.todoc.server.domain.report.entity.ImageAttachment;
import com.todoc.server.domain.report.entity.Report;
import com.todoc.server.domain.report.entity.TaxiFee;
import com.todoc.server.domain.report.entity.TaxiReceiptImage;
import com.todoc.server.domain.report.web.dto.request.ReportCreateRequest;
import com.todoc.server.domain.report.web.dto.request.ReportCreateRequest.TaxiFeeCreateRequest;
import com.todoc.server.domain.report.web.dto.response.ReportDefaultValueResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class ReportFacadeServiceTest {

    @InjectMocks
    private ReportFacadeService reportFacadeService;

    @Mock private ReportService reportService;
    @Mock private EscortService escortService;
    @Mock private ApplicationService applicationService;
    @Mock private TaxiFeeService taxiFeeService;
    @Mock private TaxiReceiptImageService taxiReceiptImageService;
    @Mock private ImageAttachmentService imageAttachmentService;

    @Test
    @DisplayName("createReport - 성공(첨부 2장, 영수증 2장, 택시요금 1건)")
    void createReport_success() {
        // given
        Long recruitId = 9L;

        // ReportCreateRequest 준비
        ImageCreateRequest img1 = image("reports/9/p1.jpg", "image/jpeg", 111_111L, "\"etag-9-1\"");
        ImageCreateRequest img2 = image("reports/9/p2.jpg", "image/jpeg", 222_222L, "\"etag-9-2\"");
        ImageCreateRequest dep  = image("reports/9/receipt-dep.jpg", "image/jpeg", 55_000L, "\"etag-dep-9\"");
        ImageCreateRequest ret  = image("reports/9/receipt-ret.jpg", "image/jpeg", 66_000L, "\"etag-ret-9\"");
        TaxiFeeCreateRequest feeReq = taxiFeeReq(8700, dep, 9200, ret);
        ReportCreateRequest req = reportReq(
                LocalTime.of(9, 40), LocalTime.of(11, 35),
                true, LocalDateTime.of(2025, 8, 30, 10, 0),
                "단위테스트", List.of(img1, img2), feeReq
        );

        // mock 엔티티들
        Report persistedReport = new Report();
        when(reportService.register(any())).thenReturn(persistedReport);

        Recruit recruit = new Recruit();
        Auth customer = new Auth(); ReflectionTestUtils.setField(customer, "id", 4L);
        Auth helper   = new Auth(); ReflectionTestUtils.setField(helper,   "id", 4L);
        ReflectionTestUtils.setField(recruit, "customer", customer);

        Application app = mock(Application.class);
        when(app.getRecruit()).thenReturn(recruit);
        when(app.getHelper()).thenReturn(helper);
        when(applicationService.getMatchedApplicationByRecruitId(recruitId)).thenReturn(app);

        ImageAttachment att1 = mock(ImageAttachment.class);
        ImageAttachment att2 = mock(ImageAttachment.class);
        when(imageAttachmentService.register(img1)).thenReturn(att1);
        when(imageAttachmentService.register(img2)).thenReturn(att2);

        TaxiReceiptImage depImg = mock(TaxiReceiptImage.class);
        TaxiReceiptImage retImg = mock(TaxiReceiptImage.class);
        when(taxiReceiptImageService.register(dep)).thenReturn(depImg);
        when(taxiReceiptImageService.register(ret)).thenReturn(retImg);

        TaxiFee taxiFee = mock(TaxiFee.class);
        when(taxiFeeService.register(feeReq)).thenReturn(taxiFee);

        // when
        reportFacadeService.createReport(req, recruitId);

        // then: report 필드 세팅 확인
        assertThat(persistedReport.getRecruit()).isSameAs(recruit);
        assertThat(persistedReport.getCustomer()).isSameAs(customer);
        assertThat(persistedReport.getHelper()).isSameAs(helper);

        // 첨부 이미지 setReport 호출 검증
        verify(imageAttachmentService).register(img1);
        verify(imageAttachmentService).register(img2);
        verify(att1).setReport(persistedReport);
        verify(att2).setReport(persistedReport);

        // 영수증 저장 + 택시요금 저장 및 setReport 호출 검증
        verify(taxiReceiptImageService).register(dep);
        verify(taxiReceiptImageService).register(ret);
        verify(taxiFeeService).register(feeReq);
        verify(taxiFee).setReport(persistedReport);

        // 상호작용 횟수 검증
        verify(applicationService, times(1)).getMatchedApplicationByRecruitId(recruitId);
        verify(reportService, times(1)).register(any());
    }

    @Test
    @DisplayName("createReport - customer == null 이면 AuthNotFoundException")
    void createReport_customerNull() {
        // given
        ReportCreateRequest req = emptyMinimalRequest();
        when(reportService.register(any())).thenReturn(new Report());

        Recruit recruit = new Recruit();
        Application app = mock(Application.class);
        when(app.getRecruit()).thenReturn(recruit);
        when(app.getHelper()).thenReturn(new Auth());
        when(applicationService.getMatchedApplicationByRecruitId(2L)).thenReturn(app);

        // when & then
        assertThatThrownBy(() -> reportFacadeService.createReport(req, 2L))
                .isInstanceOf(AuthNotFoundException.class);
    }

    @Test
    @DisplayName("createReport - helper == null 이면 AuthNotFoundException")
    void createReport_helperNull() {
        // given
        ReportCreateRequest req = emptyMinimalRequest();
        when(reportService.register(any())).thenReturn(new Report());

        Recruit recruit = new Recruit();
        Auth customer = new Auth();
        ReflectionTestUtils.setField(recruit, "customer", customer);

        Application app = mock(Application.class);
        when(app.getRecruit()).thenReturn(recruit);
        when(app.getHelper()).thenReturn(null);
        when(applicationService.getMatchedApplicationByRecruitId(3L)).thenReturn(app);

        // when & then
        assertThatThrownBy(() -> reportFacadeService.createReport(req, 3L))
                .isInstanceOf(AuthNotFoundException.class);
    }

    @Test
    @DisplayName("getReportDefaultValue - 성공")
    void getReportDefaultValue_success() {
        // given
        Escort escort = new Escort();
        ReflectionTestUtils.setField(escort, "actualMeetingTime", LocalTime.of(10, 5));
        ReflectionTestUtils.setField(escort, "actualReturnTime", LocalTime.of(12, 40));
        ReflectionTestUtils.setField(escort, "memo", "메모입니다.");
        when(escortService.getByRecruitId(9L)).thenReturn(escort);

        // when
        ReportDefaultValueResponse resp = reportFacadeService.getReportDefaultValue(9L);

        // then
        assertThat(resp).isNotNull();
        assertThat(resp.getActualMeetingTime()).isEqualTo(LocalTime.of(10, 5));
        assertThat(resp.getActualReturnTime()).isEqualTo(LocalTime.of(12, 40));
        assertThat(resp.getMemo()).isEqualTo("메모입니다.");
        verify(escortService).getByRecruitId(9L);
    }

    private ReportCreateRequest emptyMinimalRequest() {
        ImageCreateRequest dep  = image("k1", "image/jpeg", 1L, "\"c1\"");
        ImageCreateRequest ret  = image("k2", "image/jpeg", 1L, "\"c2\"");
        TaxiFeeCreateRequest fee = taxiFeeReq(1000, dep, 2000, ret);

        ReportCreateRequest req = reportReq(
                LocalTime.of(9,0), LocalTime.of(10,0),
                false, null, "메모", List.of(), fee
        );
        return req;
    }

    private ReportCreateRequest reportReq(
            LocalTime actualMeetingTime,
            LocalTime actualReturnTime,
            boolean hasNextAppointment,
            LocalDateTime nextAppointmentTime,
            String description,
            List<ImageCreateRequest> images,
            TaxiFeeCreateRequest taxiFeeCreateRequest
    ) {
        ReportCreateRequest req = new ReportCreateRequest();
        ReflectionTestUtils.setField(req, "actualMeetingTime", actualMeetingTime);
        ReflectionTestUtils.setField(req, "actualReturnTime", actualReturnTime);
        ReflectionTestUtils.setField(req, "hasNextAppointment", hasNextAppointment);
        ReflectionTestUtils.setField(req, "nextAppointmentTime", nextAppointmentTime);
        ReflectionTestUtils.setField(req, "description", description);
        ReflectionTestUtils.setField(req, "imageCreateRequestList", images);
        ReflectionTestUtils.setField(req, "taxiFeeCreateRequest", taxiFeeCreateRequest);
        return req;
    }

    private TaxiFeeCreateRequest taxiFeeReq(
            int departureFee,
            ImageCreateRequest departureReceipt,
            int returnFee,
            ImageCreateRequest returnReceipt
    ) {
        TaxiFeeCreateRequest req = new TaxiFeeCreateRequest();
        ReflectionTestUtils.setField(req, "departureFee", departureFee);
        ReflectionTestUtils.setField(req, "departureReceipt", departureReceipt);
        ReflectionTestUtils.setField(req, "returnFee", returnFee);
        ReflectionTestUtils.setField(req, "returnReceipt", returnReceipt);
        return req;
    }

    private ImageCreateRequest image(String s3Key, String contentType, long size, String checksum) {
        ImageCreateRequest dto = new ImageCreateRequest();
        ReflectionTestUtils.setField(dto, "s3Key", s3Key);
        ReflectionTestUtils.setField(dto, "contentType", contentType);
        ReflectionTestUtils.setField(dto, "size", size);
        ReflectionTestUtils.setField(dto, "checksum", checksum);
        return dto;
    }
}