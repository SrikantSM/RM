package com.sap.c4p.rm.skill.utils;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.context.support.ResourceBundleMessageSource;

public class TranslatorTest {

  private static final String TRANSLATED_MESSAGE = "translated message";
  private Translator cut;

  @BeforeEach
  public void setUp() {
    ResourceBundleMessageSource messageSource = new ResourceBundleMessageSource();
    messageSource.setUseCodeAsDefaultMessage(true);
    this.cut = new Translator(messageSource);
  }

  @Test
  @DisplayName("check if toLocale() returns correct message")
  public void toLocale() {
    String translatedMessage = this.cut.toLocale(TRANSLATED_MESSAGE, "en");

    assertEquals(TRANSLATED_MESSAGE, translatedMessage);
  }
}
