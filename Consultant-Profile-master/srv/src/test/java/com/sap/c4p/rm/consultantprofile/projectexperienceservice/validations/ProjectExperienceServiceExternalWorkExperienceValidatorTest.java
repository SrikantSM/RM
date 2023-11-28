package com.sap.c4p.rm.consultantprofile.projectexperienceservice.validations;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.function.Consumer;

import jakarta.annotation.Resource;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Answers;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;

import com.sap.c4p.rm.consultantprofile.InitMocks;
import com.sap.c4p.rm.consultantprofile.gen.MessageKeys;
import com.sap.c4p.rm.consultantprofile.utils.commonvalidations.CommonValidator;
import com.sap.cds.Result;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.messages.Messages;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.cds.services.request.RequestContext;
import com.sap.cds.services.runtime.CdsRuntime;
import com.sap.cds.services.runtime.RequestContextRunner;
import com.sap.resourcemanagement.employee.Headers;
import com.sap.resourcemanagement.employee.Headers_;

import myprojectexperienceservice.MyProjectExperienceService_;
import myresourcesservice.MyResourcesService_;
import projectexperienceservice.ExternalWorkExperience;
import projectexperienceservice.ProjectExperienceService_;

public class ProjectExperienceServiceExternalWorkExperienceValidatorTest extends InitMocks{

	@Mock
    private CommonValidator mockCommonValidator;

    @Mock(answer = Answers.RETURNS_DEEP_STUBS)
    private Messages messages;
    
    @Mock
    @Resource(name = MyProjectExperienceService_.CDS_NAME)
    private DraftService mockMyProjectExperienceService;

    @Mock
    @Resource(name = MyResourcesService_.CDS_NAME)
    private DraftService mockMyResourcesService;
    
    @Mock
    @Resource(name = ProjectExperienceService_.CDS_NAME)
    private CqnService mockProjectExperienceService;
    
    @Mock
    private PersistenceService mockPersistenceService;

    @Mock
    private Result mockResult;

    @Mock
    private RequestContextRunner mockRequestContextRunner;

    @Mock
    private CdsRuntime mockCdsRuntime;

    @Captor
    private ArgumentCaptor<Consumer<RequestContext>> consumerArgumentCaptor;
    
    private ProjectExperienceServiceExternalWorkExperienceValidator classUnderTest;
    
    @BeforeEach
    void setUp() {
        this.classUnderTest = new ProjectExperienceServiceExternalWorkExperienceValidator(mockCommonValidator, messages,
        		mockMyProjectExperienceService, mockMyResourcesService, mockCdsRuntime);
    }
    
    @Test
    @DisplayName("Verify if draft exists")
    void checkIfDraftExistsNoDraftTest() {
        ExternalWorkExperience externalWorkExperience = ExternalWorkExperience.create("test-ID");
        externalWorkExperience.setProfileID("test-profile-ID");
        when(mockCdsRuntime.requestContext()).thenReturn(mockRequestContextRunner);
        when(mockRequestContextRunner.privilegedUser()).thenReturn(mockRequestContextRunner);
        when(mockMyProjectExperienceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockMyResourcesService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.rowCount()).thenReturn(Long.valueOf(0));
        Assertions.assertDoesNotThrow(() -> classUnderTest.checkIfDraftExists(externalWorkExperience));
    }
    
    @Test
    @DisplayName("Verify if draft exists with null profile ID")
    void checkIfDraftExistsNullProfileIDTest() {
        ExternalWorkExperience externalWorkExperience = ExternalWorkExperience.create("test-ID");
        when(mockCdsRuntime.requestContext()).thenReturn(mockRequestContextRunner);
        when(mockRequestContextRunner.privilegedUser()).thenReturn(mockRequestContextRunner);
        when(mockProjectExperienceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.rowCount()).thenReturn(Long.valueOf(0));
        Assertions.assertDoesNotThrow(() -> classUnderTest.checkIfDraftExists(externalWorkExperience));
    }
    
    @Test
    @DisplayName("Check external work experience attributes for XSS")
    void checkExternalWorkExperienceForXSSTest() {
    	ExternalWorkExperience externalWorkExperience = ExternalWorkExperience.create("test-ID");
    	externalWorkExperience.setProfileID("test-profile-ID");
    	externalWorkExperience.setCompany("test-company");
    	externalWorkExperience.setProject("test-project");
    	externalWorkExperience.setRole("test-role");
    	externalWorkExperience.setComments("test-comments");
    	externalWorkExperience.setCustomer("test-customer");
        when(mockCommonValidator.validateFreeTextforScripting(any())).thenReturn(true);
        verify(this.messages, times(0)).throwIfError();
        Assertions.assertDoesNotThrow(() -> classUnderTest.checkExternalWorkExperienceForXSS(externalWorkExperience));
    }
    
