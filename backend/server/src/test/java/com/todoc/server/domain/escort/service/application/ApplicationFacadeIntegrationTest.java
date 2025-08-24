package com.todoc.server.domain.escort.service.application;

import com.todoc.server.IntegrationTest;
import com.todoc.server.common.enumeration.ApplicationStatus;
import com.todoc.server.common.enumeration.EscortStatus;
import com.todoc.server.common.enumeration.RecruitStatus;
import com.todoc.server.domain.auth.service.AuthService;
import com.todoc.server.domain.escort.entity.Application;
import com.todoc.server.domain.escort.entity.Escort;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.exception.ApplicationInvalidSelectException;
import com.todoc.server.domain.escort.exception.ApplicationNotFoundException;
import com.todoc.server.domain.escort.exception.RecruitNotFoundException;
import com.todoc.server.domain.escort.service.ApplicationFacadeService;
import com.todoc.server.domain.escort.service.ApplicationService;
import com.todoc.server.domain.escort.service.EscortService;
import com.todoc.server.domain.escort.service.RecruitService;
import com.todoc.server.domain.escort.web.dto.response.ApplicationListResponse;
import com.todoc.server.domain.helper.service.HelperService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import java.util.List;

import static org.assertj.core.api.Assertions.*;

@Sql("/sql/data.sql")
public class ApplicationFacadeIntegrationTest extends IntegrationTest {

    @Autowired private ApplicationFacadeService applicationFacadeService;

    @Autowired private ApplicationService applicationService;
    @Autowired private HelperService helperService;
    @Autowired private EscortService escortService;
    @Autowired private RecruitService recruitService;
    @Autowired private AuthService authService;

    @PersistenceContext
    private EntityManager em;

    @Nested
    @DisplayName("getApplicationListByRecruitId")
    class GetApplicationListByRecruitId {

        @Test
        void getApplicationListByRecruitId_정상() {
            // given
            Long recruitId = 7L;

            // when
            ApplicationListResponse response = applicationFacadeService.getApplicationListByRecruitId(recruitId);

            // then
            assertThat(response).isNotNull();
            assertThat(response.getApplicationList()).hasSize(3);
            assertThat(response.getApplicationList())
                    .extracting(r -> r.getHelper().getName())
                    .containsAll(List.of("정우성", "이서연", "김민수"));
        }

        @Test
        void getApplicationListByRecruitId_존재하지않는신청_예외() {
            // given
            Long recruitId = 999L;

            // when & then
            assertThatThrownBy(() -> applicationFacadeService.getApplicationListByRecruitId(recruitId))
                    .isInstanceOf(RecruitNotFoundException.class);
        }
    }

    @Nested
    @DisplayName("selectApplication")
    class SelectApplication {

        @Test
        void selectApplication_정상() {
            // given
            Long targetApplicationId = 13L;

            // when
            applicationFacadeService.selectApplication(targetApplicationId);
            em.flush(); em.clear(); // 상태 기반 검증 위해 1차 캐시 비움

            // then
            List<Application> applications = applicationService.getApplicationsInSameRecruit(targetApplicationId);
            assertThat(applications).isNotEmpty();

            // 선택된 지원
            Application matched = applications.stream()
                    .filter(a -> a.getId().equals(targetApplicationId))
                    .findFirst()
                    .orElseThrow();

            assertThat(matched.getStatus()).isEqualTo(ApplicationStatus.MATCHED);

            // 나머지 지원: FAILED + soft delete 되었는지
            applications.stream()
                    .filter(a -> !a.getId().equals(targetApplicationId))
                    .forEach(a -> {
                        assertThat(a.getStatus()).isEqualTo(ApplicationStatus.FAILED);
                        assertThat(a.getDeletedAt()).isNotNull();
                    });

            // recruit 상태가 COMPLETED 로 변경
            Long recruitId = matched.getRecruit().getId();
            Recruit updatedRecruit = recruitService.getRecruitById(recruitId);
            assertThat(updatedRecruit.getStatus()).isEqualTo(RecruitStatus.COMPLETED);

            // escort 생성 및 필드 매핑 확인
            Escort escort = escortService.getByRecruitId(recruitId);
            assertThat(escort.getRecruit().getId()).isEqualTo(recruitId);
            assertThat(escort.getCustomer()).isEqualTo(updatedRecruit.getCustomer());
            assertThat(escort.getHelper()).isEqualTo(matched.getHelper());
            assertThat(escort.getStatus()).isEqualTo(EscortStatus.PREPARING);
        }

        @Test
        void selectApplication_없는지원선택_예외() {
            // given
            Long notExistApplicationId = 555L;

            // when & then
            assertThatThrownBy(() -> applicationFacadeService.selectApplication(notExistApplicationId))
                    .isInstanceOf(ApplicationNotFoundException.class);
        }

        @Test
        void selectApplication_이미매칭된지원_예외() {
            // given
            Long alreadyMatchedApplicationId = 1L;

            // when & then
            assertThatThrownBy(() -> applicationFacadeService.selectApplication(alreadyMatchedApplicationId))
                    .isInstanceOf(ApplicationInvalidSelectException.class);
        }
    }
}
