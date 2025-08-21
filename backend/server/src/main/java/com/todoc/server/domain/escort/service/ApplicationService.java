package com.todoc.server.domain.escort.service;

import com.querydsl.core.Tuple;
import com.todoc.server.domain.escort.entity.Application;
import com.todoc.server.domain.escort.exception.ApplicationNotFoundException;
import com.todoc.server.domain.escort.repository.ApplicationJpaRepository;
import com.todoc.server.domain.escort.repository.ApplicationQueryRepository;
import com.todoc.server.domain.escort.repository.dto.ApplicationFlatDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.todoc.server.domain.escort.entity.QApplication.application;

@Service
@RequiredArgsConstructor
@Transactional
public class ApplicationService {

    private final ApplicationQueryRepository applicationQueryRepository;
    private final ApplicationJpaRepository applicationJpaRepository;

    @Transactional(readOnly = true)
    public Map<Long, List<ApplicationFlatDto>> getApplicationListByRecruitId(Long recruitId) {
        return groupByApplicationId(applicationQueryRepository.findApplicationWithHelperByRecruitId(recruitId));
    }

    public Map<Long, List<ApplicationFlatDto>> groupByApplicationId(List<ApplicationFlatDto> applicationFlatDtoList) {
        return applicationFlatDtoList.stream()
                .collect(Collectors.groupingBy(a -> a.getApplicationId()));
    }

    @Transactional
    public List<Application> getApplicationsInSameRecruit(Long applicationId) {
        return applicationQueryRepository.findAllApplicationsOfRecruitByApplicationId(applicationId);
    }

    public Application getMatchedApplicationByRecruitId(Long recruitId) {
        return applicationQueryRepository.findMatchedApplicationByRecruitId(recruitId)
                .orElseThrow(ApplicationNotFoundException::new);
    }
  
    public Application save(Application application) {
        return applicationJpaRepository.save(application);
    }

    public Application getApplicationById(Long applicationId) {
        return applicationJpaRepository.findById(applicationId)
            .orElseThrow(ApplicationNotFoundException::new);
    }
}
