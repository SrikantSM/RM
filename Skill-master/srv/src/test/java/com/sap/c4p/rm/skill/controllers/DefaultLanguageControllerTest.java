package com.sap.c4p.rm.skill.controllers;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.sap.c4p.rm.skill.services.DefaultProficiencySetService;
import com.sap.c4p.rm.skill.services.validators.LanguageCodeValidator;

class DefaultLanguageControllerTest {

  private DefaultLanguageController cut;

  private DefaultProficiencySetService defaultProfSetService;
  private LanguageCodeValidator languageCodeValidator;

  @BeforeEach
  void setup() {
    this.languageCodeValidator = mock(LanguageCodeValidator.class);
    this.defaultProfSetService = mock(DefaultProficiencySetService.class);
    this.cut = new DefaultLanguageController(this.defaultProfSetService, this.languageCodeValidator);
  }

  @Test
  void testReactOnDefaultLanguageChange() {
    this.cut.reactOnDefaultLanguageChange("en");
    verify(this.languageCodeValidator).validate(eq("en"));
    verify(this.defaultProfSetService).upsertDefaultProficiencySet(eq("en"));
  }

}
