package com.todoc.server.domain.escort.service;

import com.todoc.server.IntegrationTest;
import com.todoc.server.domain.escort.entity.Application;
import com.todoc.server.domain.escort.exception.ApplicationNotFoundException;
import com.todoc.server.domain.escort.repository.dto.ApplicationFlatDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.*;

@Sql("/sql/data.sql")
public class ApplicationIntegrationTest extends IntegrationTest {

    @Autowired
    private ApplicationService applicationService;
    @Nested
    @DisplayName("getApplicationListByRecruitId")
    class GetApplicationListByRecruitId {

        @Test
        void getApplicationListByRecruitId_정상() {
            // given
            Long recruitId = 7L; // data.sql 기준, 지원 3명이 있는 recruit

            // when
            Map<Long, List<ApplicationFlatDto>> grouped =
                    applicationService.getApplicationListByRecruitId(recruitId);

            // then
            assertThat(grouped).isNotEmpty();
            assertThat(grouped.values().stream().flatMap(List::stream).toList())
                    .extracting(ApplicationFlatDto::getName)
                    .containsExactlyInAnyOrder("정우성", "이서연", "김민수");
        }

        @Test
        void getApplicationListByRecruitId_없는RecruitId() {
            // given
            Long recruitId = 999L;

            // when
            Map<Long, List<ApplicationFlatDto>> grouped = applicationService.getApplicationListByRecruitId(recruitId);

            // then
            assertThat(grouped).isEmpty();
        }
    }

    @Nested
    @DisplayName("getApplicationsInSameRecruit")
    class GetApplicationsInSameRecruit {

        @Test
        void getApplicationsInSameRecruit_정상() {
            // given
            Long applicationId = 13L; // recruit 7의 지원 중 하나

            // when
            List<Application> applications = applicationService.getApplicationsInSameRecruit(applicationId);

            // then
            assertThat(applications).isNotEmpty();
            assertThat(applications).allMatch(a -> a.getRecruit().getId().equals(7L));
        }

        @Test
        void getApplicationsInSameRecruit_없는Application_비어있음() {
            // given
            Long applicationId = 9999L;

            // when
            List<Application> applications =
                    applicationService.getApplicationsInSameRecruit(applicationId);

            // then
            assertThat(applications).isEmpty();
        }
    }

    @Nested
    @DisplayName("getMatchedApplicationByRecruitId")
    class GetMatchedApplicationByRecruitId {

        @Test
        void getMatchedApplicationByRecruitId_정상() {
            // given
            Long recruitId = 1L; // data.sql에서 이미 MATCHED된 recruit

            // when
            Application matched = applicationService.getMatchedApplicationByRecruitId(recruitId);

            // then
            assertThat(matched.getStatus().name()).isEqualTo("MATCHED");
        }

        @Test
        void getMatchedApplicationByRecruitId_신청이_없으면_예외() {
            // given
            Long recruitId = 999L;

            // when & then
            assertThatThrownBy(() -> applicationService.getMatchedApplicationByRecruitId(recruitId))
                    .isInstanceOf(ApplicationNotFoundException.class);
        }

        @Test
        void getMatchedApplicationByRecruitId_매칭된_지원이_없으면_예외() {
            // given
            Long recruitId = 7L; // 모든 application들이 PENDING상태

            // when & then
            assertThatThrownBy(() -> applicationService.getMatchedApplicationByRecruitId(recruitId))
                    .isInstanceOf(ApplicationNotFoundException.class);
        }
    }

    @Nested
    @DisplayName("getApplicationById / save")
    class SaveAndGetApplication {

        @Test
        void save_그리고_getApplicationById_정상() {
            // given
            Long existedApplicationId = 1L;

            // when
            Application found = applicationService.getApplicationById(existedApplicationId);

            // then
            assertThat(found.getId()).isEqualTo(existedApplicationId);
        }

        @Test
        void getApplicationById_없으면_예외() {
            // given
            Long applicationId = 9999L;

            // when & then
            assertThatThrownBy(() -> applicationService.getApplicationById(applicationId))
                    .isInstanceOf(ApplicationNotFoundException.class);
        }
    }
}
