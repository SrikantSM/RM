package com.sap.c4p.rm.resourcerequest.validations;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import java.time.LocalDate;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import com.sap.cds.Result;
import com.sap.cds.Struct;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.messages.Messages;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.resourcerequest.gen.MessageKeys;

import com.sap.resourcemanagement.integration.ReferenceObjectTypes;

import resourcerequestservice.ReferenceObjects;

public class ReferenceObjectPublicAPIValidatorTest {
  private Messages messages;

  private static PersistenceService mockPersistenceService;
  private static ReferenceObjectPublicApiValidator refObjPublicAPIValidator;
  private static final String EVIL_SCRIPT_TAG = "<script src=\"https://evilpage.de/assets/js/evilScript.js\"></script>";
  private static final String EVIL_CSV = "=cmd|'/Ccalc.exe'!z";

  @BeforeEach
  void beforeEach() {
    messages = mock(Messages.class, RETURNS_DEEP_STUBS);
    mockPersistenceService = mock(PersistenceService.class, RETURNS_DEEP_STUBS);
    refObjPublicAPIValidator = new ReferenceObjectPublicApiValidator(messages, mockPersistenceService);
  }

  @Nested
  class validateRefObjFieldInputsForXSSInjection {
    @Test
    @DisplayName("check if the validation is passed when the ReferenceObject fields inputs do not contain html tags")
    void validateForInjectionWithNoTagsInRefObjFields() {

      ReferenceObjects reqRefObject = Struct.create(ReferenceObjects.class);
      reqRefObject.setName("testName");
      reqRefObject.setDisplayId("testID");

      refObjPublicAPIValidator.validateForInjection(reqRefObject);
      verify(messages, times(0)).error(any(), any());
    }

    @Test
    @DisplayName("check if the validation fails when the ReferenceObject name contains a script tag")
    void validateForInjectionWithTagInRefObjName() {
      ReferenceObjects reqRefObject = Struct.create(ReferenceObjects.class);
      reqRefObject.setName(EVIL_SCRIPT_TAG);
      refObjPublicAPIValidator.validateForInjection(reqRefObject);
      verify(messages, times(1)).error(eq(MessageKeys.RRSRV_CONTAINS_HTML_TAG));
    }

    @Test
    @DisplayName("check if the validation fails when the ReferenceObject name contains a formula")
    void validateForInjectionWithFormulaInRefObjFields() {
      ReferenceObjects reqRefObject = Struct.create(ReferenceObjects.class);
      reqRefObject.setName(EVIL_CSV);
      refObjPublicAPIValidator.validateForInjection(reqRefObject);
      verify(messages, times(1)).error(eq(MessageKeys.FORBIDDEN_FIRST_CHARACTER_RRSRV));
    }

    @Test
    @DisplayName("check if the validation fails when the ReferenceObject ID contains a script tag")
    void validateForInjectionWithTagRefObjDesc() {
      ReferenceObjects reqRefObj = Struct.create(ReferenceObjects.class);
      reqRefObj.setDisplayId(EVIL_SCRIPT_TAG);
      refObjPublicAPIValidator.validateForInjection(reqRefObj);
      verify(messages, times(1)).error(eq(MessageKeys.RRSRV_CONTAINS_HTML_TAG));
    }

    @Test
    @DisplayName("get correct message key for html injection")
    void getMessageKeyForHtmlInjection() {
      String messageKey = refObjPublicAPIValidator.getMessageKeyForHtmlInjection();
      assertEquals(MessageKeys.RRSRV_CONTAINS_HTML_TAG, messageKey);
    }

    @Test
    @DisplayName("get correct message key for csv injection")
    void getMessageKeyForCsvInjection() {
      String messageKey = refObjPublicAPIValidator.getMessageKeyForCsvInjection();
      assertEquals(MessageKeys.FORBIDDEN_FIRST_CHARACTER_RRSRV, messageKey);
    }
  }

  @Nested
  @DisplayName("Validate Reference Object Type code existence")
  class ValidateRefObjTypeCodeExistence {

