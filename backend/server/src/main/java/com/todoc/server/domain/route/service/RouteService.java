package com.todoc.server.domain.route.service;

import com.todoc.server.domain.escort.web.dto.request.RecruitCreateRequest;
import com.todoc.server.domain.route.entity.Route;
import com.todoc.server.domain.route.repository.RouteRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class RouteService {

    private final RouteRepository routeRepository;

    public Route register(RecruitCreateRequest request) {

        // TODO 경로 API 호출 뒤 적용해야 함.
        Route route = Route.builder()
                .build();

        return routeRepository.save(route);
    }
}
