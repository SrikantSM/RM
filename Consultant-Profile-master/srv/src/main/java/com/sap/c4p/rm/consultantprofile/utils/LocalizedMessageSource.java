package com.sap.c4p.rm.consultantprofile.utils;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

@Component
public class LocalizedMessageSource {

    private final MessageSource messageSource;

    @Autowired
    public LocalizedMessageSource(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    public String getLocalizedMessageSource(String messageKey, Object... args) {
        List<Object> objectArray = Arrays.asList(args);
        Object[] some = objectArray.toArray();
        return messageSource.getMessage(messageKey, some, LocaleContextHolder.getLocale());
    }

    public String getLocalizedMessageSource(String messageKey) {
        return messageSource.getMessage(messageKey, null, LocaleContextHolder.getLocale());
    }
}
