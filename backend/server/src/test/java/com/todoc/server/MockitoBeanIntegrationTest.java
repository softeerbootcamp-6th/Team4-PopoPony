package com.todoc.server;

import com.todoc.server.domain.realtime.service.NchanPublisher;
import com.todoc.server.domain.realtime.service.WebSocketSessionRegistry;
import com.todoc.server.external.sms.service.SMSService;
import com.todoc.server.external.tmap.service.TMapRouteParser;
import com.todoc.server.external.tmap.service.TMapRouteService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

public class MockitoBeanIntegrationTest extends IntegrationTest {

    @MockitoBean
    protected TMapRouteService tMapRouteService;

    @MockitoBean
    protected TMapRouteParser tMapRouteParser;

    @MockitoBean
    protected SMSService smsService;

    @MockitoBean
    protected WebSocketSessionRegistry webSocketSessionRegistry;

    @MockitoBean
    protected NchanPublisher nchanPublisher;
}