    @Test
    @DisplayName("Check if an existing reference Object type code passes the validation")
    public void validateRefObjectTypeCodeExistenceSuccess() {

      final ReferenceObjectTypes refObj = Struct.create(ReferenceObjectTypes.class);
      refObj.setCode(0);

      when(mockPersistenceService.run(any(CqnSelect.class)).rowCount()).thenReturn((long) 1);

      refObjPublicAPIValidator.validateReferenceObjectTypeCode(refObj.getCode());

      verify(messages, times(0)).error(MessageKeys.INVALID_REFERENCETYPE_CODE);
    }

    @Test
    @DisplayName("Check if an non-existing Reference Object Type code fails the validation")
    public void validateRefObjTypeCodeNonExistenceFailure() {

      final ReferenceObjectTypes refObj = Struct.create(ReferenceObjectTypes.class);
      refObj.setCode(19);

      when(mockPersistenceService.run(any(CqnSelect.class)).rowCount()).thenReturn((long) 0);

      refObjPublicAPIValidator.validateReferenceObjectTypeCode(refObj.getCode());

      verify(messages, times(1)).error(MessageKeys.INVALID_REFERENCETYPE_CODE);
    }

    @Test
    @DisplayName("Check if 0 is passed as typeCode for reference object creation")
    public void validateRefObjTypeCodeNoneFailure() {

      final ReferenceObjectTypes refObj = Struct.create(ReferenceObjectTypes.class);
      refObj.setCode(0);

      when(mockPersistenceService.run(any(CqnSelect.class)).rowCount()).thenReturn((long) 1);

      refObjPublicAPIValidator.validateReferenceObjectTypeCode(refObj.getCode());

      verify(messages, times(1)).error(MessageKeys.INVALID_REFTYPECODE_REFOBJCREATE);
    }

    @Test
    @DisplayName("Check if type code is not passed for reference object creation")
    public void validateRefObjTypeCodeNotPassedFailure() {

      final ReferenceObjectTypes refObj = Struct.create(ReferenceObjectTypes.class);

      refObjPublicAPIValidator.validateReferenceObjectTypeCode(refObj.getCode());

      verify(messages, times(1)).error(MessageKeys.INVALID_REFTYPECODE_REFOBJCREATE);
    }

  }

  @Nested
  @DisplayName("Validate Object duration")
  class ValidateObjDuration {

    @Test
    @DisplayName("Validate if start date is after end date -Negative scenario")
    public void validateObjDurationFailure() {

      final ReferenceObjects refObj = Struct.create(ReferenceObjects.class);
      refObj.setStartDate(LocalDate.parse("2023-02-02"));
      refObj.setEndDate(LocalDate.parse("2023-01-02"));

      refObjPublicAPIValidator.validateObjectDuration(refObj.getStartDate(), refObj.getEndDate());

      verify(messages, times(1)).error(MessageKeys.INVALID_DATES);
    }

    @Test
    @DisplayName("Validate if start date is after end date -Success scenario")
    public void validateObjDurationSuccess() {

      final ReferenceObjects refObj = Struct.create(ReferenceObjects.class);
      refObj.setStartDate(LocalDate.parse("2023-02-02"));
      refObj.setEndDate(LocalDate.parse("2023-03-02"));

      refObjPublicAPIValidator.validateObjectDuration(refObj.getStartDate(), refObj.getEndDate());

      verify(messages, times(0)).error(MessageKeys.INVALID_DATES);
    }
  }

  @Nested
  class ValidateReferenceObjectPropertyApiTest {

