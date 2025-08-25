package com.todoc.server.domain.escort.service.recruit;

import com.todoc.server.IntegrationTest;
import com.todoc.server.common.enumeration.RecruitStatus;
import com.todoc.server.common.util.FeeUtils;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.exception.RecruitInvalidCancelException;
import com.todoc.server.domain.escort.exception.RecruitNotFoundException;
import com.todoc.server.domain.escort.repository.RecruitJpaRepository;
import com.todoc.server.domain.escort.service.RecruitService;
import com.todoc.server.domain.escort.web.dto.response.RecruitDetailResponse;
import com.todoc.server.domain.escort.web.dto.response.RecruitListResponse;
import com.todoc.server.domain.escort.web.dto.response.RecruitPaymentResponse;
import com.todoc.server.domain.escort.web.dto.response.RecruitSimpleResponse;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.time.Duration;
import java.time.LocalTime;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.*;

@Transactional
public class RecruitServiceIntegrationTest extends IntegrationTest {

    @Autowired private RecruitService recruitService;
    @Autowired private RecruitJpaRepository recruitJpaRepository;

    @PersistenceContext
    private EntityManager em;

    @Nested
    @DisplayName("고객 홈 목록 정렬/분리")
    class CustomerHomeList {

        @Test
        @DisplayName("완료 목록은 동행일 내림차순")
        void 완료목록만_있는_경우() {
            // given
            Long userId = 1L; // recruit 1(DONE, 8/1), 6(DONE, 8/6)

            // when
            RecruitListResponse res = recruitService.getRecruitListAsCustomerByUserId(userId);

            // then
            assertThat(res.getInProgressList()).isEmpty();
            assertThat(res.getCompletedList())
                .extracting(RecruitSimpleResponse::getRecruitId)
                .containsExactly(6L, 1L); // 내림차순: 8/6, 8/1
        }

        @Test
        @DisplayName("진행 목록은 '동행중' 최상단, 이후 오름차순")
        void 진행중목록_완료목록_둘다_확인() {
            // given
            Long userId = 2L; //2DONE 7매칭 8 IN_PRO 11DONE 12COMPLETE

            // when
            RecruitListResponse res = recruitService.getRecruitListAsCustomerByUserId(userId);

            // then
            assertThat(res.getInProgressList())
                .extracting(RecruitSimpleResponse::getRecruitId)
                .containsExactly(8L, 7L, 12L);

            assertThat(res.getCompletedList())
                .extracting(RecruitSimpleResponse::getRecruitId)
                .containsExactly(11L, 2L); // 8/11, 8/2 내림차순
        }
    }

    @Nested
    @DisplayName("도우미 홈 목록 정렬/분리")
    class HelperHomeList {

        @Test
        @DisplayName("helper(authId)=1 → 진행중: (7), 완료: (5,1)")
        void 도우미목록_helper1() {
            // given
            Long helperUserId = 1L;
            // application 기준 helper_id=1 이 지원/매칭한 recruit: 1(MATCHED), 5(MATCHED), 7(PENDING)
            // recruit 상태: 1(DONE), 5(DONE) → 완료 / 7(MATCHING) → 진행중

            // when
            RecruitListResponse res = recruitService.getRecruitListAsHelperByUserId(helperUserId);

            // then
            assertThat(res.getInProgressList())
                .extracting(RecruitSimpleResponse::getRecruitId)
                .containsExactly(7L);

            assertThat(res.getCompletedList())
                .extracting(RecruitSimpleResponse::getRecruitId)
                .containsExactly(5L, 1L); // 8/5, 8/1 내림차순
        }
    }

    @Nested
    @DisplayName("상세/결제")
    class DetailAndPayment {

        @Test
        @DisplayName("상세 조회 recruitId=1 → 환자/경로 매핑 OK, 상태 라벨 DONE")
        void 상세조회_정상() {
            // given
            Long recruitId = 1L;

            // when
            RecruitDetailResponse res = recruitService.getRecruitDetailByRecruitId(recruitId);

            // then
            assertThat(res.getRecruitId()).isEqualTo(1L);
            assertThat(res.getPatient()).isNotNull();
            assertThat(res.getRoute()).isNotNull();
            assertThat(res.getStatus()).isEqualTo(RecruitStatus.DONE.getLabel());
        }

        @Test
        @DisplayName("상세 조회 recruitId=999 → RecruitNotFoundException")
        void 상세조회_없음() {
            assertThatThrownBy(() -> recruitService.getRecruitDetailByRecruitId(999L))
                .isInstanceOf(RecruitNotFoundException.class);
        }

        @Test
        @DisplayName("결제 조회 recruitId=5 → 총시간/기본요금/예상택시요금 계산")
        void 결제조회_정상() {
            // given
            Long recruitId = 5L; // 14:00~16:00, routeId=5 → legs 9(12000) + 10(15000)

            // when
            RecruitPaymentResponse res = recruitService.getRecruitPaymentByRecruitId(recruitId);

            // then
            long expectedMinutes = Duration.between(LocalTime.of(14,0), LocalTime.of(16,0)).toMinutes(); // 120
            int expectedBaseFee = FeeUtils.calculateTotalFee(LocalTime.of(14,0), LocalTime.of(16,0));
            int expectedTaxi = 12000 + 15000;

            assertThat(res.getTotalMinutes()).isEqualTo(expectedMinutes);
            assertThat(res.getBaseFee()).isEqualTo(expectedBaseFee);
            assertThat(res.getExpectedTaxiFee()).isEqualTo(expectedTaxi);
            assertThat(res.getRoute()).isNotNull();
        }

        @Test
        @DisplayName("결제 조회 recruitId=999 → RecruitNotFoundException")
        void 결제조회_없음() {
            assertThatThrownBy(() -> recruitService.getRecruitPaymentByRecruitId(999L))
                .isInstanceOf(RecruitNotFoundException.class);
        }
    }

    @Nested
    @DisplayName("취소/상태")
    class CancelAndStatus {

        @Test
        @DisplayName("cancelRecruit - soft delete 성공")
        void 취소_매칭중_OK() {
            // given
            Long recruitId = 7L;

            // when
            recruitService.cancelRecruit(recruitId);
            em.flush(); em.clear();

            // then
            Optional<Recruit> optional = recruitJpaRepository.findById(recruitId);
            assertThat(optional).isEmpty();
        }

        @Test
        @DisplayName("cancelRecruit - MATCHING이 아닌 경우 예외 처리")
        void 취소_진행중_예외() {
            assertThatThrownBy(() -> recruitService.cancelRecruit(8L))
                .isInstanceOf(RecruitInvalidCancelException.class);
        }

        @Test
        @DisplayName("getRecruitStatusByRecruitId - COMPLETED 라벨 반환")
        void 상태라벨_완료() {
            var res = recruitService.getRecruitStatusByRecruitId(9L);
            assertThat(res.getRecruitId()).isEqualTo(9L);
            assertThat(res.getRecruitStatus()).isEqualTo(RecruitStatus.COMPLETED.getLabel());
        }
    }
}
