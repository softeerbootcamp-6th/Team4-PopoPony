package com.todoc.server.domain.realtime.service;

import com.todoc.server.common.util.JsonUtils;
import com.todoc.server.domain.realtime.web.dto.response.Envelope;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.time.Duration;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Objects;

@Component
public class NchanPublisher {

    private static final Logger log = LoggerFactory.getLogger(NchanPublisher.class);

    private final HttpClient client = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(2))
            .build();

    /**
     * 서버에서 Nchan으로 메세지 Publish
     */
    public void publish(long escortId, Envelope envelope) {

        try {
            String envelopeJson = JsonUtils.toJson(envelope);
            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.todoc.kr/pub/escorts/" + escortId))
                    .timeout(Duration.ofSeconds(2))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(Objects.requireNonNull(envelopeJson)))
                    .build();

            HttpResponse<Void> res = client.send(req, HttpResponse.BodyHandlers.discarding());
            int code = res.statusCode();
            if (code >= 400) {
                log.warn("Nchan publish failed: " + code);
            }
        } catch (Exception ex) {
            log.warn("Nchan publish failed: escortId={}, ex={}", escortId, ex.toString());
        }
    }

    /** 비동기 Publish */
    @Async("wsExecutor")
    public void publishAsync(long escortId, Envelope envelope) {
        publish(escortId, envelope);
    }
}
