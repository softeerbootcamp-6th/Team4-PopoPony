package com.todoc.server.domain.review.service;

import com.todoc.server.domain.review.entity.PositiveFeedback;
import com.todoc.server.domain.review.repository.PositiveFeedbackJpaRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class PositiveFeedbackService {

    private final PositiveFeedbackJpaRepository positiveFeedbackJpaRepository;

    public List<PositiveFeedback> getAll() {
        return positiveFeedbackJpaRepository.findAll();
    }
}
