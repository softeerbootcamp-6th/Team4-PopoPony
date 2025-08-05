package com.todoc.server.domain.escort.service;

import com.todoc.server.common.enumeration.Gender;
import com.todoc.server.domain.auth.entity.Auth;
import com.todoc.server.domain.escort.entity.Application;
import com.todoc.server.domain.helper.entity.Helper;
import com.todoc.server.domain.helper.service.CertificateService;
import com.todoc.server.domain.helper.service.HelperService;
import com.todoc.server.domain.escort.web.dto.response.ApplicationListResponse;
import com.todoc.server.domain.escort.web.dto.response.ApplicationSimpleResponse;
import com.todoc.server.domain.helper.web.dto.response.HelperSimpleResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApplicationFacadeServiceTest {

    @Mock
    private ApplicationService applicationService;

    @Mock
    private HelperService helperService;

    @Mock
    private CertificateService certificateService;

    @InjectMocks
    private ApplicationFacadeService applicationFacadeService;

    private Auth auth;
    private Helper helper;
    private Application application;

    @BeforeEach
    void setUp() {
        auth = new Auth();
        auth.setId(1L);
        auth.setName("도우미");
        auth.setGender(Gender.FEMALE);
        auth.setBirthDate(LocalDate.of(1990, 1, 1));

        helper = new Helper();
        helper.setId(10L);
        helper.setAuth(auth);
        helper.setImageUrl("https://example.com/image.jpg");
        helper.setStrength("[\"친절함\", \"성실함\"]");

        application = new Application();
        application.setId(100L);
        application.setHelper(auth);
    }

    @Test
    @DisplayName("동행 신청 ID로 지원 목록 조회하기")
    void getApplicationListByRecruitId() {
        // given
        when(applicationService.getApplicationListByRecruitId(1L)).thenReturn(List.of(application));
        when(helperService.getHelperByUserId(1L)).thenReturn(helper);
        when(certificateService.getHelperByUserId(10L)).thenReturn(List.of("간호조무사"));

        // when
        ApplicationListResponse result = applicationFacadeService.getApplicationListByRecruitId(1L);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getApplicationList()).hasSize(1);

        ApplicationSimpleResponse appResp = result.getApplicationList().get(0);
        HelperSimpleResponse helperResp = appResp.getHelper();

        assertThat(appResp.getApplicationId()).isEqualTo(100L);
        assertThat(helperResp.getHelperId()).isEqualTo(10L);
        assertThat(helperResp.getName()).isEqualTo("도우미");
        assertThat(helperResp.getGender()).isEqualTo(Gender.FEMALE);
        assertThat(helperResp.getImageUrl()).isEqualTo("https://example.com/image.jpg");
        assertThat(helperResp.getStrengthList()).isEqualTo(List.of("친절함", "성실함"));
        assertThat(helperResp.getCertificateList()).isEqualTo(List.of("간호조무사"));

        // verify
        verify(applicationService).getApplicationListByRecruitId(1L);
        verify(helperService).getHelperByUserId(1L);
        verify(certificateService).getHelperByUserId(10L);
    }
}