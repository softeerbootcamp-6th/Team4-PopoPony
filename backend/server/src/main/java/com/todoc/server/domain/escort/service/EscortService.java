package com.todoc.server.domain.escort.service;

import com.todoc.server.domain.escort.entity.Escort;
import com.todoc.server.domain.escort.repository.EscortJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class EscortService {

    private final EscortJpaRepository escortJpaRepository;

    @Transactional(readOnly = true)
    public Long getCountByHelperUserId(Long helperId) {
        return escortJpaRepository.countByHelperId(helperId);
    }

    @Transactional
    public void save(Escort escort) {
        escortJpaRepository.save(escort);
    }
}
