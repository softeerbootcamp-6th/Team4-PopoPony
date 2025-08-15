package com.todoc.server.domain.route.service;

import com.todoc.server.domain.escort.web.dto.request.RecruitCreateRequest;
import com.todoc.server.domain.route.entity.Route;
import com.todoc.server.domain.route.exception.RouteNotFoundException;
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

        Route route = Route.builder()
                .build();

        return routeRepository.save(route);
    }

    public Route getRouteById(Long routeId) {

        return routeRepository.findById(routeId)
                .orElseThrow(RouteNotFoundException::new);
    }
}
