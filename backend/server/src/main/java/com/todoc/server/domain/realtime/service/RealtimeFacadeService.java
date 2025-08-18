package com.todoc.server.domain.realtime.service;

import com.todoc.server.common.enumeration.EscortStatus;
import com.todoc.server.common.enumeration.Role;
import com.todoc.server.domain.escort.service.EscortService;
import com.todoc.server.domain.realtime.exception.RealtimeAlreadyMetPatientException;
import com.todoc.server.domain.realtime.exception.RealtimeInvalidRoleException;
import com.todoc.server.domain.realtime.web.dto.request.LocationRequest;
import com.todoc.server.domain.realtime.web.dto.response.LocationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.Instant;
import java.util.Objects;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class RealtimeFacadeService {

    private final LocationService locationService;
    private final SseEmitterManager emitterManager;
    private final EscortService escortService;

    /**
     * Escort에 대해 새로운 SseEmitter를 등록
     */
    public SseEmitter registerEmitter(Long escortId, String roleString) {

        Role role = getRole(roleString);

        if (role == Role.PATIENT) {
            EscortStatus escortStatus = escortService.getById(escortId).getStatus();
            if (escortStatus != EscortStatus.MEETING) {
                throw new RealtimeAlreadyMetPatientException();
            }
        }

        SseEmitter emitter = emitterManager.register(escortId, role);

        // 연결 직후 스냅샷 전송
        try {
            switch (role) {
                case CUSTOMER -> {
                    getLocationSnapshot(escortId, Role.HELPER, emitter);
                    getLocationSnapshot(escortId, Role.PATIENT, emitter);
                }
                case PATIENT -> {
                    getLocationSnapshot(escortId, Role.HELPER, emitter);
                }
                case HELPER -> {
                    getLocationSnapshot(escortId, Role.PATIENT, emitter);
                }
            }
        } catch (Exception e) {
            emitter.completeWithError(e);
        }
        return emitter;
    }

    /**
     * Escort의 도우미의 최근 위치 정보를 갱신
     */
    public void updateLocation(Long escortId, String roleString, LocationRequest request) {

        Role role = getRole(roleString);

        if (role == Role.CUSTOMER) return;

        Instant timestamp = Instant.now();
        LocationResponse location = LocationResponse.builder()
                .escortId(escortId)
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .timestamp(timestamp)
                .build();

        Set<Role> roleSet = role == Role.HELPER ? Role.TO_CUSTOMER_AND_PATIENT : Role.TO_CUSTOMER_AND_HELPER;
        emitterManager.send(escortId, roleSet, role.getLabel() + "-location", location);

        locationService.register(escortId, role, request, timestamp);
    }

    private Role getRole(String roleString) {
        return Role.from(roleString.toLowerCase())
                .orElseThrow(RealtimeInvalidRoleException::new);
    }

    private void getLocationSnapshot(Long escortId, Role role, SseEmitter emitter) throws IOException {
        LocationResponse latestLocation = locationService.getLatestLocation(escortId, role);
        emitter.send(SseEmitter.event()
                .name(role.getLabel() + "-location")
                .data(Objects.requireNonNullElse(latestLocation, "NO_LOCATION")));
    }
}
