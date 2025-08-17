package com.todoc.server.domain.route.service;

import com.todoc.server.domain.route.entity.RouteLeg;
import com.todoc.server.domain.route.repository.RouteLegRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RouteLegService {

    private final RouteLegRepository routeLegRepository;

    @Transactional
    public RouteLeg save(RouteLeg leg) {
        return routeLegRepository.save(leg);
    }

}
