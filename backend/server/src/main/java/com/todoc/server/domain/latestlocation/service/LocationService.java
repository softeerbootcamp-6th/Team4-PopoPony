package com.todoc.server.domain.latestlocation.service;

import com.todoc.server.domain.latestlocation.repository.LocationCacheRepository;
import com.todoc.server.domain.latestlocation.web.dto.request.LocationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class LocationService {

    private final LocationCacheRepository locationCacheRepository;

    public void register(LocationRequest request) {

        locationCacheRepository.save(request.getEscortId(),request.getLat(),request.getLon());
    }
}
