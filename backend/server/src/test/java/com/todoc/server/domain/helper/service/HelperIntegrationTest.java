package com.todoc.server.domain.helper.service;

import com.todoc.server.domain.helper.exception.HelperProfileNotFoundException;
import com.todoc.server.domain.helper.web.dto.response.HelperDetailResponse;
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

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;

@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE) // 실제 DB 사용 시
@Transactional
@ActiveProfiles("test")
@Sql("/sql/data.sql")
public class HelperIntegrationTest {

    @Autowired
    private HelperFacadeService helperFacadeService;

    @PersistenceContext
    private EntityManager em;

    // TODO :: 주석 해제하기
//    @Test
//    @DisplayName("도우미 상세 정보 조회 - 정상")
//    void getHelperDetailByHelperProfileId_정상() {
//        // given
//        Long helperProfileId = 4L;
//
//        // when
//        HelperDetailResponse response = helperFacadeService.getHelperDetailByHelperProfileId(helperProfileId);
//
//        // then
//        assertThat(response).isNotNull();
//        assertThat(response.getHelperSimple().getName()).isEqualTo("최유진");
//        assertThat(response.getReviewStat().getGoodRate()).isEqualTo(100);
//        assertThat(response.getPositiveFeedbackStatList().size()).isEqualTo(3);
//        assertThat(response.getLatestReviewList().getFirst().getShortComment()).isEqualTo("말벗도 되어주셔서 감사했어요.");
//        assertThat(response.getLatestReviewList().getFirst().getSatisfactionLevel()).isEqualTo("좋았어요");
//        assertThat(response.getEscortCount()).isEqualTo(2);
//    }

    @Test
    @DisplayName("도우미 상세 정보 조회 - 존재하지 않는 도우미")
    void getHelperDetailByHelperProfileId_존재하지않는도우미() {
        // given
        Long helperProfileId = 999L;

        // when & then
        assertThatThrownBy(() -> helperFacadeService.getHelperDetailByHelperProfileId(helperProfileId))
                .isInstanceOf(HelperProfileNotFoundException.class);
    }
}
