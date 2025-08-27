package com.todoc.server.domain.report.service;

import com.todoc.server.IntegrationTest;
import com.todoc.server.common.dto.request.ImageCreateRequest;
import com.todoc.server.common.enumeration.EscortStatus;
import com.todoc.server.domain.escort.service.EscortService;
import com.todoc.server.domain.report.entity.Report;
import com.todoc.server.domain.report.entity.TaxiFee;
import com.todoc.server.domain.report.exception.ReportAlreadyWrittenException;
import com.todoc.server.domain.report.exception.ReportNotReadyToWriteException;
import com.todoc.server.domain.report.repository.ImageAttachmentJpaRepository;
import com.todoc.server.domain.report.repository.ReportJpaRepository;
import com.todoc.server.domain.report.repository.TaxiFeeJpaRepository;
import com.todoc.server.domain.report.web.dto.request.ReportCreateRequest;
import com.todoc.server.domain.report.web.dto.request.ReportCreateRequest.TaxiFeeCreateRequest;
import com.todoc.server.domain.report.web.dto.response.ReportDefaultValueResponse;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.*;

@Transactional
public class ReportFacadeIntegrationTest extends IntegrationTest {

    @Autowired
    private ReportFacadeService reportFacadeService;

    @Autowired
    private ReportJpaRepository reportJpaRepository;

    @Autowired
    private TaxiFeeJpaRepository taxiFeeJpaRepository;

    @Autowired
    private ImageAttachmentJpaRepository imageAttachmentJpaRepository;

    @Autowired
    private EscortService escortService;


    @PersistenceContext
    private EntityManager em;


    @Nested
    @DisplayName("리포트 기본값 조회")
    class DefaultValue {

        @Test
        @DisplayName("escort의 실제시간/메모를 그대로 반환한다")
        void 기본값조회_OK() {
            Long recruitId = 4L; // escort.status = WRITING_REPORT, memo 존재

            ReportDefaultValueResponse resp = reportFacadeService.getReportDefaultValue(recruitId);

            assertThat(resp).isNotNull();
            assertThat(resp.getActualMeetingTime()).isNull();
            assertThat(resp.getActualReturnTime()).isNull();
            assertThat(resp.getMemo()).isEqualTo("교통체증으로 복귀가 조금 늦었습니다.");
        }
    }

    @Nested
    @DisplayName("리포트 생성")
    class CreateReport {

        @Test
        @DisplayName("WRITING_REPORT 이고 기존 리포트 없으면 생성 성공 + 연관데이터 저장")
        void 생성_OK() {
            Long recruitId = 9L; // escort.status=WRITING_REPORT, report 미존재

            long beforeReportCount = reportJpaRepository.count();

            ReportCreateRequest req = createRequest(
                LocalTime.of(11, 5),
                LocalTime.of(14, 50),
                true,
                LocalDateTime.of(2025, 8, 30, 10, 0),
                "진료 결과 양호, 복귀 중 안전 확인",
                List.of(
                    image("uploads/report/new-1.png", "image/png", 111_111, "\"etag-new-1\""),
                    image("uploads/report/new-2.png", "image/png", 222_222, "\"etag-new-2\"")
                ),
                8_900, image("uploads/taxi/new-dep.png", "image/png", 12_345, "\"etag-td\""),
                9_300, image("uploads/taxi/new-ret.png", "image/png", 23_456, "\"etag-tr\"")
            );

            reportFacadeService.createReport(req, recruitId);

            // 1) Report가 새로 생겼는지
            assertThat(reportJpaRepository.count() - beforeReportCount).isEqualTo(1);

            Report saved = reportJpaRepository.findByRecruitId(recruitId)
                .orElseThrow(() -> new AssertionError("Report should be created"));

            // 2) 본문 필드 반영
            assertThat(saved.getActualMeetingTime()).isEqualTo(LocalTime.of(11, 5));
            assertThat(saved.getActualReturnTime()).isEqualTo(LocalTime.of(14, 50));
            assertThat(saved.getDescription()).isEqualTo("진료 결과 양호, 복귀 중 안전 확인");

            // 3) 택시 요금(1건) + 영수증 이미지 연계 검증
            TaxiFee tf = taxiFeeJpaRepository.findByReportId(saved.getId())
                .orElseThrow(() -> new AssertionError("TaxiFee should be created"));
            assertThat(tf.getDepartureFee()).isEqualTo(8_900);
            assertThat(tf.getReturnFee()).isEqualTo(9_300);
            assertThat(tf.getDepartureReceiptImage()).isNotNull();
            assertThat(tf.getReturnReceiptImage()).isNotNull();

            // 4) 첨부 이미지 2장 매핑
            long afterAttachCount = imageAttachmentJpaRepository.countByReportId(saved.getId());
            assertThat(afterAttachCount).isEqualTo(2);

            // 5) escort 상태가 DONE으로 변경
            assertThat(escortService.getByRecruitId(recruitId).getStatus())
                .isEqualTo(EscortStatus.DONE);
        }

