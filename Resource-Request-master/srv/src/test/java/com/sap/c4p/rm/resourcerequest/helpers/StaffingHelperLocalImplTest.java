package com.sap.c4p.rm.resourcerequest.helpers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.sap.cds.Result;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.services.persistence.PersistenceService;

import manageresourcerequestservice.Staffing;

@DisplayName("Unit test for Staffing Helper Local Impl class")
public class StaffingHelperLocalImplTest {

  /**
   * Class Under Test
   */
  private StaffingHelperLocalImpl cut;

  private PersistenceService mockPersistenceService;

  @BeforeEach
  public void setUp() {
    mockPersistenceService = Mockito.mock(PersistenceService.class);
    cut = new StaffingHelperLocalImpl(mockPersistenceService);
  }

  @Nested
  class ValidateUpdateAssignment {

    @Test
    public void testUpdateAssignment() {
      StaffingHelperLocalImpl spy = Mockito.spy(cut);
      Staffing mockStaffing = Mockito.mock(Staffing.class);
      Result mockResult = mock(Result.class);
      int assignmentStatusCode = 3;
      doReturn(mockResult).when(mockPersistenceService).run(any(CqnUpdate.class));

      spy.updateAssignment(assignmentStatusCode, mockStaffing);

      verify(mockPersistenceService, times(1)).run(any(CqnUpdate.class));
    }
  }

}
