package com.todoc.server.domain.escort.service;

import com.todoc.server.domain.escort.entity.Application;
import com.todoc.server.domain.escort.repository.ApplicationJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ApplicationService {

    private final ApplicationJpaRepository applicationJpaRepository;

    @Transactional(readOnly = true)
    public List<Application> getApplicationListByRecruitId(Long recruitId) {
        return applicationJpaRepository.findByRecruitId(recruitId);
    }
}
