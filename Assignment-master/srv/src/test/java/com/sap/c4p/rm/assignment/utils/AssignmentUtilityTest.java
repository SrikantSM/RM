package com.sap.c4p.rm.assignment.utils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.time.Instant;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.sap.cds.services.ServiceException;
import com.sap.cds.services.messages.Messages;

public class AssignmentUtilityTest {

  /* It is presumed that the hours is always a whole number */
  @Test
  @DisplayName("check if hoursToMinutes returns the right number of minutes in an hour")
  public void hoursToMinutes() {

    assertEquals(120, AssignmentUtility.hoursToMinutes(2));

  }

  @Test
  @DisplayName("check if minutesToHours returns the right number of hours for the given minutes")
  public void minutesToHours() {

    assertEquals(2, AssignmentUtility.minutesToHours(120));

  }

  @Test
  @DisplayName("check if getInstantObjectFromDateString returns an instant of datetime given a date")
  public void getInstantObjectFromDateString() {

    Instant startTime = Instant.parse("2020-10-10T00:00:00.00Z");
    assertEquals(startTime, AssignmentUtility.getInstantObjectFromDateString("2020-10-10"));

  }

  @Test
  @DisplayName("if a given assignment is draft, return true")
  public void isEditDraft() {

    AssignmentUtility.setEditDraft("asg1");
    assertEquals(true, AssignmentUtility.isEditDraft("asg1"));
    assertEquals(false, AssignmentUtility.isEditDraft("asg2"));

  }

  @Test
  public void correctNumberStateIsReturnedForUtilizationValue() {
    assertEquals("Negative", AssignmentUtility.getNumberStateForUtilizationValue(69),
        "Incorrect number state returned");
    assertEquals("Negative", AssignmentUtility.getNumberStateForUtilizationValue(0), "Incorrect number state returned");
    assertEquals("Negative", AssignmentUtility.getNumberStateForUtilizationValue(121),
        "Incorrect number state returned");
    assertEquals("Negative", AssignmentUtility.getNumberStateForUtilizationValue(200),
        "Incorrect number state returned");

    assertEquals("Positive", AssignmentUtility.getNumberStateForUtilizationValue(80),
        "Incorrect number state returned");
    assertEquals("Positive", AssignmentUtility.getNumberStateForUtilizationValue(110),
        "Incorrect number state returned");
    assertEquals("Positive", AssignmentUtility.getNumberStateForUtilizationValue(100),
        "Incorrect number state returned");
    assertEquals("Positive", AssignmentUtility.getNumberStateForUtilizationValue(90),
        "Incorrect number state returned");

    assertEquals("Critical", AssignmentUtility.getNumberStateForUtilizationValue(70),
        "Incorrect number state returned");
    assertEquals("Critical", AssignmentUtility.getNumberStateForUtilizationValue(79),
        "Incorrect number state returned");
    assertEquals("Critical", AssignmentUtility.getNumberStateForUtilizationValue(111),
        "Incorrect number state returned");
    assertEquals("Critical", AssignmentUtility.getNumberStateForUtilizationValue(120),
        "Incorrect number state returned");
  }

  @Test
  @DisplayName("Raise exception with error")
  public void raiseExceptionIfErrorWithTarget() {
    Messages mockMessage = mock(Messages.class);
    mockMessage.error("MOCK_KEY");
    String targetString = "someTarget";
    doThrow(ServiceException.class).when(mockMessage).throwIfError();
    assertThrows(ServiceException.class,
        () -> AssignmentUtility.raiseExceptionIfErrorWithTarget(mockMessage, targetString));

  }

  @Test
  @DisplayName("Raise exception with error")
  public void addTarget() {
    Messages mockMessage = mock(Messages.class);
    mockMessage.error("MOCK_KEY");
    String targetString = "someTarget";
    AssignmentUtility.addTarget(mockMessage, targetString);
    verify(mockMessage, times(1)).stream();
  }

}