        @Test
        @DisplayName("이미 리포트가 있으면 ReportAlreadyWrittenException")
        void 생성_중복리포트_예외() {
            Long recruitId = 2L; // report 존재
            ReportCreateRequest req = minimalRequest();

            assertThatThrownBy(() -> reportFacadeService.createReport(req, recruitId))
                .isInstanceOf(ReportAlreadyWrittenException.class);
        }

        @Test
        @DisplayName("escort 상태가 WRITING_REPORT가 아니면 ReportNotReadyToWriteException")
        void 생성_상태부적합_예외() {
            Long recruitId = 8L; // escort.status = PREPARING
            ReportCreateRequest req = minimalRequest();

            assertThatThrownBy(() -> reportFacadeService.createReport(req, recruitId))
                .isInstanceOf(ReportNotReadyToWriteException.class);
        }

        private ReportCreateRequest minimalRequest() {
            return createRequest(
                LocalTime.of(10, 0),
                LocalTime.of(12, 0),
                false,
                null,
                "테스트 리포트",
                List.of(image("uploads/report/min-1.png", "image/png", 1_000, "\"etag-m1\"")),
                1_000, image("uploads/taxi/min-dep.png", "image/png", 100, "\"etag-md\""),
                2_000, image("uploads/taxi/min-ret.png", "image/png", 200, "\"etag-mr\"")
            );
        }

        private ReportCreateRequest createRequest(
            LocalTime actualMeetingTime,
            LocalTime actualReturnTime,
            boolean hasNextAppt,
            LocalDateTime nextApptTime,
            String description,
            List<ImageCreateRequest> attachments,
            Integer depFee, ImageCreateRequest depReceipt,
            Integer retFee, ImageCreateRequest retReceipt
        ) {
            var req = new ReportCreateRequest();

            ReflectionTestUtils.setField(req, "actualMeetingTime", actualMeetingTime);
            ReflectionTestUtils.setField(req, "actualReturnTime", actualReturnTime);
            ReflectionTestUtils.setField(req, "hasNextAppointment", hasNextAppt);
            ReflectionTestUtils.setField(req, "nextAppointmentTime", nextApptTime);
            ReflectionTestUtils.setField(req, "description", description);
            ReflectionTestUtils.setField(req, "imageCreateRequestList", attachments);

            var taxiReq = new TaxiFeeCreateRequest();
            ReflectionTestUtils.setField(taxiReq, "departureFee", depFee);
            ReflectionTestUtils.setField(taxiReq, "returnFee", retFee);
            ReflectionTestUtils.setField(taxiReq, "departureReceipt", depReceipt);
            ReflectionTestUtils.setField(taxiReq, "returnReceipt", retReceipt);
            ReflectionTestUtils.setField(req, "taxiFeeCreateRequest", taxiReq);

            return req;
        }

        private ImageCreateRequest image(String key, String contentType, long size, String checksum) {
            var dto = new ImageCreateRequest();
            ReflectionTestUtils.setField(dto, "s3Key", key);
            ReflectionTestUtils.setField(dto, "contentType", contentType);
            ReflectionTestUtils.setField(dto, "size", size);
            ReflectionTestUtils.setField(dto, "checksum", checksum);
            return dto;
        }
    }
}
