package com.todoc.server.domain.route.repository;

import com.todoc.server.common.enumeration.RouteLegType;
import com.todoc.server.domain.route.entity.RouteLeg;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RouteLegRepository extends JpaRepository<RouteLeg, Long> {
    Optional<RouteLeg> findByRouteIdAndLegType(Long routeId, RouteLegType legType);
}
