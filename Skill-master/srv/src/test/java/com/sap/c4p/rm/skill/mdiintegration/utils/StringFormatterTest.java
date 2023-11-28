package com.sap.c4p.rm.skill.mdiintegration.utils;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class StringFormatterTest {

  private static final String ARGUMENT_1 = "argument1";
  private static final String ARGUMENT_2 = "argument2";

  @Test
  @DisplayName("Test if formatted string is returned when one argument provided.")
  public void testFormatWithOneArgument() {
    String stringPattern = "Test String with argument ";
    String expectedString = stringPattern + ARGUMENT_1;
    String returnedString = StringFormatter.format(stringPattern + "{0}", ARGUMENT_1);
    assertEquals(expectedString, returnedString);
  }

  @Test
  @DisplayName("Test if formatted string is returned when more than one argument provided.")
  public void testFormatWithMoreThanOneArguments() {
    String stringPattern = "Test String with arguments ";
    String expectedString = stringPattern + ARGUMENT_1 + ", " + ARGUMENT_2;
    String returnedString = StringFormatter.format(stringPattern + "{0}, {1}", ARGUMENT_1, ARGUMENT_2);
    assertEquals(expectedString, returnedString);
  }

  @Test
  @DisplayName("Test if formatted string is returned when no argument provided.")
  public void testFormatWithNoArguments() {
    String stringPattern = "Test String with no arguments.";
    String expectedString = stringPattern + "{0}";
    String returnedString = StringFormatter.format(stringPattern + "{0}");
    assertEquals(expectedString, returnedString);
  }

  @Test
  @DisplayName("Test if formatted string is returned when provided argument is more than expected.")
  public void testFormatWithMoreArgumentsThanExpected() {
    String stringPattern = "Test String with no arguments ";
    String expectedString = stringPattern + ARGUMENT_1;
    String returnedString = StringFormatter.format(stringPattern + "{0}", ARGUMENT_1, ARGUMENT_2);
    assertEquals(expectedString, returnedString);
  }

  @Test
  @DisplayName("Test if formatted string is returned if base string has no place for argument.")
  public void testFormatWithNoArgujmentPlaceHolder() {
    String stringPattern = "Test String with no arguments ";
    String returnedString = StringFormatter.format(stringPattern, ARGUMENT_1);
    assertEquals(stringPattern, returnedString);
  }

}
