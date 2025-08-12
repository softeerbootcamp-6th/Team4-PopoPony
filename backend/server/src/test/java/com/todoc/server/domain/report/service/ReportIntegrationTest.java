package com.todoc.server.domain.report.service;

import com.todoc.server.common.dto.request.ImageCreateRequest;
import com.todoc.server.domain.auth.entity.Auth;
import com.todoc.server.domain.escort.exception.EscortNotFoundException;
import com.todoc.server.domain.escort.exception.RecruitNotFoundException;
import com.todoc.server.domain.image.entity.ImageFile;
import com.todoc.server.domain.report.entity.ImageAttachment;
import com.todoc.server.domain.report.entity.Report;
import com.todoc.server.domain.report.entity.TaxiFee;
import com.todoc.server.domain.report.web.dto.request.ReportCreateRequest;
import com.todoc.server.domain.report.web.dto.response.ReportDefaultValueResponse;
import com.todoc.server.domain.report.web.dto.response.ReportDetailResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;

@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE) // 실제 DB 사용 시
@Transactional
@ActiveProfiles("test")
@Sql("/sql/data.sql")
public class ReportIntegrationTest {

    @Autowired
    private ReportService reportService;

    @Autowired
    private ReportFacadeService reportFacadeService;

    @Autowired
    private ImageAttachmentService imageAttachmentService;

    @Autowired
    private TaxiFeeService taxiFeeService;

