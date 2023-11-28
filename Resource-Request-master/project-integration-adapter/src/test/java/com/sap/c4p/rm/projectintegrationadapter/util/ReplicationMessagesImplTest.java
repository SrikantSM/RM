package com.sap.c4p.rm.projectintegrationadapter.util;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;

import org.junit.jupiter.api.Test;

import com.sap.c4p.rm.projectintegrationadapter.util.ReplicationMessage.Severity;

public class ReplicationMessagesImplTest {

  /**
   * Class under test
   */
  public ReplicationMessages cut = new ReplicationMessagesImpl();

  /**
   * Validate the info message
   */

  @Test
  void validateInfoMessageCreation() {

    String message = "Replication successfull";
    ReplicationMessage expected = new ReplicationMessageImpl(Severity.INFO, message);

    ReplicationMessage returned = cut.info(message);

    assertEquals(expected.getSeverity(), returned.getSeverity());
    assertEquals(expected.getMessage(), expected.getMessage());

  }

  /**
   * Validate the waring message
   */

  @Test
  void validateWarningMessageCreation() {

    String message = "Replication successfull with few waring";
    ReplicationMessage expected = new ReplicationMessageImpl(Severity.WARNING, message);

    ReplicationMessage returned = cut.warn(message);

    assertEquals(expected.getSeverity(), returned.getSeverity());
    assertEquals(expected.getMessage(), expected.getMessage());

  }

  /**
   * Validate the error message
   */

  @Test
  void validateErrorMessageCreation() {

    String message = "Replication Failed";
    ReplicationMessage expected = new ReplicationMessageImpl(Severity.ERROR, message);

    ReplicationMessage returned = cut.error(message);

    assertEquals(expected.getSeverity(), returned.getSeverity());
    assertEquals(expected.getMessage(), expected.getMessage());

  }

  /**
   * Validate the success message
   */

  @Test
  void validateSuccessMessageCreation() {

    String message = "Replication successfull";
    ReplicationMessage expected = new ReplicationMessageImpl(Severity.SUCCESS, message);

    ReplicationMessage returned = cut.success(message);

    assertEquals(expected.getSeverity(), returned.getSeverity());
    assertEquals(expected.getMessage(), expected.getMessage());

  }

  /**
   * Validate the error message only returned
   */

  @Test
  void validateErrorMessageList() {

    cut.error("Project PRJ-001 in error");
    cut.error("Project PRJ-002 in error");
    cut.info("Project PRJ-002 in success");

    List<ReplicationMessage> returned = cut.getErrorMessages();

    assertEquals(returned.size(), 2);

  }

  /**
   * Validate the all messages returned
   */

  @Test
  void validateMessageList() {

    cut.error("Project PRJ-001 in error");
    cut.error("Project PRJ-002 in error");
    cut.info("Project PRJ-002 in success");

    List<ReplicationMessage> returned = cut.getMessages();

    assertEquals(returned.size(), 3);

  }

}
