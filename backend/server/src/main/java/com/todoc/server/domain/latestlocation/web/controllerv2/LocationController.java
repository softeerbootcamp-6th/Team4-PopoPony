package com.todoc.server.domain.latestlocation.web.controllerv2;

import com.todoc.server.common.response.Response;
import com.todoc.server.domain.latestlocation.service.LocationService;
import com.todoc.server.domain.latestlocation.web.dto.request.LocationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/locations")
public class LocationController {

    private final LocationService locationService;

    @PostMapping("/{escortId}")
    public Response updateLocation(@PathVariable(name = "escortId") Long escortId, @RequestBody LocationRequest request) {

        locationService.register(escortId, request);
        return Response.from();
    }
}