    @Test
    @DisplayName("Validate call to the validation method with event type - Create")
    public void validateRefObjectCreate() {

      final ReferenceObjects refObj = Struct.create(ReferenceObjects.class);
      refObj.setDisplayId("Project1");
      refObj.setName("Project Name");
      refObj.setTypeCode(1);
      refObj.setStartDate(LocalDate.parse("2023-02-02"));
      refObj.setEndDate(LocalDate.parse("2023-03-02"));
      ReferenceObjectPublicApiValidator refObjPublicAPIValidatorSpy = spy(refObjPublicAPIValidator);
      refObjPublicAPIValidatorSpy.validateReferenceObjectPropertyApi(refObj, CqnService.EVENT_CREATE);

      verify(refObjPublicAPIValidatorSpy, times(1)).validateReferenceObjectTypeCode(refObj.getTypeCode());
      verify(refObjPublicAPIValidatorSpy, times(1)).validateForInjection(refObj);
      verify(refObjPublicAPIValidatorSpy, times(1)).validateObjectDuration(refObj.getStartDate(), refObj.getEndDate());
    }

    @Test
    @DisplayName("Validate call to the validation method with event type - Update")
    public void validateRefObjectUpdateWithStartDate() {

      final ReferenceObjects refObj = Struct.create(ReferenceObjects.class);
      refObj.setStartDate(LocalDate.parse("2023-02-02"));
      refObj.setId("Dummy UUID");

      ReferenceObjectPublicApiValidator spyOfMock = spy(refObjPublicAPIValidator);

      doNothing().when(spyOfMock).integrityCheckForRefObject("Dummy UUID");
      doNothing().when(spyOfMock).validateReferenceObjectDate("Dummy UUID", LocalDate.parse("2023-02-02"), "startDate");

      spyOfMock.validateReferenceObjectPropertyApi(refObj, CqnService.EVENT_UPDATE);

      verify(spyOfMock, times(1)).integrityCheckForRefObject("Dummy UUID");
      verify(spyOfMock, times(1)).validateReferenceObjectDate("Dummy UUID", LocalDate.parse("2023-02-02"), "startDate");
      verify(spyOfMock, times(0)).validateObjectDuration(refObj.getStartDate(), refObj.getEndDate());
      verify(spyOfMock, times(0)).validateReferenceObjectTypeCode(refObj.getTypeCode());
    }

    @Test
    @DisplayName("Validate call to the validation method with event type - Update")
    public void validateRefObjectUpdateWithEndDate() {

      final ReferenceObjects refObj = Struct.create(ReferenceObjects.class);
      refObj.setEndDate(LocalDate.parse("2023-02-02"));
      refObj.setId("Dummy UUID");

      ReferenceObjectPublicApiValidator spyOfMock = spy(refObjPublicAPIValidator);

      doNothing().when(spyOfMock).integrityCheckForRefObject("Dummy UUID");
      doNothing().when(spyOfMock).validateReferenceObjectDate("Dummy UUID", LocalDate.parse("2023-02-02"), "endDate");

      spyOfMock.validateReferenceObjectPropertyApi(refObj, CqnService.EVENT_UPDATE);

      verify(spyOfMock, times(1)).integrityCheckForRefObject("Dummy UUID");
      verify(spyOfMock, times(1)).validateReferenceObjectDate("Dummy UUID", LocalDate.parse("2023-02-02"), "endDate");
      verify(spyOfMock, times(0)).validateObjectDuration(refObj.getStartDate(), refObj.getEndDate());
      verify(spyOfMock, times(0)).validateReferenceObjectTypeCode(refObj.getTypeCode());
    }

  }

  @Nested
  class ValidateReferenceObjectDateTest {

    @Test
    @DisplayName("Test when startDate is the input date type")
    public void ValidateReferenceObjectDateWithStartDateInput() {
      ReferenceObjectPublicApiValidator spyOfMock = spy(refObjPublicAPIValidator);
      Result mockResult = mock(Result.class);

      ReferenceObjects refObj = Struct.create(ReferenceObjects.class);
      refObj.setStartDate(LocalDate.parse("2023-01-01"));
      refObj.setEndDate(LocalDate.parse("2023-01-10"));

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.single(ReferenceObjects.class)).thenReturn(refObj);

      spyOfMock.validateReferenceObjectDate("Dummy-UUID", LocalDate.parse("2023-01-11"), "startDate");