    @Test
    @DisplayName("리포트 상세 정보 조회 - 정상")
    void getReportDetailByRecruitId_정상() {
        // given
        Long recruitId = 1L;

        // when
        ReportDetailResponse response = reportService.getReportDetailByRecruitId(recruitId);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getDescription()).isEqualTo("예정된 시간에 잘 만났고, 병원 진료도 원활히 진행되었습니다.");
        assertThat(response.getBaseFee()).isEqualTo(35000);
        assertThat(response.getExtraMinutes()).isEqualTo(5);
        assertThat(response.getExtraTimeFee()).isEqualTo(1500);
        assertThat(response.getActualMeetingTime()).isEqualTo(LocalTime.of(9, 5));
    }

    @Test
    @DisplayName("리포트 상세 정보 조회 - 존재하지 않는 리포트")
    void getReportDetailByRecruitId_존재하지않는리포트() {
        // given
        Long recruitId = 999L;

        // when & then
        assertThatThrownBy(() -> reportService.getReportDetailByRecruitId(recruitId))
                .isInstanceOf(RecruitNotFoundException.class);
    }

    @Test
    @DisplayName("리포트 기본값 조회 - recruitId=9 정상 반환")
    void getReportDefaultValue_success() {
        // given
        Long recruitId = 9L;

        // when
        ReportDefaultValueResponse resp = reportFacadeService.getReportDefaultValue(recruitId);

        // then
        assertThat(resp).isNotNull();
        assertThat(resp.getActualMeetingTime()).isNull();
        assertThat(resp.getActualReturnTime()).isNull();
        assertThat(resp.getMemo()).isEqualTo("병원 방문 준비 중입니다.");
    }

    @Test
    @DisplayName("리포트 기본값 조회 - escort 없음이면 예외")
    void getReportDefaultValue_notFound() {
        Long recruitId = 9999L;
        assertThatThrownBy(() -> reportFacadeService.getReportDefaultValue(recruitId))
                .isInstanceOf(EscortNotFoundException.class);
    }

    @Test
    @Transactional
    @DisplayName("리포트 등록 - 첨부 2장 + 택시요금/영수증 포함 정상 저장")
    void createReport_success() {
        Long recruitId = 9L;

        // given
        ImageCreateRequest img1 = image("reports/9/p1.jpg", "image/jpeg", 111_111L, "\"etag-9-1\"");
        ImageCreateRequest img2 = image("reports/9/p2.jpg", "image/jpeg", 222_222L, "\"etag-9-2\"");
        ImageCreateRequest dep  = image("reports/9/receipt-dep.jpg", "image/jpeg", 55_000L, "\"etag-dep-9\"");
        ImageCreateRequest ret  = image("reports/9/receipt-ret.jpg", "image/jpeg", 66_000L, "\"etag-ret-9\"");

        ReportCreateRequest.TaxiFeeCreateRequest feeReq = taxiFeeReq(8700, dep, 9200, ret);
        ReportCreateRequest req = reportReq(
                LocalTime.of(9, 40),
                LocalTime.of(11, 35),
                true,
                LocalDateTime.of(2025, 8, 30, 10, 0),
                "통합테스트 등록 케이스",
                List.of(img1, img2),
                feeReq
        );

        long beforeReportCount = reportService.getCount();
        long beforeImageAttachmentCount  = imageAttachmentService.getCount();
        long beforeTaxiFeeCount = taxiFeeService.getCount();

        // when
        reportFacadeService.createReport(req, recruitId);

        // then
        assertThat(reportService.getCount()).isEqualTo(beforeReportCount + 1);
        assertThat(imageAttachmentService.getCount()).isEqualTo(beforeImageAttachmentCount + 2);
        assertThat(taxiFeeService.getCount()).isEqualTo(beforeTaxiFeeCount + 1);

        Report saved = reportService.getAllReports().stream()
                .filter(r -> r.getRecruit() != null && r.getRecruit().getId().equals(recruitId))
                .reduce((first, second) -> second)
                .orElseThrow();

        assertThat(saved.getActualMeetingTime()).isEqualTo(LocalTime.of(9, 40));
        assertThat(saved.getActualReturnTime()).isEqualTo(LocalTime.of(11, 35));
        assertThat(saved.getHasNextAppointment()).isTrue();
        assertThat(saved.getNextAppointmentTime()).isEqualTo(LocalDateTime.of(2025, 8, 30, 10, 0));

        assertThat(saved.getRecruit()).isNotNull();
        assertThat(saved.getRecruit().getId()).isEqualTo(recruitId);
        Auth customer = saved.getCustomer();
        Auth helper = saved.getHelper();
        assertThat(customer).isNotNull();
        assertThat(helper).isNotNull();
        assertThat(customer.getId()).isEqualTo(4L);
        assertThat(helper.getId()).isEqualTo(4L);

        List<ImageAttachment> imageAttachmentList = imageAttachmentService.getImageAttachmentsByReportId(saved.getId());
        assertThat(imageAttachmentList.size()).isEqualTo(2);
        assertThat(imageAttachmentList.stream().map(a -> a.getImageFile().getImageMeta().getS3Key()))
                .containsExactlyInAnyOrder("reports/9/p1.jpg", "reports/9/p2.jpg");

        TaxiFee fee = taxiFeeService.getTaxiFeeByRecruitId(saved.getId());
        assertThat(fee.getDepartureFee()).isEqualTo(8700);
        assertThat(fee.getReturnFee()).isEqualTo(9200);

        ImageFile depImg = fee.getDepartureReceiptImage();
        ImageFile retImg = fee.getReturnReceiptImage();
        assertThat(depImg).isNotNull();
        assertThat(retImg).isNotNull();
        assertThat(depImg.getImageMeta().getS3Key()).isEqualTo("reports/9/receipt-dep.jpg");
        assertThat(retImg.getImageMeta().getS3Key()).isEqualTo("reports/9/receipt-ret.jpg");
    }

    private ReportCreateRequest reportReq(
            LocalTime actualMeetingTime,
            LocalTime actualReturnTime,
            boolean hasNextAppointment,
            LocalDateTime nextAppointmentTime,
            String description,
            List<ImageCreateRequest> images,
            ReportCreateRequest.TaxiFeeCreateRequest taxiFeeCreateRequest
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

    private ReportCreateRequest.TaxiFeeCreateRequest taxiFeeReq(
            int departureFee,
            ImageCreateRequest departureReceipt,
            int returnFee,
            ImageCreateRequest returnReceipt
    ) {
        ReportCreateRequest.TaxiFeeCreateRequest req = new ReportCreateRequest.TaxiFeeCreateRequest();
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
