package com.todoc.server.domain.route.service;

import com.todoc.server.domain.escort.web.dto.request.RecruitCreateRequest;
import com.todoc.server.domain.route.entity.LocationInfo;
import com.todoc.server.domain.route.repository.LocationInfoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class LocationInfoService {

    private final LocationInfoRepository locationInfoRepository;

    public LocationInfo register(RecruitCreateRequest request) {

        // TODO :: Request로부터 LoacationInfo 엔티티 생성해야함 (외부 API 연동에 대해 알아본 후 적용할 것)
        LocationInfo locationInfo = LocationInfo.builder()
                .build();

        return locationInfoRepository.save(locationInfo);
    }

}