    @Test
    @DisplayName("Check external work experience attributes for XSS - profile id is forbidden")
    void checkExternalWorkExperienceForXSSTestProfileIDForbidden() {
    	ExternalWorkExperience externalWorkExperience = ExternalWorkExperience.create("test-ID");
    	externalWorkExperience.setProfileID("<test>");
    	externalWorkExperience.setCompany("test-company");
    	externalWorkExperience.setProject("test-project");
    	externalWorkExperience.setRole("test-role");
    	externalWorkExperience.setComments("test-comments");
    	externalWorkExperience.setCustomer("test-customer");
    	when(mockCommonValidator.validateFreeTextforScripting("<test>")).thenReturn(false);
    	when(mockCommonValidator.validateFreeTextforScripting("test-company")).thenReturn(true);
    	when(mockCommonValidator.validateFreeTextforScripting("test-project")).thenReturn(true);
    	when(mockCommonValidator.validateFreeTextforScripting("test-role")).thenReturn(true);
    	when(mockCommonValidator.validateFreeTextforScripting("test-comments")).thenReturn(true);
    	when(mockCommonValidator.validateFreeTextforScripting("test-customer")).thenReturn(true);
        verify(this.messages, times(0)).throwIfError();
        Assertions.assertDoesNotThrow(() -> classUnderTest.checkExternalWorkExperienceForXSS(externalWorkExperience));
    }
    
    @Test
    @DisplayName("Check external work experience attributes for XSS - company is forbidden")
    void checkExternalWorkExperienceForXSSTestCompanyForbidden() {
    	ExternalWorkExperience externalWorkExperience = ExternalWorkExperience.create("test-ID");
    	externalWorkExperience.setProfileID("test-profile");
    	externalWorkExperience.setCompany("<test>");
    	externalWorkExperience.setProject("test-project");
    	externalWorkExperience.setRole("test-role");
    	externalWorkExperience.setComments("test-comments");
    	externalWorkExperience.setCustomer("test-customer");
    	when(mockCommonValidator.validateFreeTextforScripting("<test>")).thenReturn(false);
    	when(mockCommonValidator.validateFreeTextforScripting("test-profile")).thenReturn(true);
    	when(mockCommonValidator.validateFreeTextforScripting("test-project")).thenReturn(true);
    	when(mockCommonValidator.validateFreeTextforScripting("test-role")).thenReturn(true);
    	when(mockCommonValidator.validateFreeTextforScripting("test-comments")).thenReturn(true);
    	when(mockCommonValidator.validateFreeTextforScripting("test-customer")).thenReturn(true);
        verify(this.messages, times(0)).throwIfError();
        Assertions.assertDoesNotThrow(() -> classUnderTest.checkExternalWorkExperienceForXSS(externalWorkExperience));
    }
    
    @Test
    @DisplayName("Check external work experience attributes for XSS - project is forbidden")
    void checkExternalWorkExperienceForXSSTestProjectForbidden() {
    	ExternalWorkExperience externalWorkExperience = ExternalWorkExperience.create("test-ID");
    	externalWorkExperience.setProfileID("test-profile");
    	externalWorkExperience.setCompany("test-company");
    	externalWorkExperience.setProject("<test>");
    	externalWorkExperience.setRole("test-role");
    	externalWorkExperience.setComments("test-comments");
    	externalWorkExperience.setCustomer("test-customer");
    	when(mockCommonValidator.validateFreeTextforScripting("<test>")).thenReturn(false);
    	when(mockCommonValidator.validateFreeTextforScripting("test-company")).thenReturn(true);
    	when(mockCommonValidator.validateFreeTextforScripting("test-profile")).thenReturn(true);
    	when(mockCommonValidator.validateFreeTextforScripting("test-role")).thenReturn(true);
    	when(mockCommonValidator.validateFreeTextforScripting("test-comments")).thenReturn(true);
    	when(mockCommonValidator.validateFreeTextforScripting("test-customer")).thenReturn(true);
        verify(this.messages, times(0)).throwIfError();
        Assertions.assertDoesNotThrow(() -> classUnderTest.checkExternalWorkExperienceForXSS(externalWorkExperience));
    }
    
    @Test
    @DisplayName("Check external work experience attributes for XSS - role is forbidden")
    void checkExternalWorkExperienceForXSSTestRoleForbidden() {
    	ExternalWorkExperience externalWorkExperience = ExternalWorkExperience.create("test-ID");
    	externalWorkExperience.setProfileID("test-profile");
    	externalWorkExperience.setCompany("test-company");
    	externalWorkExperience.setProject("test-project");
    	externalWorkExperience.setRole("<test>");
    	externalWorkExperience.setComments("test-comments");
    	externalWorkExperience.setCustomer("test-customer");
    	when(mockCommonValidator.validateFreeTextforScripting("<test>")).thenReturn(false);
    	when(mockCommonValidator.validateFreeTextforScripting("test-company")).thenReturn(true);
    	when(mockCommonValidator.validateFreeTextforScripting("test-profile")).thenReturn(true);
    	when(mockCommonValidator.validateFreeTextforScripting("test-project")).thenReturn(true);
    	when(mockCommonValidator.validateFreeTextforScripting("test-comments")).thenReturn(true);
    	when(mockCommonValidator.validateFreeTextforScripting("test-customer")).thenReturn(true);
        verify(this.messages, times(0)).throwIfError();
        Assertions.assertDoesNotThrow(() -> classUnderTest.checkExternalWorkExperienceForXSS(externalWorkExperience));
    }
    
