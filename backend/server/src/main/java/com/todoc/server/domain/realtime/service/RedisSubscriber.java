package com.todoc.server.domain.realtime.service;

import com.todoc.server.common.enumeration.Role;
import com.todoc.server.common.util.JsonUtils;
import com.todoc.server.domain.realtime.exception.RealtimeInvalidRoleException;
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

    /**
     * Lua에서 publish한 메세지를 수신
     * publish한 payload 형태 그대로 수신 -> {"latitude":...,"longitude":...,"timestamp":...,...}
     */
    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            final String channel = new String(message.getChannel(), StandardCharsets.UTF_8);
            final String data    = new String(message.getBody(), StandardCharsets.UTF_8);

            var matcher = CH.matcher(channel);
            if (!matcher.matches()) {
                log.debug("Ignore pubsub (channel mismatch): {}", channel);
                return;
            }

            final long escortId;
            try {
                escortId = Long.parseLong(matcher.group(1));
            } catch (NumberFormatException e) {
                log.warn("Ignore pubsub (invalid escortId): channel={}, data={}", channel, data);
                return;
            }

            final String roleRaw = matcher.group(2); // HELPER|PATIENT (대소문자 섞여도 허용)
            final Role role = Role.from(roleRaw).orElse(null);
            if (role == null) {
                log.warn("Ignore pubsub (invalid role): channel={}, data={}", channel, data);
                return;
            }

            final LocationRedisDto dto = JsonUtils.fromJson(data, LocationRedisDto.class);
            if (dto == null) {
                log.warn("Ignore pubsub (null dto): channel={}, data={}", channel, data);
                return;
            }

            final String eventName = roleRaw.toLowerCase(Locale.ROOT) + "-location";
            final Envelope envelope = new Envelope(eventName, LocationResponse.from(dto));

            final Set<Role> targets = (role == Role.HELPER)
                    ? Role.TO_CUSTOMER_AND_PATIENT
                    : Role.TO_CUSTOMER_AND_HELPER;

            try {
                sessionRegistry.broadcastToRolesAsync(escortId, targets, envelope);
            } catch (Exception e) {
                log.warn("broadcastToRoles failed: escortId={}, err={}", escortId, e.toString());
            }
            try {
                nchanPublisher.publishAsync(escortId, envelope);
            } catch (Exception e) {
                log.warn("nchan publish async failed: escortId={}, err={}", escortId, e.toString());
            }

        } catch (Exception ex) {
            log.warn("onMessage failed: {}", ex.toString());
        }
    }
}
