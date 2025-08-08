    package com.todoc.server.domain.escort.repository;

    import com.todoc.server.domain.escort.entity.Escort;
    import org.springframework.data.jpa.repository.JpaRepository;

    import java.util.Optional;

    public interface EscortJpaRepository extends JpaRepository<Escort, String> {
        // helperId(도우미의 userId)로 개수 카운트
        Long countByHelperId(Long helperId);
        Optional<Escort> findByRecruitId(Long recruitId);
    }