    @Test
    @DisplayName("Check external work experience attributes for XSS - comments is forbidden")
    void checkExternalWorkExperienceForXSSTestCommentsForbidden() {
    	ExternalWorkExperience externalWorkExperience = ExternalWorkExperience.create("test-ID");
    	externalWorkExperience.setProfileID("test-profile");
    	externalWorkExperience.setCompany("test-company");
    	externalWorkExperience.setProject("test-project");
    	externalWorkExperience.setRole("test-role");
    	externalWorkExperience.setComments("<test>");
    	externalWorkExperience.setCustomer("test-customer");
    	when(mockCommonValidator.validateFreeTextforScripting("<test>")).thenReturn(false);
    	when(mockCommonValidator.validateFreeTextforScripting("test-company")).thenReturn(true);
    	when(mockCommonValidator.validateFreeTextforScripting("test-profile")).thenReturn(true);
    	when(mockCommonValidator.validateFreeTextforScripting("test-project")).thenReturn(true);
    	when(mockCommonValidator.validateFreeTextforScripting("test-role")).thenReturn(true);
    	when(mockCommonValidator.validateFreeTextforScripting("test-customer")).thenReturn(true);
        verify(this.messages, times(0)).throwIfError();
        Assertions.assertDoesNotThrow(() -> classUnderTest.checkExternalWorkExperienceForXSS(externalWorkExperience));
    }
    
    @Test
    @DisplayName("Check external work experience attributes for XSS - customer is forbidden")
    void checkExternalWorkExperienceForXSSTestcustomerForbidden() {
    	ExternalWorkExperience externalWorkExperience = ExternalWorkExperience.create("test-ID");
    	externalWorkExperience.setProfileID("test-profile");
    	externalWorkExperience.setCompany("test-company");
    	externalWorkExperience.setProject("test-project");
    	externalWorkExperience.setRole("test-role");
    	externalWorkExperience.setComments("test-comments");
    	externalWorkExperience.setCustomer("<test>");
    	when(mockCommonValidator.validateFreeTextforScripting("<test>")).thenReturn(false);
    	when(mockCommonValidator.validateFreeTextforScripting("test-company")).thenReturn(true);
    	when(mockCommonValidator.validateFreeTextforScripting("test-profile")).thenReturn(true);
    	when(mockCommonValidator.validateFreeTextforScripting("test-project")).thenReturn(true);
    	when(mockCommonValidator.validateFreeTextforScripting("test-role")).thenReturn(true);
    	when(mockCommonValidator.validateFreeTextforScripting("test-comments")).thenReturn(true);
        verify(this.messages, times(0)).throwIfError();
        Assertions.assertDoesNotThrow(() -> classUnderTest.checkExternalWorkExperienceForXSS(externalWorkExperience));
    }
    
    @Test
    @DisplayName("Check foreign key for profile ID in external work experience - profile exists")
    void checkForeignKeyValueForAssignedProfileExistsTest() {
        ExternalWorkExperience externalWorkExperience = ExternalWorkExperience.create("test-ID");
        externalWorkExperience.setProfileID("test-profile-ID");
        when(mockCommonValidator.checkInputValueExistingDB(Headers_.CDS_NAME, Headers.ID,
        		externalWorkExperience.getProfileID())).thenReturn(true);
        Assertions.assertDoesNotThrow(() -> classUnderTest.checkForeignKeyValueForAssignedProfile(externalWorkExperience));
        verify(this.messages, times(0)).throwIfError();
    }
    
    @Test
    @DisplayName("Check foreign key for profile ID in external work experience - profile does not exists")
    void checkForeignKeyValueForAssignedProfileDoesNotExistsTest() {
        ExternalWorkExperience externalWorkExperience = ExternalWorkExperience.create("test-ID");
        externalWorkExperience.setProfileID("test-profile-ID");
        when(mockCommonValidator.checkInputValueExistingDB(Headers_.CDS_NAME, Headers.ID,
        		externalWorkExperience.getProfileID())).thenReturn(false);
        classUnderTest.checkForeignKeyValueForAssignedProfile(externalWorkExperience);
        verify(this.messages, times(1)).throwIfError();
        verify(this.messages, times(1)).error(MessageKeys.PROFILE_ID_DOES_NOT_EXIST);
    }
    
    @Test
    @DisplayName("validate External Work experience when start date is after end date")
    void validateStartDateTest() {
    	ExternalWorkExperience externalWorkExperience = ExternalWorkExperience.create("test-ID");
    	externalWorkExperience.setStartDate(LocalDate.of(1971, 1, 1));
    	externalWorkExperience.setEndDate(LocalDate.of(1970, 1, 1));
        classUnderTest.validateStartDate(externalWorkExperience);
        verify(this.messages, times(1)).throwIfError();
        verify(this.messages, times(1)).error(MessageKeys.STARTDATE_SHOULD_NOT_BE_GREATER_THAN_ENDDATE);
    }
}
