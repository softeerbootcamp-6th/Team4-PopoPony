package com.todoc.server.domain.escort.service.escort;

import com.todoc.server.domain.auth.entity.Auth;
import com.todoc.server.domain.auth.exception.AuthNotFoundException;
import com.todoc.server.domain.customer.entity.Patient;
import com.todoc.server.domain.customer.exception.PatientNotFoundException;
import com.todoc.server.domain.escort.entity.Escort;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.exception.RecruitNotFoundException;
import com.todoc.server.domain.escort.service.EscortFacadeService;
import com.todoc.server.domain.escort.service.EscortService;
import com.todoc.server.domain.helper.service.HelperService;
import com.todoc.server.domain.route.exception.RouteNotFoundException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EscortFacadeServiceTest {

    @Mock
    private EscortService escortService;

    @Mock
    private HelperService helperService;

    @InjectMocks
    private EscortFacadeService escortFacadeService;

    @Nested
    @DisplayName("getEscortDetailByRecruitId")
    class GetEscortDetailByRecruitId {

        @Test
        void getEscortDetailByRecruitId_Recruit없으면_예외() {
            // given
            Long recruitId = 10L;
            Escort escort = mock(Escort.class);
            when(escort.getRecruit()).thenReturn(null);
            when(escortService.getEscortWithDetailByRecruitId(recruitId)).thenReturn(escort);

            // when // then
            assertThatThrownBy(() -> escortFacadeService.getEscortDetailByRecruitId(recruitId))
                .isInstanceOf(RecruitNotFoundException.class);
        }

        @Test
        void getEscortDetailByRecruitId_Customer없으면_예외() {
            // given
            Long recruitId = 10L;
            Escort escort = mock(Escort.class);
            Recruit recruit = mock(Recruit.class);

            when(escort.getRecruit()).thenReturn(recruit);
            when(recruit.getCustomer()).thenReturn(null);
            when(escortService.getEscortWithDetailByRecruitId(recruitId)).thenReturn(escort);

            // when // then
            assertThatThrownBy(() -> escortFacadeService.getEscortDetailByRecruitId(recruitId))
                .isInstanceOf(AuthNotFoundException.class);
        }

        @Test
        void getEscortDetailByRecruitId_Patient없으면_예외() {
            // given
            Long recruitId = 10L;
            Escort escort = mock(Escort.class);
            Recruit recruit = mock(Recruit.class);
            Auth customer = mock(Auth.class);

            when(escort.getRecruit()).thenReturn(recruit);
            when(recruit.getCustomer()).thenReturn(customer);
            when(recruit.getPatient()).thenReturn(null);
            when(escortService.getEscortWithDetailByRecruitId(recruitId)).thenReturn(escort);

            // when // then
            assertThatThrownBy(() -> escortFacadeService.getEscortDetailByRecruitId(recruitId))
                .isInstanceOf(PatientNotFoundException.class);
        }

        @Test
        void getEscortDetailByRecruitId_Route없으면_예외() {
            // given
            Long recruitId = 10L;
            Escort escort = mock(Escort.class);
            Recruit recruit = mock(Recruit.class);
            Auth customer = mock(Auth.class);
            Patient patient = mock(Patient.class);

            when(escort.getRecruit()).thenReturn(recruit);
            when(recruit.getCustomer()).thenReturn(customer);
            when(recruit.getPatient()).thenReturn(patient);
            when(recruit.getRoute()).thenReturn(null);
            when(escortService.getEscortWithDetailByRecruitId(recruitId)).thenReturn(escort);

            // when // then
            assertThatThrownBy(() -> escortFacadeService.getEscortDetailByRecruitId(recruitId))
                .isInstanceOf(RouteNotFoundException.class);
        }
    }
}