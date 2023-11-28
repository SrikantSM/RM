package com.sap.c4p.rm.skill.services;

import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class SkillUriGeneratorTest {
  /* object under test */
  private SkillUriGenerator cut;

  @BeforeEach
  void beforeEach() {
    this.cut = new SkillUriGenerator();
  }

  @Test
  @DisplayName("check if a random URI is built correctly")
  void buildRandomUri() {
    String randomUri = this.cut.generateRandomUri();

    assertTrue(randomUri.startsWith("sap-rm://skill/"));
  }
}
