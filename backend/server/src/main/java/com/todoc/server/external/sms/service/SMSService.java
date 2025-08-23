package com.todoc.server.external.sms.service;

import com.todoc.server.external.sms.exception.SMSAPICallException;
import lombok.RequiredArgsConstructor;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.request.SingleMessageSendingRequest;
import net.nurigo.sdk.message.response.SingleMessageSentResponse;
import net.nurigo.sdk.message.service.DefaultMessageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SMSService {

    private static final Logger log = LoggerFactory.getLogger(SMSService.class);

    private final DefaultMessageService messageService;

    public void sendSms(String to, String from, String text) {
        Message message = new Message();
        message.setFrom(from);
        message.setTo(to);
        message.setText(text);

        try {
            SingleMessageSentResponse response = messageService.sendOne(new SingleMessageSendingRequest(message));
            log.info("[SMSService] 문자 발송 성공 (to: {}, from: {}, content:{}", to, from, text);
        } catch (Exception e) {
            log.error("[SMSService] 문자 발송 실패 (to: {}, from: {}, content:{}", to, from, text, e);
            throw new SMSAPICallException();
        }
    }
}
