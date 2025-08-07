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

    public LocationInfo register(RecruitCreateRequest.LocationDetail locationDetail) {

        LocationInfo locationInfo = LocationInfo.builder()
                .placeName(locationDetail.getPlaceName())
                .upperAddrName(locationDetail.getUpperAddrName())
                .middleAddrName(locationDetail.getMiddleAddrName())
                .lowerAddrName(locationDetail.getLowerAddrName())
                .firstAddrNo(locationDetail.getFirstAddrNo())
                .secondAddrNo(locationDetail.getSecondAddrNo())
                .roadName(locationDetail.getRoadName())
                .firstBuildingNo(locationDetail.getFirstBuildingNo())
                .secondBuildingNo(locationDetail.getSecondBuildingNo())
                .detailAddress(locationDetail.getDetailAddress())
                .longitude(locationDetail.getLongitude())
                .latitude(locationDetail.getLatitude())
                .build();

        return locationInfoRepository.save(locationInfo);
    }

}
