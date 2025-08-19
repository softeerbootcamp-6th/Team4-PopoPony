package com.todoc.server.domain.route.repository;

import com.todoc.server.domain.route.entity.RouteLeg;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RouteLegRepository extends JpaRepository<RouteLeg, Long> {

}
