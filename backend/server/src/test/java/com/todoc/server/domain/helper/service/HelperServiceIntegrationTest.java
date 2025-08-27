package com.todoc.server.domain.helper.service;

import com.todoc.server.IntegrationTest;
import com.todoc.server.common.enumeration.Area;
import com.todoc.server.domain.helper.entity.HelperProfile;
import com.todoc.server.domain.helper.exception.HelperProfileNotFoundException;
import com.todoc.server.domain.helper.web.dto.response.HelperProfileExistenceResponse;
import com.todoc.server.domain.helper.web.dto.response.HelperSimpleResponse;
import com.todoc.server.domain.helper.web.dto.response.HelperUpdateDefaultResponse;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.*;

@Transactional
public class HelperServiceIntegrationTest extends IntegrationTest {

    @Autowired
    private HelperService helperService;

    @PersistenceContext
    private EntityManager em;

    private static final Long HELPER_PROFILE_ID = 1L;
    private static final Long NON_EXIST_ID = 99999L;

    @Nested
    class GetHelperSimple {

        @Test
        void getHelperSimpleByHelperProfileId_정상조회() {
            // when
            HelperSimpleResponse response = helperService.getHelperSimpleByHelperProfileId(HELPER_PROFILE_ID);

            // then
            assertThat(response).isNotNull();
            assertThat(response.getHelperProfileId()).isEqualTo(HELPER_PROFILE_ID);
            assertThat(response.getName()).isNotBlank();
            assertThat(response.getCertificateList()).isNotEmpty();
            assertThat(response.getStrengthList()).contains("안전한 부축");
        }

        @Test
        void getHelperSimpleByHelperProfileId_없으면_예외() {
            // expect
            assertThatThrownBy(() -> helperService.getHelperSimpleByHelperProfileId(NON_EXIST_ID))
                .isInstanceOf(HelperProfileNotFoundException.class);
        }
    }

    @Nested
    class GetHelperUpdateDefault {

        @Test
        void getHelperUpdateDefaultByHelperProfileId_정상조회() {
            // when
            HelperUpdateDefaultResponse response =
                helperService.getHelperUpdateDefaultByHelperProfileId(HELPER_PROFILE_ID);

            // then
            assertThat(response).isNotNull();
            assertThat(response.getShortBio()).isNotBlank();
            assertThat(response.getStrengthList()).isNotEmpty();
            assertThat(response.getCertificateInfoList()).isNotEmpty();
            assertThat(response.getImageUrl()).contains("/api/images/");
        }

        @Test
        void getHelperUpdateDefaultByHelperProfileId_없으면_예외() {
            assertThatThrownBy(() -> helperService.getHelperUpdateDefaultByHelperProfileId(NON_EXIST_ID))
                .isInstanceOf(HelperProfileNotFoundException.class);
        }
    }

    @Nested
    class CheckHelperProfileExistence {

        @Test
        void checkHelperProfileExistence_존재함() {
            // given
            Long authId = 1L;

            // when
            HelperProfileExistenceResponse response = helperService.checkHelperProfileExistence(authId);

            // then
            assertThat(response.isHasProfile()).isTrue();
            assertThat(response.getHelperProfileId()).isEqualTo(HELPER_PROFILE_ID);
        }

        @Test
        void checkHelperProfileExistence_없음() {
            // given
            Long authId = 99999L;

            // when
            HelperProfileExistenceResponse response = helperService.checkHelperProfileExistence(authId);

            // then
            assertThat(response.isHasProfile()).isFalse();
            assertThat(response.getHelperProfileId()).isNull();
        }
    }

    @Nested
    class GetHelperProfile {

        @Test
        void getHelperProfileById_정상조회() {
            // when
            HelperProfile profile = helperService.getHelperProfileById(HELPER_PROFILE_ID);

            // then
            assertThat(profile).isNotNull();
            assertThat(profile.getArea()).isEqualTo(Area.SEOUL);
        }

        @Test
        void getHelperProfileById_없으면_예외() {
            assertThatThrownBy(() -> helperService.getHelperProfileById(NON_EXIST_ID))
                .isInstanceOf(HelperProfileNotFoundException.class);
        }
    }

    @Nested
    class GetHelperByEscort {

        @Test
        void getHelperProfileByEscortId_정상조회() {
            // given escort.id=1 은 helper_id=1 과 매핑됨 (data.sql 참조)
            Long escortId = 1L;

            // when
            HelperProfile profile = helperService.getHelperProfileByEscortId(escortId);

            // then
            assertThat(profile).isNotNull();
            assertThat(profile.getId()).isEqualTo(1L);
        }

        @Test
        void getHelperProfileByEscortId_없으면_예외() {
            assertThatThrownBy(() -> helperService.getHelperProfileByEscortId(NON_EXIST_ID))
                .isInstanceOf(HelperProfileNotFoundException.class);
        }
    }
}