      verify(messages, times(1)).error(MessageKeys.INVALID_START_DATE, refObj.getEndDate());

    }

    @Test
    @DisplayName("Test when endDate is the input date type")
    public void ValidateReferenceObjectDateWithEndDateInput() {
      ReferenceObjectPublicApiValidator spyOfMock = spy(refObjPublicAPIValidator);
      Result mockResult = mock(Result.class);

      ReferenceObjects refObj = Struct.create(ReferenceObjects.class);
      refObj.setStartDate(LocalDate.parse("2023-01-01"));
      refObj.setEndDate(LocalDate.parse("2023-01-10"));

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.single(ReferenceObjects.class)).thenReturn(refObj);

      spyOfMock.validateReferenceObjectDate("Dummy-UUID", LocalDate.parse("2022-12-31"), "endDate");

      verify(messages, times(1)).error(MessageKeys.INVALID_END_DATE, refObj.getStartDate());

    }

  }

  @Nested
  class ValidateIntegrityForRefObjectTest {

    @Test
    public void validateForErrorScenario() {
      ReferenceObjectPublicApiValidator spyOfMock = spy(refObjPublicAPIValidator);
      String mockReferenceObjectID = "Mock UUID";
      Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn(0L);

      spyOfMock.integrityCheckForRefObject(mockReferenceObjectID);

      verify(messages, times(1)).error(MessageKeys.INVALID_REFERENCEOBJECT);
    }

    @Test
    public void validateForSuccessScenario() {
      ReferenceObjectPublicApiValidator spyOfMock = spy(refObjPublicAPIValidator);
      String mockReferenceObjectID = "Mock UUID";
      Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn(1L);

      spyOfMock.integrityCheckForRefObject(mockReferenceObjectID);

      verify(messages, times(0)).error(MessageKeys.INVALID_REFERENCEOBJECT);
    }
  }

  @Nested
  class ValidateRefObjDeletionTest {

    @Test
    public void validateForSuccessScenario() {
      ReferenceObjectPublicApiValidator spyOfMock = spy(refObjPublicAPIValidator);
      String mockReferenceObjectID = "Mock UUID";
      Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn(0L);

      spyOfMock.validateRefObjDeletion(mockReferenceObjectID);

      verify(messages, times(0)).error(MessageKeys.REFOBJ_DELETION_NOT_POSSIBLE);
    }

    @Test
    public void validateForErrorScenario() {
      ReferenceObjectPublicApiValidator spyOfMock = spy(refObjPublicAPIValidator);
      String mockReferenceObjectID = "Mock UUID";
      Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn(1L);

      spyOfMock.validateRefObjDeletion(mockReferenceObjectID);

      verify(messages, times(1)).error(MessageKeys.REFOBJ_DELETION_NOT_POSSIBLE);
    }
  }

  @Nested
  class IntegrityCheckForTypeCodeTest {

    @Test
    public void validateForErrorScenario() {
      ReferenceObjectPublicApiValidator spyOfMock = spy(refObjPublicAPIValidator);
      Integer mockReferenceObjectTypeCode = 3;
      Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn(0L);

      spyOfMock.integrityCheckForTypeCode(mockReferenceObjectTypeCode);

      // Assert Error message thrown
      verify(messages, times(1)).error(MessageKeys.INVALID_REFERENCETYPE_CODE);
    }

    @Test
    public void validateForSuccessScenario() {
      ReferenceObjectPublicApiValidator spyOfMock = spy(refObjPublicAPIValidator);
      Integer mockReferenceObjectTypeCode = 1;
      Result mockResult = mock(Result.class);

      when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn(mockResult);
      when(mockResult.rowCount()).thenReturn(1L);

      spyOfMock.integrityCheckForTypeCode(mockReferenceObjectTypeCode);

      // Assert Error message not thrown
      verify(messages, times(0)).error(MessageKeys.INVALID_REFERENCETYPE_CODE);
    }
  }

}
