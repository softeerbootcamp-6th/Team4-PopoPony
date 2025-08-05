package com.todoc.server.domain.route.repository;

import com.todoc.server.domain.route.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RouteRepository extends JpaRepository<Route, Long> {
}
