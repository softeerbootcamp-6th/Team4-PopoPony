package com.todoc.server.domain.escort.service;

import com.querydsl.core.Tuple;
import com.todoc.server.common.enumeration.EscortStatus;
import com.todoc.server.common.enumeration.RecruitStatus;
import com.todoc.server.domain.escort.entity.Application;
import com.todoc.server.domain.escort.entity.Escort;
import com.todoc.server.domain.escort.entity.Recruit;
import com.todoc.server.domain.escort.exception.ApplicationNotFoundException;
import com.todoc.server.domain.escort.exception.RecruitNotFoundException;
import com.todoc.server.domain.escort.repository.ApplicationJpaRepository;
import com.todoc.server.domain.escort.repository.ApplicationQueryRepository;
import com.todoc.server.domain.report.exception.TaxiFeeNotFoundException;
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
    public Map<Long, List<Tuple>> getApplicationListByRecruitId(Long recruitId) {
        return groupByApplicationId(applicationQueryRepository.findApplicationWithHelperByRecruitId(recruitId));
    }

    public Map<Long, List<Tuple>> groupByApplicationId(List<Tuple> tuples) {
        return tuples.stream()
                .collect(Collectors.groupingBy(t -> t.get(application.id)));
    }

    @Transactional(readOnly = true)
    public Application getApplicationById(Long id) {
        return applicationJpaRepository.findById(id)
                .orElseThrow(ApplicationNotFoundException::new);
    }
}
