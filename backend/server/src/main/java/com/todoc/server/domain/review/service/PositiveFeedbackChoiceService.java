package com.todoc.server.domain.review.service;

import com.todoc.server.domain.review.entity.PositiveFeedback;
import com.todoc.server.domain.review.entity.PositiveFeedbackChoice;
import com.todoc.server.domain.review.entity.Review;
import com.todoc.server.domain.review.repository.PositiveFeedbackChoiceJpaRepository;
import com.todoc.server.domain.review.repository.PositiveFeedbackChoiceQueryRepository;
import com.todoc.server.domain.review.web.dto.response.PositiveFeedbackStatResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PositiveFeedbackChoiceService {

    private final PositiveFeedbackChoiceQueryRepository positiveFeedbackChoiceQueryRepository;
    private final PositiveFeedbackChoiceJpaRepository positiveFeedbackChoiceJpaRepository;

    /**
     * userId(authId)에 해당하는 도우미의 리뷰 좋았던점 통계를 조회하는 함수
     *
     * @param userId (authId)
     * @return List<PositiveFeedbackStatResponse>
     */
    @Transactional(readOnly = true)
    public List<PositiveFeedbackStatResponse> getPositiveFeedbackStatByHelperUserId(Long userId) {
        return positiveFeedbackChoiceQueryRepository.findPositiveFeedbackStatByHelperUserId(userId);
    }

    public PositiveFeedbackChoice register(PositiveFeedback positiveFeedback, Review review) {

        PositiveFeedbackChoice positiveFeedbackChoice = PositiveFeedbackChoice.builder()
                .positiveFeedback(positiveFeedback)
                .review(review)
                .build();

        return positiveFeedbackChoiceJpaRepository.save(positiveFeedbackChoice);
    }
}
