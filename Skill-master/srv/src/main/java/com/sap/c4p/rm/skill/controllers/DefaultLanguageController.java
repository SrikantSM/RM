package com.sap.c4p.rm.skill.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.sap.c4p.rm.skill.services.DefaultProficiencySetService;
import com.sap.c4p.rm.skill.services.validators.LanguageCodeValidator;

@RestController
@RequestMapping("/api/internal/default-language")
public class DefaultLanguageController {

  private final DefaultProficiencySetService defaultProficiencySetService;
  private final LanguageCodeValidator languageCodeValidator;

  public DefaultLanguageController(final DefaultProficiencySetService defaultProficiencySetService,
      final LanguageCodeValidator languageCodeValidator) {
    this.defaultProficiencySetService = defaultProficiencySetService;
    this.languageCodeValidator = languageCodeValidator;
  }

  @Secured("DefaultLanguage.Edit")
  @PutMapping
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void reactOnDefaultLanguageChange(final @RequestParam(name = "language", required = false) String language) {
    this.languageCodeValidator.validate(language);
    this.defaultProficiencySetService.upsertDefaultProficiencySet(language);
  }

}
