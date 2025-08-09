package com.todoc.server.domain.escort.service;

import com.todoc.server.common.enumeration.ApplicationStatus;
import com.todoc.server.common.enumeration.RecruitStatus;
import com.todoc.server.domain.escort.entity.Application;
import com.todoc.server.domain.escort.entity.Escort;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.exception.ApplicationInvalidSelectException;
import com.todoc.server.domain.escort.exception.RecruitNotFoundException;
import com.todoc.server.domain.escort.web.dto.response.ApplicationListResponse;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;

@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE) // 실제 DB 사용 시
@Transactional
@ActiveProfiles("test")
@Sql("/sql/data.sql")
public class ApplicationIntegrationTest {

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private EscortService escortService;

    @Autowired
    private RecruitService recruitService;

    @Autowired
    private ApplicationFacadeService applicationFacadeService;

    @PersistenceContext
    private EntityManager em;

    @Test
    @DisplayName("동행 신청에 대한 지원 목록 조회 - 정상")
    void getApplicationListByRecruitId_정상() {
        // given
        Long recruitId = 7L;

        // when
        ApplicationListResponse response = applicationFacadeService.getApplicationListByRecruitId(recruitId);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getApplicationList().size()).isEqualTo(3);
        assertThat(response.getApplicationList().getFirst().getHelper().getName()).isEqualTo("김민수");
    }

    @Test
    @DisplayName("동행 신청에 대한 지원 목록 조회 - 존재하지 않는 신청")
    void getApplicationListByRecruitId_존재하지않는신청() {
        // given
        Long recruitId = 999L;

        // when & then
        assertThatThrownBy(() -> applicationFacadeService.getApplicationListByRecruitId(recruitId))
                .isInstanceOf(RecruitNotFoundException.class);
    }

    @Test
    @DisplayName("지원 선택 - 정상 케이스")
    void selectApplication_정상() {
        // given
        Long targetApplicationId = 13L;

        // when
        applicationFacadeService.selectApplication(targetApplicationId);

        // then
        List<Application> applications = applicationService.getApplicationsInSameRecruit(targetApplicationId);
        Recruit recruit = applications.getFirst().getRecruit();

        // 선택된 지원이 MATCHED 되었는지 확인
        Application matched = applications.stream()
                .filter(a -> a.getId().equals(targetApplicationId))
                .findFirst()
                .orElseThrow();
        assertThat(matched.getStatus()).isEqualTo(ApplicationStatus.MATCHED);

        // 나머지는 FAILED 되었는지 확인
        applications.stream()
                .filter(a -> !a.getId().equals(targetApplicationId))
                .forEach(a -> assertThat(a.getStatus()).isEqualTo(ApplicationStatus.FAILED));

        // recruit 상태가 COMPLETED로 바뀌었는지 확인
        Recruit updatedRecruit = recruitService.getRecruitById(recruit.getId());
        assertThat(updatedRecruit.getStatus()).isEqualTo(RecruitStatus.COMPLETED);

        // escort 생성 여부 확인
        Escort escort = escortService.getByRecruitId(recruit.getId());
        assertThat(escort.getRecruit().getId()).isEqualTo(recruit.getId());
        assertThat(escort.getCustomer()).isEqualTo(recruit.getCustomer());
        assertThat(escort.getHelper()).isEqualTo(matched.getHelper());
    }

    // 예외 케이스: 이미 매칭된 지원 선택 시
    @Test
    @DisplayName("지원 선택 - 이미 매칭된 지원 선택 시 예외")
    void selectApplication_이미매칭된지원() {
        // given
        Long alreadyMatchedApplicationId = 1L;

        // when & then
        assertThatThrownBy(() ->
                applicationFacadeService.selectApplication(alreadyMatchedApplicationId))
                .isInstanceOf(ApplicationInvalidSelectException.class);
    }
}
