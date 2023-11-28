package com.sap.c4p.rm.skill.utils;

import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.stereotype.Component;

@Component
public class Translator {

  private ResourceBundleMessageSource messageSource;

  @Autowired
  Translator(ResourceBundleMessageSource messageSource) {
    this.messageSource = messageSource;
  }

  public String toLocale(final String msgCode, final String languageCode) {
    Locale locale = Locale.forLanguageTag(languageCode);
    return this.messageSource.getMessage(msgCode, null, locale);
  }
}