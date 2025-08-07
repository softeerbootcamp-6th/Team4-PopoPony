package com.todoc.server.domain.review.entity;

import com.todoc.server.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLRestriction;

import java.util.Set;

@Entity
@Getter
@Setter
@SQLRestriction("deleted_at is NULL")
public class PositiveFeedback extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;

    public static boolean isValid(String description) {
        Set<String> validDescriptions = Set.of("친절해요", "책임감", "소통이 잘돼요", "능숙해요", "리포트가 자세해요", "부축을 잘해요", "진료 지식이 많아요", "휠체어도 문제 없어요");
        return validDescriptions.contains(description);
    }
}