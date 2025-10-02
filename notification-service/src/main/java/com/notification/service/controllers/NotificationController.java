package com.notification.service.controllers;

import com.notification.service.services.EmailService;
import com.notification.service.services.SmsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class NotificationController {

    private final EmailService emailService;
    private final SmsService smsService;

    @GetMapping("/sendMail")
    public String sendMail() {
        emailService.sendEmail("abishaiekka@gmail.com", "Test Subject", "Test body");
        return "Email sent successfully";
    }

    @GetMapping("/sendSms")
    public String sendSms() {
        smsService.sendSms("+917766043467", "Test sms message from the server");
        return "Sms sent successfully";
    }


}