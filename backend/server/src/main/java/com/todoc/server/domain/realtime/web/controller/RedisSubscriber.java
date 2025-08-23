package com.todoc.server.domain.realtime.web.controller;

import com.todoc.server.common.enumeration.Role;
import com.todoc.server.common.util.JsonUtils;
import com.todoc.server.domain.realtime.exception.RealtimeInvalidRoleException;
import com.todoc.server.domain.realtime.service.NchanPublisher;
import com.todoc.server.domain.realtime.service.WebSocketSessionRegistry;
import com.todoc.server.domain.realtime.web.dto.response.Envelope;
import com.todoc.server.domain.realtime.web.dto.response.LocationRedisDto;
import com.todoc.server.domain.realtime.web.dto.response.LocationResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.stereotype.Component;
import org.springframework.data.redis.connection.Message;

import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
public class RedisSubscriber implements MessageListener {

    private static final Logger log = LoggerFactory.getLogger(RedisSubscriber.class);

    private final WebSocketSessionRegistry sessionRegistry;

    private final NchanPublisher nchanPublisher;


    // escort:ch:{escortId}:{role}
    private static final Pattern CH = Pattern.compile("^escort:ch:([^:]+):([^:]+)$");

    /** Lua에서 publish한 payload 그대로 들어옴: {"latitude":...,"longitude":...,"timestamp":...,...} */
    @Override
    public void onMessage(Message m, byte[] pattern) {
        String channel = new String(m.getChannel(), StandardCharsets.UTF_8);
        String data = new String(m.getBody(), StandardCharsets.UTF_8);

        var matcher = CH.matcher(channel);
        if (!matcher.matches()) {
            return;
        }

        String escortIdStr = matcher.group(1);
        String roleRaw = matcher.group(2); // helper | patient (대소문자 섞여도 허용)

        long escortId;
        try {
            escortId = Long.parseLong(escortIdStr);
        } catch (NumberFormatException e) {
            log.warn("Ignore pubsub (invalid escortId): channel={}, data={}", channel, data);
            return;
        }

        String eventName = roleRaw.toLowerCase(Locale.ROOT) + "-location";

        LocationRedisDto dto;
        try {
            dto = JsonUtils.fromJson(data, LocationRedisDto.class);
            if (dto == null) return;
        } catch (Exception ex) {
            log.warn("Ignore pubsub (parse fail): channel={}, data={}", channel, data, ex);
            return;
        }

        Envelope envelope = new Envelope(eventName, LocationResponse.from(dto));

        Role role = Role.from(roleRaw).orElseThrow(RealtimeInvalidRoleException::new);
        Set<Role> targets = (role == Role.HELPER)
                ? Role.TO_CUSTOMER_AND_PATIENT
                : Role.TO_CUSTOMER_AND_HELPER;

        sessionRegistry.broadcastToRoles(escortId, targets, envelope);

        nchanPublisher.publish(escortId, envelope);
    }
}
