package com.sap.c4p.rm.resourcerequest.handlers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.sap.cds.Struct;

import com.sap.c4p.rm.resourcerequest.utils.Constants;

import manageresourcerequestservice.AssignmentStatus;
import manageresourcerequestservice.Staffing;

public class StaffingHandlerTest {

  /**
   * Class Under Test
   */
  public StaffingHandler cut;

  @BeforeEach
  public void setUp() {
    cut = new StaffingHandler();
  }

  @Nested
  class validateFillVirtualFields {

    @Test
    public void testFillVirtualFieldsWhenProposed() {
      StaffingHandler spyOfCut = Mockito.spy(cut);

      // Create the argument to be passed with one Staffing object.
      List<Staffing> staffingList = new ArrayList<>();
      Staffing staffing = Struct.create(Staffing.class);
      AssignmentStatus assignmentStatus = Struct.create(AssignmentStatus.class);
      assignmentStatus.setCode(Constants.AssignmentStatus.PROPOSAL_ASSIGNMENT_STATUS_CODE); // SET PROPOSED
      staffing.setAssignmentStatus(assignmentStatus);
      staffing.setAssignmentProposalFlag(Boolean.FALSE);
      staffingList.add(staffing);

      spyOfCut.fillVirtualFields(staffingList);

      assertEquals(Boolean.TRUE, staffing.getAssignmentProposalFlag());
    }

    @Test
    public void testFillVirtualFieldsWhenNotProposed() {
      StaffingHandler spyOfCut = Mockito.spy(cut);

      // Create the argument to be passed with one Staffing object.
      List<Staffing> staffingList = new ArrayList<>();
      Staffing staffing = Struct.create(Staffing.class);
      AssignmentStatus assignmentStatus = Struct.create(AssignmentStatus.class);
      assignmentStatus.setCode(1); // SET SOFT BOOKED
      staffing.setAssignmentStatus(assignmentStatus);
      staffing.setAssignmentProposalFlag(Boolean.FALSE);
      staffingList.add(staffing);

      spyOfCut.fillVirtualFields(staffingList);

      assertEquals(Boolean.FALSE, staffing.getAssignmentProposalFlag());
    }
  }

  @Nested
  class validateAfterStaffingRead {
    @Test
    public void testAfterStaffingRead() {
      StaffingHandler spyOfCut = Mockito.spy(cut);

      List<Staffing> staffingList = new ArrayList<>();

      doNothing().when(spyOfCut).fillVirtualFields(staffingList);

      spyOfCut.afterStaffingRead(staffingList);

      verify(spyOfCut, times(1)).fillVirtualFields(staffingList);

    }
  }
}
