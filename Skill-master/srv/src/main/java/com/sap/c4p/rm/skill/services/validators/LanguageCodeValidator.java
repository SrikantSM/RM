package com.sap.c4p.rm.skill.services.validators;

import java.nio.charset.StandardCharsets;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.util.UriUtils;

import com.sap.cds.services.ServiceException;

import com.sap.c4p.rm.skill.config.LoggingMarker;
import com.sap.c4p.rm.skill.gen.MessageKeys;
import com.sap.c4p.rm.skill.utils.HttpStatus;

@Component
public class LanguageCodeValidator {

  private static final String LANGUAGE_CHARACTER_REGEX = "^[\\w-]+$";
  private static final Logger LOGGER = LoggerFactory.getLogger(LanguageCodeValidator.class);
  private static final Marker MARKER = LoggingMarker.VALIDATION.getMarker();

  /**
   * Validates that the String is a valid language code, i. e. does not contain
   * disallowed special characters. DOES NOT VALIDATE that the language actually
   * exists.
   *
   * @param languageCode The language code to be validated
   */
  public void validate(final String languageCode) {
    if (!StringUtils.hasText(languageCode) || !languageCode.matches(LANGUAGE_CHARACTER_REGEX)) {
      if (LOGGER.isInfoEnabled()) {
        final String encodedLanguage = UriUtils.encodeFragment(languageCode, StandardCharsets.UTF_8);
        LOGGER.info(MARKER, "Invalid download language is (url-encoded) '{}'", encodedLanguage);
      }
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.ENTERED_LANGUAGE_NOT_VALID);
    }
  }

}
