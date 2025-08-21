package com.todoc.server.domain.realtime.web.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Envelope {

    private String type;
    private Object payload;
}