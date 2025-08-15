package com.todoc.server;

import com.todoc.server.external.tmap.service.TMapRouteService;
import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

@TestConfiguration
public class IntegrationMockConfig {

    private static final String USED_VERTICES =
            "45712988,13523125:-96,6:-319,-1:-2,73:-9,278:5,361:3,167:-2,120:1,48:2,63:-79,65:-182,-1:-549," +
                    "-16:-474,-7:-389,-3:-227,-6:-257,-121:-303,-205:-97,-66:-399,-286:-137,-117:-38,-37:-111," +
                    "-109:-369,-369:-106,-100:-60,-3";

    private static final String TMAP_JSON = """
        { "usedFavoriteRouteVertices": "45712988,13523125:-96,6:-319,-1:-2,73:-9,278:5,361:3,167:-2,120:1,48:2,63:-79,65:-182,-1:-549,-16:-474,-7:-389,-3:-227,-6:-257,-121:-303,-205:-97,-66:-399,-286:-137,-117:-38,-37:-111,-109:-369,-369:-106,-100:-60,-3",
          "type": "FeatureCollection",
          "features": [
            {"type":"Feature",
             "geometry":{"type":"Point","coordinates":[126.97840434946676,37.56702406815733]},
             "properties":{"totalDistance":1561,"totalTime":343,"totalFare":0,"taxiFare":5200,"index":0,"pointIndex":0,"name":"","description":"세종대로20길을 따라 102m 이동","nextRoadName":"세종대로20길","turnType":200,"pointType":"S"}
            }
          ]
        }
        """;

    @Bean
    @Primary // 원본 빈보다 우선 주입되도록
    public TMapRouteService tMapRouteService() {
        TMapRouteService mock = Mockito.mock(TMapRouteService.class);
        Mockito.when(mock.getRoute(Mockito.any()))
                .thenReturn(new TMapRouteService.TMapRawResult(TMAP_JSON, USED_VERTICES));
        return mock;
    }
}
