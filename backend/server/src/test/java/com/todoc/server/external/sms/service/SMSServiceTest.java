package com.todoc.server.external.sms.service;

import com.todoc.server.common.config.SMSClientConfig;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(classes = {SMSService.class, SMSClientConfig.class})
@Disabled
public class SMSServiceTest {

    @Autowired
    SMSService smsService;

    @Test
    public void sendSms() {
        smsService.sendSms("01026458362", "01026458362", "https://api.coolsms.co.kr");
    }
}
