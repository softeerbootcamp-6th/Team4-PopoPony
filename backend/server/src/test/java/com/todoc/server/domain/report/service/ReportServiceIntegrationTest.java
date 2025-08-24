package com.todoc.server.domain.report.service;

import com.todoc.server.IntegrationTest;
import com.todoc.server.common.dto.request.ImageCreateRequest;
import com.todoc.server.common.util.FeeUtils;
import com.todoc.server.domain.auth.entity.Auth;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.exception.EscortNotFoundException;
import com.todoc.server.domain.escort.repository.RecruitJpaRepository;
import com.todoc.server.domain.image.entity.ImageFile;
import com.todoc.server.domain.report.entity.ImageAttachment;
import com.todoc.server.domain.report.entity.Report;
import com.todoc.server.domain.report.entity.TaxiFee;
import com.todoc.server.domain.report.exception.ReportNotFoundException;
import com.todoc.server.domain.report.repository.ImageAttachmentJpaRepository;
import com.todoc.server.domain.report.repository.ReportJpaRepository;
import com.todoc.server.domain.report.repository.TaxiFeeJpaRepository;
import com.todoc.server.domain.report.web.dto.request.ReportCreateRequest;
import com.todoc.server.domain.report.web.dto.response.ReportDefaultValueResponse;
import com.todoc.server.domain.report.web.dto.response.ReportDetailResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
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
public class ReportServiceIntegrationTest extends IntegrationTest {

    @Autowired
    private ReportService reportService;

    @Autowired
    private ImageAttachmentService imageAttachmentService;

    @Autowired private ReportJpaRepository reportJpaRepository;
    @Autowired private TaxiFeeJpaRepository taxiFeeJpaRepository;
    @Autowired private ImageAttachmentJpaRepository imageAttachmentJpaRepository;
    @Autowired private RecruitJpaRepository recruitJpaRepository;

    @Nested
    @DisplayName("getReportDetailByRecruitId")
    class GetDetail {

        @Test
        @DisplayName("실제 시간이 더 길면 extraMinutes/extraTimeFee가 양수로 계산된다 (recruitId=1)")
        void detail_ok_actual_later() {
            Long recruitId = 1L;

            // when
            ReportDetailResponse resp = reportService.getReportDetailByRecruitId(recruitId);

            // then (기본 필드 검증)
            Report saved = reportJpaRepository.findByRecruitId(recruitId).orElseThrow();
            assertThat(resp.getReportId()).isEqualTo(saved.getId());
            assertThat(resp.getDescription()).isEqualTo(saved.getDescription());
            assertThat(resp.getActualMeetingTime()).isEqualTo(saved.getActualMeetingTime());
            assertThat(resp.getActualReturnTime()).isEqualTo(saved.getActualReturnTime());
            assertThat(resp.getHasNextAppointment()).isEqualTo(saved.getHasNextAppointment());
            assertThat(resp.getNextAppointmentTime()).isEqualTo(saved.getNextAppointmentTime());

            // 이미지 개수 검증 (URL 포맷은 서비스 유틸에 위임하므로 개수만)
            long attachCount = imageAttachmentJpaRepository.countByReportId(saved.getId());
            assertThat(resp.getImageAttachmentList()).hasSize((int) attachCount);

            // 택시요금 합계
            TaxiFee tf = taxiFeeJpaRepository.findByReportId(saved.getId()).orElseThrow();
            assertThat(resp.getTaxiFee()).isEqualTo(tf.getDepartureFee() + tf.getReturnFee());

            // baseFee / extraTimeFee 계산 검증 (FeeUtils 동일 로직 사용)
            Recruit recruit = recruitJpaRepository.findById(saved.getRecruit().getId()).orElseThrow();
            int expectedBase = FeeUtils.calculateTotalFee(recruit.getEstimatedMeetingTime(), recruit.getEstimatedReturnTime());
            int expectedActual = FeeUtils.calculateTotalFee(saved.getActualMeetingTime(), saved.getActualReturnTime());
            int expectedExtra = Math.max(expectedActual - expectedBase, 0);

            assertThat(resp.getBaseFee()).isEqualTo(expectedBase);
            assertThat(resp.getExtraTimeFee()).isEqualTo(expectedExtra);

            // extraMinutes (실측-예상)
            int expectedMinutes = Math.max(
                (int) java.time.Duration.between(saved.getActualMeetingTime(), saved.getActualReturnTime()).toMinutes()
                    - (int) java.time.Duration.between(recruit.getEstimatedMeetingTime(), recruit.getEstimatedReturnTime()).toMinutes(),
                0
            );
            assertThat(resp.getExtraMinutes()).isEqualTo(expectedMinutes);
        }

        @Test
        @DisplayName("실제 시간이 더 짧으면 extraMinutes/extraTimeFee는 0이 된다 (recruitId=3)")
        void detail_ok_actual_shorter_clamped_to_zero() {
            Long recruitId = 3L; // estimated: 08:00-10:30(150), actual: 09:40-11:40(120)

            ReportDetailResponse resp = reportService.getReportDetailByRecruitId(recruitId);

            assertThat(resp.getExtraMinutes()).isZero();
            assertThat(resp.getExtraTimeFee()).isZero();

            // 나머지 기본 필드/택시요금/이미지 개수 간단 검증
            Report saved = reportJpaRepository.findByRecruitId(recruitId).orElseThrow();
            TaxiFee tf = taxiFeeJpaRepository.findByReportId(saved.getId()).orElseThrow();
            long attachCount = imageAttachmentJpaRepository.countByReportId(saved.getId());

            assertThat(resp.getTaxiFee()).isEqualTo(tf.getDepartureFee() + tf.getReturnFee());
            assertThat(resp.getImageAttachmentList()).hasSize((int) attachCount);
        }

        @Test
        @DisplayName("존재하지 않을 경우 빈 ResponseDTo를 반환한다")
        void detail_if_not_exist_throw_empty_response() {
            Long recruitId = 999L;

            ReportDetailResponse response = reportService.getReportDetailByRecruitId(recruitId);

            assertThat(response.getReportId()).isEqualTo(0L);
        }
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
