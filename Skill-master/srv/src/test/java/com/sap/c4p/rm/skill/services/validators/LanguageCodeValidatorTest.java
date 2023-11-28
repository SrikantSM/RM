package com.sap.c4p.rm.skill.services.validators;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

import com.sap.cds.services.ServiceException;

class LanguageCodeValidatorTest {

  private LanguageCodeValidator cut = new LanguageCodeValidator();

  @ParameterizedTest(name = "check languageCodeValidator does not throw on language code \"{0}\"")
  @ValueSource(strings = { "en", "de", "en_US", "en_US_sappsd" })
  void testValidateSuccessfull(String language) {
    assertDoesNotThrow(() -> this.cut.validate(language));
  }

  @ParameterizedTest(name = "check languageCodeValidator throws on language code \"{0}\"")
  @NullAndEmptySource
  @ValueSource(strings = { "en ' UNION ALL", "en;", ".", "<", "<script>" })
  void testValidateUnsuccessful(String language) {
    assertThrows(ServiceException.class, () -> this.cut.validate(language));
  }

}
