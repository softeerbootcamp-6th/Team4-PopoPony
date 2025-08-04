package com.todoc.server.domain.route.repository;

import com.todoc.server.domain.route.entity.LocationInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocationInfoRepository extends JpaRepository<LocationInfo, Long> {
}
