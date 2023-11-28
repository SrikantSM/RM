package com.sap.c4p.rm.skill;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.IOException;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.sap.cds.services.utils.CdsErrorStatuses;
import com.sap.cds.services.utils.ErrorStatusException;

import com.sap.c4p.rm.skill.testconfig.SpringBootTestWithoutSharedSqliteCache;

@SpringBootTestWithoutSharedSqliteCache
class CapMessageTest {

  @Test
  @DisplayName("check if a message that should not be omitted is shown")
  void notOmittedMessage() throws IOException {
    assertEquals("The selected entity can't be found.",
        new ErrorStatusException(CdsErrorStatuses.ENTITY_INSTANCE_NOT_FOUND, "x").getLocalizedMessage());
  }

  @Test
  @DisplayName("check if a Bad Request message that should be omitted is not shown")
  void omittedBadRequest() throws IOException {
    assertEquals("Bad request",
        new ErrorStatusException(CdsErrorStatuses.UNKONWN_AGGREGATION_METHOD).getLocalizedMessage());
  }

  @Test
  @DisplayName("check if an Internal Server Error message that should be omitted is not shown")
  void omittedInternalServerError() throws IOException {
    assertEquals("Internal server error",
        new ErrorStatusException(CdsErrorStatuses.INVALID_METADATA).getLocalizedMessage());
  }
}
