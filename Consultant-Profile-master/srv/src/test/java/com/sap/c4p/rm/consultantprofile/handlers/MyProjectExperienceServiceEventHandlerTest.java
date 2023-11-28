package com.sap.c4p.rm.consultantprofile.handlers;

import com.sap.c4p.rm.consultantprofile.InitMocks;
import com.sap.c4p.rm.consultantprofile.auditlog.AuditLogUtil;
import com.sap.c4p.rm.consultantprofile.cloudfoundry.service.malwarescan.MalwareScanResponse;
import com.sap.c4p.rm.consultantprofile.cloudfoundry.service.malwarescan.MalwareScanService;
import com.sap.c4p.rm.consultantprofile.gen.MessageKeys;
import com.sap.c4p.rm.consultantprofile.myprojectexperienceservice.validations.MyProjectExperienceHeaderRoleValidator;
import com.sap.c4p.rm.consultantprofile.myprojectexperienceservice.validations.MyProjectExperienceHeaderSkillValidator;
import com.sap.c4p.rm.consultantprofile.myprojectexperienceservice.validations.MyProjectExperienceHeaderValidator;
import com.sap.c4p.rm.consultantprofile.utils.CommonEventHandlerUtil;
import com.sap.c4p.rm.consultantprofile.utils.CqnUtil;
import com.sap.cds.Result;
import com.sap.cds.Struct;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.*;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.cds.CdsReadEventContext;
import com.sap.cds.services.draft.DraftCancelEventContext;
import com.sap.cds.services.draft.DraftNewEventContext;
import com.sap.cds.services.draft.DraftPatchEventContext;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.messages.Messages;
import com.sap.xs.audit.api.v2.AuditedDataSubject;
import myprojectexperienceservice.*;
import org.apache.commons.io.output.ByteArrayOutputStream;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.*;
import java.math.BigInteger;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.Mockito.*;

class MyProjectExperienceServiceEventHandlerTest extends InitMocks {

    @Mock
    private MyProjectExperienceHeaderValidator mockMyProjectExperienceHeaderValidator;
    @Mock
    private MyProjectExperienceHeaderSkillValidator mockMyProjectExperienceHeaderSkillValidator;
    @Mock
    private MyProjectExperienceHeaderRoleValidator mockMyProjectExperienceHeaderRoleValidator;
    @Mock
    private DraftNewEventContext mockDraftNewEventContext;
    @Mock
    private EventContext mockEventContext;
    @Mock
    private DraftPatchEventContext mockDraftPatchEventContext;
    @Mock
    private DraftCancelEventContext mockDraftCancelEventContext;
    @Mock
    private MyProjectExperienceHeader mockMyProjectExperienceHeader;
    @Mock
    private MyProjectExperienceHeader mockMyProjectExperienceHeader2;
    @Mock
    private ExternalWorkExperience mockExternalWorkExperience;
    @Mock
    private ExternalWorkExperienceSkills mockExternalWorkExperienceSkills;
    @Mock
    private ProfilePhoto mockProfilePhoto;
    @Mock
    private Attachment mockAttachment;
    @Mock
    private Result mockResult;
    @Mock
    private CqnUpdate mockCqnUpdate;
    @Mock
    private CqnInsert mockCqnInsert;
    @Mock
    private CqnDelete mockCqnDelete;
    @Mock
    private AnalysisResult mockAnalysisResult;
    @Mock
    public Roles mockRole;
    @Mock
    public Roles mockRole2;
    @Mock
    private Skills mockSkill;
    @Mock
    private Skills mockSkill2;
    @Mock
    private CqnUtil mockCqnUtil;
    @Mock
    private DraftService mockMyProjectExperienceService;
    @Mock
    private AuditedDataSubject mockAuditedDataSubject;
    @Mock
    private CqnAnalyzer mockCqnAnalyzer;
    @Mock
    private CqnStructuredTypeRef mockCqnStructuredTypeRef;
    @Mock
    private AuditLogUtil mockAuditLogUtil;
    @Mock
    private RoleMasterList mockRoleMasterList;
    @Mock
    private SkillMasterListAll mockSkillMasterListAll;
    @Mock
    private ProfileData mockProfile;
    @Mock(answer = Answers.RETURNS_DEEP_STUBS)
    private Messages messages;
    @Mock
    private Optional<RoleMasterList> mockOptionalRoleMasterList;
    @Mock
    private CommonEventHandlerUtil mockCommonEventHandlerUtil;
    @Mock
    private MalwareScanService mockMalwareScanService;
    @Mock
    private InputStream mockInputStream;
    @Mock
    private PeriodicAvailability periodicAvailability;
    @Mock
    private Utilization utilization;
    @Autowired
    @InjectMocks
    MyProjectExperienceServiceEventHandler classUnderTest;

    List<ExternalWorkExperience> externalWorkExperienceList;

    private static final String ID = "ID";
    private static final String DATA_SUBJECT_ROLE = "Project Team Member";
    private static final String DATA_SUBJECT_EMAIL = "dataSubject@sap.com";
    private static final String DATA_SUBJECT_ID = "dataSubject.test";
    private static final String ROLE_ASSIGNMENT_OBJECT_TYPE = "Roles";
    private static final String SKILL_ASSIGNMENT_OBJECT_TYPE = "Skills";
    private static final String PROJECT_EXPERIENCE_SERVICE_IDENTIFIER = "MyProjectExperience";
    private static final String CREATE_OPERATION = "create";
    private static final String UPDATE_OPERATION = "update";
    private static final String DELETE_OPERATION = "delete";
    protected static final Integer DEFAULT_MALWARE_SERVICE_TIMEOUT = 1000; // In Milliseconds
    protected static final Integer CV_UPLOAD_MALWARE_SERVICE_TIMEOUT = 2000; // In Milliseconds

    @BeforeEach
    public void setUp() {
        this.externalWorkExperienceList = Collections.singletonList(mockExternalWorkExperience);
        this.mockMyProjectExperienceHeader.setExternalWorkExperience(externalWorkExperienceList);
        this.classUnderTest.myProjectExperienceService = mockMyProjectExperienceService;
        this.classUnderTest.analyzer = mockCqnAnalyzer;
        this.classUnderTest.auditLogUtil = mockAuditLogUtil;

    }

    public static byte[] fromHexString(String src) {
        byte[] biBytes = new BigInteger("10" + src.replaceAll("\\s", ""), 16).toByteArray();
        return Arrays.copyOfRange(biBytes, 1, biBytes.length);
    }

    @Test
    @DisplayName("Verify if profile photo On handler accepts jpeg image")
    void testProfilePhotoValidationOnHandlerJpegImage() throws IOException {
        InputStream inputStream = new DataInputStream(
                new FileInputStream(new File("src/test/resources/testImages/profile.jpg")));
        ProfilePhoto profilePhoto = ProfilePhoto.create();
        profilePhoto.setEmployeeId("test-emp-ID");
        profilePhoto.setId("test-profile-ID");
        profilePhoto.setProfileImage(inputStream);
        MalwareScanResponse mockMalwareScanResponse = new MalwareScanResponse();
        mockMalwareScanResponse.setMalwareDetected(false);
        when(this.mockMalwareScanService.scanMalware(any(), anyInt(), any(), anyString())).thenReturn(mockMalwareScanResponse);
        this.classUnderTest.profilePhotoValidationOnHandler(mockDraftPatchEventContext, profilePhoto);
        assertNotNull(profilePhoto.getProfileThumbnail());
    }

    @Test
    @DisplayName("Verify if profile photo On handler accepts 2MB jpeg image")
    void testProfilePhotoValidationOnHandler2MbJpegImage() throws IOException {
        byte[] largeData = new byte[2097142];
        String jpegHexString = "FF D8 FF DB 00 43 00 20 FF D9";
        byte[] regularData = fromHexString(jpegHexString);
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        output.write(regularData);
        output.write(largeData);
        ProfilePhoto profilePhoto = ProfilePhoto.create();
        profilePhoto.setEmployeeId("test-emp-ID");
        profilePhoto.setId("test-profile-ID");
        profilePhoto.setProfileImage(output.toInputStream());
        MalwareScanResponse mockMalwareScanResponse = new MalwareScanResponse();
        mockMalwareScanResponse.setMalwareDetected(false);
        when(this.mockMalwareScanService.scanMalware(output.toByteArray(), DEFAULT_MALWARE_SERVICE_TIMEOUT, messages, "ProfilePhoto")).thenReturn(mockMalwareScanResponse);
        this.classUnderTest.profilePhotoValidationOnHandler(mockDraftPatchEventContext, profilePhoto);
        assertNotNull(profilePhoto.getProfileThumbnail());
        output.close();
    }

    @Test
    @DisplayName("Verify if profile photo On handler sets thumbnail to null")
    void testProfilePhotoValidationOnHandlerSetThumbnailToNull() throws IOException {
        String jpegHexString = "FF D8 FF DB 00 43 00 20 FF D9";
        byte[] regularData = fromHexString(jpegHexString);
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        output.write(regularData);
        ProfilePhoto profilePhoto = ProfilePhoto.create();
        profilePhoto.setEmployeeId("test-emp-ID");
        profilePhoto.setId("test-profile-ID");
        profilePhoto.setProfileImage(null);
        profilePhoto.setProfileThumbnail(output.toInputStream());
        verify(this.mockMalwareScanService, times(0)).scanMalware(any(), anyInt(), any(), anyString());
        this.classUnderTest.profilePhotoValidationOnHandler(mockDraftPatchEventContext, profilePhoto);
        assertEquals(null, profilePhoto.getProfileThumbnail());
        output.close();
    }

    @Test
    @DisplayName("Verify if profile photo On handler rejects large jpeg image")
    void testProfilePhotoValidationOnHandlerLargeJpegImage() throws IOException {
        byte[] largeData = new byte[2097143];
        String jpegHexString = "FF D8 FF DB 00 43 00 20 FF D9";
        byte[] regularData = fromHexString(jpegHexString);
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        output.write(regularData);
        output.write(largeData);
        ProfilePhoto profilePhoto = ProfilePhoto.create();
        profilePhoto.setEmployeeId("test-emp-ID");
        profilePhoto.setId("test-profile-ID");
        profilePhoto.setProfileImage(output.toInputStream());
        MalwareScanResponse mockMalwareScanResponse = new MalwareScanResponse();
        mockMalwareScanResponse.setMalwareDetected(false);
        when(this.mockMalwareScanService.scanMalware(output.toByteArray(), DEFAULT_MALWARE_SERVICE_TIMEOUT, messages, "test-entity")).thenReturn(mockMalwareScanResponse);
        this.classUnderTest.profilePhotoValidationOnHandler(mockDraftPatchEventContext, profilePhoto);
        verify(this.messages, times(1)).throwIfError();
        verify(this.messages, times(1)).error(MessageKeys.PROFILE_UPLOAD_SIZE_ERROR);
        output.close();
    }

    @Test
    @DisplayName("Verify if profile photo On handler accepts png image")
    void testProfilePhotoValidationOnHandlerPngImage() throws IOException {
        InputStream inputStream = new DataInputStream(
                new FileInputStream(new File("src/test/resources/testImages/profile.png")));
        ProfilePhoto profilePhoto = ProfilePhoto.create();
        profilePhoto.setEmployeeId("test-emp-ID");
        profilePhoto.setId("test-profile-ID");
        profilePhoto.setProfileImage(inputStream);
        MalwareScanResponse mockMalwareScanResponse = new MalwareScanResponse();
        mockMalwareScanResponse.setMalwareDetected(false);
        when(this.mockMalwareScanService.scanMalware(any(), anyInt(), any(), anyString())).thenReturn(mockMalwareScanResponse);
        this.classUnderTest.profilePhotoValidationOnHandler(mockDraftPatchEventContext, profilePhoto);
        assertNotNull(profilePhoto.getProfileThumbnail());
    }

    @Test
    @DisplayName("Verify if profile photo On handler rejects large png image")
    void testProfilePhotoValidationOnHandlerLargePngImage() throws IOException {
        byte[] largeData = new byte[2097143];
        String pngHexString = "89 50 4E 47 0D 0A 1A 0A 00 00";
        byte[] regularData = fromHexString(pngHexString);
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        output.write(regularData);
        output.write(largeData);
        ProfilePhoto profilePhoto = ProfilePhoto.create();
        profilePhoto.setEmployeeId("test-emp-ID");
        profilePhoto.setId("test-profile-ID");
        profilePhoto.setProfileImage(output.toInputStream());
        MalwareScanResponse mockMalwareScanResponse = new MalwareScanResponse();
        mockMalwareScanResponse.setMalwareDetected(false);
        when(this.mockMalwareScanService.scanMalware(output.toByteArray(), DEFAULT_MALWARE_SERVICE_TIMEOUT, messages, "test-entity")).thenReturn(mockMalwareScanResponse);
        this.classUnderTest.profilePhotoValidationOnHandler(mockDraftPatchEventContext, profilePhoto);
        verify(this.messages, times(1)).throwIfError();
        verify(this.messages, times(1)).error(MessageKeys.PROFILE_UPLOAD_SIZE_ERROR);
        output.close();
    }

    @Test
    @DisplayName("Verify if profile photo On handler rejects image with malware")
    void testProfilePhotoValidationOnHandlerMalwareDetected() throws IOException {
        String pngHexString = "89 50 4E 47 0D 0A 1A 0A 00 00";
        byte[] regularData = fromHexString(pngHexString);
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        output.write(regularData);
        ProfilePhoto profilePhoto = ProfilePhoto.create();
        profilePhoto.setEmployeeId("test-emp-ID");
        profilePhoto.setId("test-profile-ID");
        profilePhoto.setProfileImage(output.toInputStream());
        MalwareScanResponse mockMalwareScanResponse = new MalwareScanResponse();
        mockMalwareScanResponse.setMalwareDetected(true);
        when(this.mockMalwareScanService.scanMalware(output.toByteArray(), DEFAULT_MALWARE_SERVICE_TIMEOUT, messages, "ProfilePhoto")).thenReturn(mockMalwareScanResponse);
        this.classUnderTest.profilePhotoValidationOnHandler(mockDraftPatchEventContext, profilePhoto);
        verify(this.messages, times(1)).throwIfError();
        verify(this.messages, times(1)).error(MessageKeys.MALWARE_DETECTED_ERROR);
        output.close();
    }

    @Test
    @DisplayName("Verify if profile photo On handler rejects image when malware service returns null response")
    void testProfilePhotoValidationOnHandlerMalwareScannerNullResponse() throws IOException {
        String pngHexString = "89 50 4E 47 0D 0A 1A 0A 00 00";
        byte[] regularData = fromHexString(pngHexString);
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        output.write(regularData);
        ProfilePhoto profilePhoto = ProfilePhoto.create();
        profilePhoto.setEmployeeId("test-emp-ID");
        profilePhoto.setId("test-profile-ID");
        profilePhoto.setProfileImage(output.toInputStream());
        when(this.mockMalwareScanService.scanMalware(output.toByteArray(), DEFAULT_MALWARE_SERVICE_TIMEOUT, messages, "ProfilePhoto")).thenReturn(null);
        verify(this.messages, times(0)).throwIfError();
        output.close();
    }

    @Test
    @DisplayName("Verify if profile photo On handler rejects non image input stream")
    void testProfilePhotoValidationOnHandlerNonImage() throws IOException {
        String pngHexString = "00 00 00 47 0D 0A 1A 0A 00 00";
        byte[] regularData = fromHexString(pngHexString);
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        output.write(regularData);
        ProfilePhoto profilePhoto = ProfilePhoto.create();
        profilePhoto.setEmployeeId("test-emp-ID");
        profilePhoto.setId("test-profile-ID");
        profilePhoto.setProfileImage(output.toInputStream());
        MalwareScanResponse mockMalwareScanResponse = new MalwareScanResponse();
        mockMalwareScanResponse.setMalwareDetected(false);
        when(this.mockMalwareScanService.scanMalware(output.toByteArray(), DEFAULT_MALWARE_SERVICE_TIMEOUT, messages, "test-entity")).thenReturn(mockMalwareScanResponse);
        this.classUnderTest.profilePhotoValidationOnHandler(mockDraftPatchEventContext, profilePhoto);
        verify(this.messages, times(1)).throwIfError();
        verify(this.messages, times(1)).error(MessageKeys.PROFILE_UPLOAD_MIME_TYPE_ERROR);
        output.close();
    }

    @Test
    @DisplayName("Verify if profile photo On handler rejects image input stream which throws IOException")
    void testProfilePhotoValidationOnHandlerIOException() throws IOException {
        byte[] buffer = new byte[20480];
        when(this.mockInputStream.read(buffer)).thenThrow(IOException.class);
        ProfilePhoto profilePhoto = ProfilePhoto.create();
        profilePhoto.setEmployeeId("test-emp-ID");
        profilePhoto.setId("test-profile-ID");
        profilePhoto.setProfileImage(mockInputStream);
        classUnderTest.profilePhotoValidationOnHandler(mockDraftPatchEventContext, profilePhoto);
        verify(this.messages, times(1)).throwIfError();
        verify(this.messages, times(1)).error(MessageKeys.PROFILE_UPLOAD_IO_ERROR);
    }

    @Test
    @DisplayName("Verify if attachment Before handler accepts 2MB pdf file")
    void testAttachmentValidationBeforeHandler2MbPdfFile() throws IOException {
        Path testFilePath = Paths.get("src/test/resources/test-attachments/integration-logs.pdf");
        byte[] inputArray = Files.readAllBytes(testFilePath);
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        output.write(inputArray);
        Attachment attachment = Attachment.create();
        attachment.setEmployeeId("test-emp-ID");
        attachment.setId("test-profile-ID");
        attachment.setContent(output.toInputStream());
        attachment.setFileName("test-resume.pdf");
        MalwareScanResponse mockMalwareScanResponse = new MalwareScanResponse();
        mockMalwareScanResponse.setMalwareDetected(false);
        when(this.mockMalwareScanService.scanMalware(output.toByteArray(), CV_UPLOAD_MALWARE_SERVICE_TIMEOUT, messages, "test-entity")).thenReturn(mockMalwareScanResponse);
        this.classUnderTest.resumeValidationBeforeHandler(attachment);
        assertNotNull(attachment.getFileName());
        output.close();
    }

    @Test
    @DisplayName("Verify if attachment Before handler sets fileName to null")
    void testAttachmentValidationBeforeHandlerSetFileNameToNull() throws IOException {
        Attachment attachment = Attachment.create();
        attachment.setEmployeeId("test-emp-ID");
        attachment.setId("test-profile-ID");
        attachment.setContent(null);
        verify(this.mockMalwareScanService, times(0)).scanMalware(any(), anyInt(), any(), anyString());
        this.classUnderTest.resumeValidationBeforeHandler(attachment);
        assertEquals(null, attachment.getFileName());
    }

    @Test
    @DisplayName("Verify if attachment Before handler rejects large pdf file")
    void testAttachmentValidationBeforeHandlerLargePdfFile() throws IOException {
        byte[] largeData = new byte[209714];
        Path testFilePath = Paths.get("src/test/resources/test-attachments/integration-logs.pdf");
        byte[] inputArray = Files.readAllBytes(testFilePath);
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        output.write(inputArray);
        output.write(largeData);
        Attachment attachment = Attachment.create();
        attachment.setEmployeeId("test-emp-ID");
        attachment.setId("test-profile-ID");
        attachment.setFileName("integration-logs.pdf");
        attachment.setContent(output.toInputStream());
        MalwareScanResponse mockMalwareScanResponse = new MalwareScanResponse();
        mockMalwareScanResponse.setMalwareDetected(false);
        when(this.mockMalwareScanService.scanMalware(output.toByteArray(), CV_UPLOAD_MALWARE_SERVICE_TIMEOUT, messages, "test-entity")).thenReturn(mockMalwareScanResponse);
        this.classUnderTest.resumeValidationBeforeHandler(attachment);
        verify(this.messages, times(1)).throwIfError();
        verify(this.messages, times(1)).error(MessageKeys.PROFILE_UPLOAD_SIZE_ERROR);
        output.close();
    }

    @Test
    @DisplayName("Verify if attachment Before handler rejects large docx file")
    void testAttachmentValidationBeforeHandlerLargeDocxFile() throws IOException {
        Path testFilePath = Paths.get("src/test/resources/test-attachments/air-pollution-lf.docx");
        byte[] inputArray = Files.readAllBytes(testFilePath);
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        output.write(inputArray);
        Attachment attachment = Attachment.create();
        attachment.setEmployeeId("test-emp-ID");
        attachment.setId("test-profile-ID");
        attachment.setContent(output.toInputStream());
        attachment.setFileName("air-pollution-lf.docx");
        MalwareScanResponse mockMalwareScanResponse = new MalwareScanResponse();
        mockMalwareScanResponse.setMalwareDetected(false);
        when(this.mockMalwareScanService.scanMalware(output.toByteArray(), CV_UPLOAD_MALWARE_SERVICE_TIMEOUT, messages, "test-entity")).thenReturn(mockMalwareScanResponse);
        this.classUnderTest.resumeValidationBeforeHandler(attachment);
        verify(this.messages, times(1)).throwIfError();
        verify(this.messages, times(1)).error(MessageKeys.PROFILE_UPLOAD_SIZE_ERROR);
        output.close();
    }

    @Test
    @DisplayName("Verify if attachment Before handler rejects file with malware")
    void testAttachmentValidationBeforeHandlerMalwareDetected() throws IOException {
        Path testFilePath = Paths.get("src/test/resources/test-attachments/test-resume.pdf");
        byte[] inputArray = Files.readAllBytes(testFilePath);
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        output.write(inputArray);
        Attachment attachment = Attachment.create();
        attachment.setEmployeeId("test-emp-ID");
        attachment.setId("test-profile-ID");
        attachment.setContent(output.toInputStream());
        MalwareScanResponse mockMalwareScanResponse = new MalwareScanResponse();
        mockMalwareScanResponse.setMalwareDetected(true);
        when(this.mockMalwareScanService.scanMalware(output.toByteArray(), CV_UPLOAD_MALWARE_SERVICE_TIMEOUT, messages, "Resume")).thenReturn(mockMalwareScanResponse);
        this.classUnderTest.resumeValidationBeforeHandler(attachment);
        verify(this.messages, times(1)).throwIfError();
        verify(this.messages, times(1)).error(MessageKeys.MALWARE_DETECTED_ERROR);
        output.close();
    }

    @Test
    @DisplayName("Verify if attachment Before handler rejects file when malware service returns null response")
    void testAttachmentValidationOnHandlerMalwareScannerNullResponse() throws IOException {
        Path testFilePath = Paths.get("src/test/resources/test-attachments/test-resume.pdf");
        byte[] inputArray = Files.readAllBytes(testFilePath);
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        output.write(inputArray);
        Attachment attachment = Attachment.create();
        attachment.setEmployeeId("test-emp-ID");
        attachment.setId("test-profile-ID");
        attachment.setContent(output.toInputStream());
        when(this.mockMalwareScanService.scanMalware(output.toByteArray(), CV_UPLOAD_MALWARE_SERVICE_TIMEOUT, messages, "Resume")).thenReturn(null);
        this.classUnderTest.resumeValidationBeforeHandler(attachment);
        verify(this.messages, times(0)).throwIfError();
        output.close();
    }

    @DisplayName("Verify if attachment After handler throws error when file size for decompression is larger than 2MB")
    @Test void testAttachmentValidationAfterHandlerThrowsErrorOnLargeInput() throws IOException {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        Path testFilePath = Paths.get("src/test/resources/test-attachments/air-pollution-lf.docx");
        byte[] inputArray = Files.readAllBytes(testFilePath);
        output.write(inputArray);
        Attachment attachment = Attachment.create();
        attachment.setContent(output.toInputStream());
        attachment.setFileName("air-pollution-lf.docx");
        this.classUnderTest.resumeValidationAfterHandler(attachment);
        verify(this.messages, times(1)).throwIfError();
        verify(this.messages, times((1))).error(MessageKeys.PROFILE_UPLOAD_SIZE_ERROR);
    }

    @DisplayName("Verify if attachment After handler invokes decompression")
    @Test
    void testAttachmentValidationAfterHandler() throws IOException {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        Path testFilePath = Paths.get("src/test/resources/test-attachments/test-resume.pdf");
        byte[] inputArray = Files.readAllBytes(testFilePath);
        output.write(inputArray);
        Attachment attachment = Attachment.create();
        attachment.setContent(output.toInputStream());
        attachment.setFileName("test-resume.pdf");
        this.classUnderTest.resumeValidationAfterHandler(attachment);
        assertNotNull(attachment.getContent());
    }

    @Test
    @DisplayName("Verify if Before Upsert event invokes the validation of MyProjectExperienceHeader")
    void testBeforeUpsertMyProjectExperienceHeader() {
        when(mockMyProjectExperienceHeader.getProfilePhoto()).thenReturn(mockProfilePhoto);
        when(mockMyProjectExperienceHeader2.getProfilePhoto()).thenReturn(mockProfilePhoto);
        when(mockProfilePhoto.getProfileImage()).thenReturn(null);
        when(mockMyProjectExperienceHeader.getAttachment()).thenReturn(mockAttachment);
        when(mockMyProjectExperienceHeader2.getAttachment()).thenReturn(mockAttachment);
        when(mockAttachment.getContent()).thenReturn(null);
        MyProjectExperienceServiceEventHandler classUnderTestSpy = Mockito.spy(classUnderTest);
        Mockito.doReturn(mockAuditedDataSubject).when(classUnderTestSpy).getAuditedDataSubject(any(), any(), any());
        when(mockMyProjectExperienceHeader.getProfile()).thenReturn(mockProfile);
        when(mockProfile.getDataSubjectRole()).thenReturn(DATA_SUBJECT_ROLE);
        when(mockProfile.getEmailAddress()).thenReturn(DATA_SUBJECT_EMAIL);
        when(mockProfile.getWorkerExternalID()).thenReturn(DATA_SUBJECT_ID);
        when(this.mockMyProjectExperienceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.first(MyProjectExperienceHeader.class)).thenReturn(Optional.of(mockMyProjectExperienceHeader));
        // action
        classUnderTestSpy.beforeUpsertMyProjectExperienceHeader(mockEventContext, mockMyProjectExperienceHeader);
        verify(this.messages, times(1)).throwIfError();
        verify(this.mockMyProjectExperienceHeaderValidator, times(1))
                .validateMyProjectExperienceHeaderProperty(mockMyProjectExperienceHeader);
    }

    @Test
    @DisplayName("Check If RoleID is being added with invalid length during Draft Patch Event")
    void testBeforeDraftPatchForRoles() {
        when(this.mockMyProjectExperienceHeaderRoleValidator.checkInputFieldLength(any(Roles.class))).thenReturn(false);
        this.classUnderTest.beforeDraftPatchForRoles(mockDraftPatchEventContext, mockRole);
        verify(this.messages, times(1)).throwIfError();
    }

    @Test
    @DisplayName("Check If RoleID retrieved Draft Patch Event is empty")
    void testBeforeDraftPatchForRolesEmpty() {
        Roles role1 = Struct.create(Roles.class);
        Map<String, Object> roleIDMap1 = new HashMap<>();
        roleIDMap1.put(ID, UUID.randomUUID().toString());
        role1.setRole(roleIDMap1);
        Optional<Roles> mockOptRole = Optional.of(role1);

        when(mockResult.first(Roles.class)).thenReturn(mockOptRole);
        when(mockOptionalRoleMasterList.isPresent()).thenReturn(false);
        Roles role = Struct.create(Roles.class);
        role.setRoleId("b08aabdf-6dcb-4df7-b319-b440f073e6dc");
        when(this.mockMyProjectExperienceHeaderRoleValidator.checkInputFieldLength(role)).thenReturn(true);
        when(mockCqnAnalyzer.analyze(any(CqnStructuredTypeRef.class))).thenReturn(mockAnalysisResult);
        when(mockDraftPatchEventContext.getCqn()).thenReturn(mockCqnUpdate);
        when(mockCqnUpdate.ref()).thenReturn(mockCqnStructuredTypeRef);
        when(mockResult.first(RoleMasterList.class)).thenReturn(mockOptionalRoleMasterList);
        Map<String, Object> roleIDMap = new HashMap<>();
        roleIDMap.put(ID, UUID.randomUUID().toString());
        when(mockAnalysisResult.targetKeys()).thenReturn(roleIDMap);
        when(mockMyProjectExperienceService.run(any(CqnSelect.class))).thenReturn(mockResult);

        this.classUnderTest.beforeDraftPatchForRoles(mockDraftPatchEventContext, role);
        verify(this.messages, times(1)).throwIfError();
    }

    @Test
    @DisplayName("Pass valid RoleID during Draft Patch Event and check for audit log call")
    void testBeforeDraftPatchForRoles1() {
        when(mockMyProjectExperienceHeaderRoleValidator.checkInputFieldLength(any(Roles.class))).thenReturn(false);
        when(mockCqnAnalyzer.analyze(any(CqnStructuredTypeRef.class))).thenReturn(mockAnalysisResult);
        when(mockDraftPatchEventContext.getCqn()).thenReturn(mockCqnUpdate);
        when(mockCqnUpdate.ref()).thenReturn(mockCqnStructuredTypeRef);
        Map<String, Object> roleIDMap = new HashMap<>();
        roleIDMap.put(ID, UUID.randomUUID().toString());
        when(mockAnalysisResult.targetKeys()).thenReturn(roleIDMap);
        when(mockMyProjectExperienceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.first(RoleMasterList.class)).thenReturn(Optional.of(mockRoleMasterList));
        MyProjectExperienceServiceEventHandler classUnderTestSpy = Mockito.spy(classUnderTest);
        Mockito.doReturn(mockRole).when(classUnderTestSpy).getExpandedDataOfRoleAssignments(any(), anyBoolean());
        Mockito.doReturn(mockAuditedDataSubject).when(classUnderTestSpy).getAuditedDataSubject(any(), any(), any());
        Mockito.doReturn(true).when(classUnderTestSpy).isValidGuid(any());
        HashMap<String, String> createEntity = new HashMap<>();
        createEntity.put(ID, UUID.randomUUID().toString());
        Mockito.doReturn(createEntity).when(classUnderTestSpy).prepareRoleEntity(any(), any(), any());
        when(mockRole.getProfile()).thenReturn(mockProfile);
        when(mockProfile.getDataSubjectRole()).thenReturn(DATA_SUBJECT_ROLE);
        when(mockProfile.getEmailAddress()).thenReturn(DATA_SUBJECT_EMAIL);
        when(mockProfile.getWorkerExternalID()).thenReturn(DATA_SUBJECT_ID);
        classUnderTestSpy.beforeDraftPatchForRoles(mockDraftPatchEventContext, mockRole);
        verify(this.mockAuditLogUtil, times(1)).logDataModificationAuditMessage(mockDraftPatchEventContext,
                ROLE_ASSIGNMENT_OBJECT_TYPE, PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, createEntity, null,
                mockAuditedDataSubject, CREATE_OPERATION);
    }

    @Test
    @DisplayName("Pass valid RoleID during Draft Patch Event and check for audit log call")
    void testBeforeDraftPatchForRoles2() {
        when(mockMyProjectExperienceHeaderRoleValidator.checkInputFieldLength(any(Roles.class))).thenReturn(false);
        when(mockCqnAnalyzer.analyze(any(CqnStructuredTypeRef.class))).thenReturn(mockAnalysisResult);
        when(mockDraftPatchEventContext.getCqn()).thenReturn(mockCqnUpdate);
        when(mockCqnUpdate.ref()).thenReturn(mockCqnStructuredTypeRef);
        Map<String, Object> roleIDMap = new HashMap<>();
        roleIDMap.put(ID, UUID.randomUUID().toString());
        when(mockAnalysisResult.targetKeys()).thenReturn(roleIDMap);
        when(mockMyProjectExperienceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.first(RoleMasterList.class)).thenReturn(Optional.of(mockRoleMasterList));
        MyProjectExperienceServiceEventHandler classUnderTestSpy = Mockito.spy(classUnderTest);
        Mockito.doReturn(mockRole).when(classUnderTestSpy).getExpandedDataOfRoleAssignments(any(), anyBoolean());
        when(mockRole.getRole()).thenReturn(mockRoleMasterList);
        Mockito.doReturn(mockAuditedDataSubject).when(classUnderTestSpy).getAuditedDataSubject(any(), any(), any());
        Mockito.doReturn(true).when(classUnderTestSpy).isValidGuid(any());
        HashMap<String, String> createEntity = new HashMap<>();
        createEntity.put(ID, UUID.randomUUID().toString());
        Mockito.doReturn(createEntity).when(classUnderTestSpy).prepareRoleEntity(any(), any(), any());
        when(mockRole.getProfile()).thenReturn(mockProfile);
        when(mockProfile.getDataSubjectRole()).thenReturn(DATA_SUBJECT_ROLE);
        when(mockProfile.getEmailAddress()).thenReturn(DATA_SUBJECT_EMAIL);
        when(mockProfile.getWorkerExternalID()).thenReturn(DATA_SUBJECT_ID);
        classUnderTestSpy.beforeDraftPatchForRoles(mockDraftPatchEventContext, mockRole);
        verify(this.mockAuditLogUtil, times(1)).logDataModificationAuditMessage(mockDraftPatchEventContext,
                ROLE_ASSIGNMENT_OBJECT_TYPE, PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, createEntity, createEntity,
                mockAuditedDataSubject, UPDATE_OPERATION);
    }

    @Test
    @DisplayName("change draft with too long skill id should fail")
    void testRejectTooLongSkillIds() {
        when(this.mockMyProjectExperienceHeaderSkillValidator.checkInputFieldLength(any())).thenReturn(false);
        Skills skillAssignment = Skills.create();
        skillAssignment.setSkillId("too-long-for-a-normal-uuid-so-it-should-fail");
        this.classUnderTest.rejectTooLongSkillIds(skillAssignment);
        verify(this.messages, times(1)).throwIfError();
    }

    @Test
    @DisplayName("pass valid SkillID+ProficiencyLevelID and check for the audit log call")
    void testBeforeDraftPatchForSkill() {
        // Mock Profile
        when(mockProfile.getDataSubjectRole()).thenReturn(DATA_SUBJECT_ROLE);
        when(mockProfile.getEmailAddress()).thenReturn(DATA_SUBJECT_EMAIL);
        when(mockProfile.getWorkerExternalID()).thenReturn(DATA_SUBJECT_ID);

        // Mock Master Data
        SkillMasterListAll skill = SkillMasterListAll.create();
        skill.setId(UUID.randomUUID().toString());
        skill.setName(UUID.randomUUID().toString());
        skill.setDescription(UUID.randomUUID().toString());
        ProficiencyLevels proficiencyLevel = ProficiencyLevels.create();
        proficiencyLevel.setId(UUID.randomUUID().toString());
        proficiencyLevel.setName(UUID.randomUUID().toString());
        proficiencyLevel.setDescription(UUID.randomUUID().toString());
        proficiencyLevel.setRank(2);

        // Mock Old Data
        Skills oldSkillAssignment = Skills.create();
        oldSkillAssignment.setId(UUID.randomUUID().toString());
        oldSkillAssignment.setSkill(skill);
        oldSkillAssignment.setProficiencyLevel(proficiencyLevel);
        oldSkillAssignment.setProfile(mockProfile);

        // Mock CQN Analyzer
        when(mockCqnAnalyzer.analyze(any(CqnStructuredTypeRef.class))).thenReturn(mockAnalysisResult);
        when(mockDraftPatchEventContext.getCqn()).thenReturn(mockCqnUpdate);
        when(mockCqnUpdate.ref()).thenReturn(mockCqnStructuredTypeRef);
        Map<String, Object> skillIDMap = new HashMap<>();
        skillIDMap.put(ID, oldSkillAssignment.getId());
        when(mockAnalysisResult.targetKeys()).thenReturn(skillIDMap);

        // Mock Master Data Queries
        when(mockMyProjectExperienceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.first(SkillMasterListAll.class)).thenReturn(Optional.of(skill));
        when(mockResult.first(ProficiencyLevels.class)).thenReturn(Optional.of(proficiencyLevel));

        // Mock internal methods of CUT
        MyProjectExperienceServiceEventHandler classUnderTestSpy = spy(classUnderTest);
        doReturn(oldSkillAssignment).when(classUnderTestSpy).getExpandedDataOfSkillAssignments(any(), anyBoolean());
        doReturn(mockAuditedDataSubject).when(classUnderTestSpy).getAuditedDataSubject(any(), any(), any());
        doReturn(true).when(classUnderTestSpy).isValidGuid(any());

        // input skill: skillID + proficiencyID
        Skills skillAssignment = Skills.create();
        skillAssignment.setSkillId(skill.getId());
        skillAssignment.setProficiencyLevelId(proficiencyLevel.getId());

        // output audit log entity
        HashMap<String, String> audit = new HashMap<>();
        audit.put("name", skill.getName());
        audit.put("description", skill.getDescription());
        audit.put("proficiencyLevelName", proficiencyLevel.getName());
        audit.put("proficiencyLevelDescription", proficiencyLevel.getDescription());
        audit.put("proficiencyLevel", proficiencyLevel.getRank().toString());

        classUnderTestSpy.beforeDraftPatchForSkill(mockDraftPatchEventContext, skillAssignment);
        verify(this.mockAuditLogUtil, times(1)).logDataModificationAuditMessage(mockDraftPatchEventContext,
                SKILL_ASSIGNMENT_OBJECT_TYPE, PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, audit, audit,
                mockAuditedDataSubject, UPDATE_OPERATION);
    }

    @Test
    @DisplayName("pass valid ProficiencyLevelID and check for the audit log call")
    void testBeforeDraftPatchForSkillLevelOnly() {
        // Mock Profile
        when(mockProfile.getDataSubjectRole()).thenReturn(DATA_SUBJECT_ROLE);
        when(mockProfile.getEmailAddress()).thenReturn(DATA_SUBJECT_EMAIL);
        when(mockProfile.getWorkerExternalID()).thenReturn(DATA_SUBJECT_ID);

        // Mock Master Data
        SkillMasterListAll skill = SkillMasterListAll.create();
        skill.setId(UUID.randomUUID().toString());
        skill.setName(UUID.randomUUID().toString());
        skill.setDescription(UUID.randomUUID().toString());
        ProficiencyLevels proficiencyLevel = ProficiencyLevels.create();
        proficiencyLevel.setId(UUID.randomUUID().toString());
        proficiencyLevel.setName(UUID.randomUUID().toString());
        proficiencyLevel.setDescription(UUID.randomUUID().toString());
        proficiencyLevel.setRank(2);

        // Mock Old Data
        Skills oldSkillAssignment = Skills.create();
        oldSkillAssignment.setId(UUID.randomUUID().toString());
        oldSkillAssignment.setSkill(skill);
        oldSkillAssignment.setProficiencyLevel(proficiencyLevel);
        oldSkillAssignment.setProfile(mockProfile);

        // Mock CQN Analyzer
        when(mockCqnAnalyzer.analyze(any(CqnStructuredTypeRef.class))).thenReturn(mockAnalysisResult);
        when(mockDraftPatchEventContext.getCqn()).thenReturn(mockCqnUpdate);
        when(mockCqnUpdate.ref()).thenReturn(mockCqnStructuredTypeRef);
        Map<String, Object> skillIDMap = new HashMap<>();
        skillIDMap.put(ID, oldSkillAssignment.getId());
        when(mockAnalysisResult.targetKeys()).thenReturn(skillIDMap);

        // Mock Master Data Queries
        when(mockMyProjectExperienceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.first(SkillMasterListAll.class)).thenReturn(Optional.of(skill));
        when(mockResult.first(ProficiencyLevels.class)).thenReturn(Optional.of(proficiencyLevel));

        // Mock internal methods of CUT
        MyProjectExperienceServiceEventHandler classUnderTestSpy = spy(classUnderTest);
        doReturn(oldSkillAssignment).when(classUnderTestSpy).getExpandedDataOfSkillAssignments(any(), anyBoolean());
        doReturn(mockAuditedDataSubject).when(classUnderTestSpy).getAuditedDataSubject(any(), any(), any());
        doReturn(true).when(classUnderTestSpy).isValidGuid(any());

        // input skill: skillID + proficiencyID
        Skills skillAssignment = Skills.create();
        skillAssignment.setProficiencyLevelId(proficiencyLevel.getId());

        // output audit log entity
        HashMap<String, String> audit = new HashMap<>();
        audit.put("proficiencyLevelName", proficiencyLevel.getName());
        audit.put("proficiencyLevelDescription", proficiencyLevel.getDescription());
        audit.put("proficiencyLevel", proficiencyLevel.getRank().toString());

        classUnderTestSpy.beforeDraftPatchForSkill(mockDraftPatchEventContext, skillAssignment);
        verify(this.mockAuditLogUtil, times(1)).logDataModificationAuditMessage(mockDraftPatchEventContext,
                SKILL_ASSIGNMENT_OBJECT_TYPE, PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, audit, audit,
                mockAuditedDataSubject, UPDATE_OPERATION);
    }

    @Test
    @DisplayName("Verify if populateExternalWorkExperienceSkillsWithParentIDData invokes getRootIDForDraftNewEvent in cqnUtil")
    void testPopulateExternalWorkExperienceSkillsWithParentIDData() {
        when(mockDraftNewEventContext.getCqn()).thenReturn(mockCqnInsert);
        classUnderTest.populateExternalWorkExperienceSkillsWithParentIDData(mockExternalWorkExperienceSkills,
                mockDraftNewEventContext);
        verify(this.mockCqnUtil, times(1)).getRootKey(mockDraftNewEventContext, mockCqnInsert, "ID");
    }

    @Test
    @DisplayName("Verify draft cancel event for my project experience header update scenario")
    void beforeDraftCancelForMyProjectExperienceHeader() {
        when(mockCqnAnalyzer.analyze(any(CqnStructuredTypeRef.class))).thenReturn(mockAnalysisResult);
        when(mockDraftCancelEventContext.getCqn()).thenReturn(mockCqnDelete);
        when(mockCqnDelete.ref()).thenReturn(mockCqnStructuredTypeRef);
        Map<String, Object> myProjectExperienceHeaderIDMap = new HashMap<>();
        myProjectExperienceHeaderIDMap.put(ID, UUID.randomUUID().toString());
        when(mockAnalysisResult.targetKeys()).thenReturn(myProjectExperienceHeaderIDMap);
        when(mockMyProjectExperienceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.first(MyProjectExperienceHeader.class)).thenReturn(Optional.of(mockMyProjectExperienceHeader));
        when(mockMyProjectExperienceHeader.getRoles()).thenReturn(Collections.singletonList(mockRole));
        when(mockRole.size()).thenReturn(1);
        when(mockRole.getId()).thenReturn(UUID.randomUUID().toString());
        when(mockRole.getRoleId()).thenReturn(UUID.randomUUID().toString());
        when(mockMyProjectExperienceHeader.getSkills()).thenReturn(Collections.singletonList(mockSkill));
        when(mockSkill.size()).thenReturn(1);
        when(mockSkill.getId()).thenReturn(UUID.randomUUID().toString());
        when(mockSkill.getSkillId()).thenReturn(UUID.randomUUID().toString());
        MyProjectExperienceServiceEventHandler classUnderTestSpy = Mockito.spy(classUnderTest);
        Mockito.doReturn(mockAuditedDataSubject).when(classUnderTestSpy).getAuditedDataSubject(any(), any(), any());
        Mockito.doReturn(mockSkill).when(classUnderTestSpy).getExpandedDataOfSkillAssignments(any(), anyBoolean());
        Mockito.doReturn(mockRole).when(classUnderTestSpy).getExpandedDataOfRoleAssignments(any(), anyBoolean());
        HashMap<String, String> currentEntity = new HashMap<>();
        currentEntity.put(ID, UUID.randomUUID().toString());
        Mockito.doReturn(currentEntity).when(classUnderTestSpy).prepareSkillEntity(any(), any());
        Mockito.doReturn(currentEntity).when(classUnderTestSpy).prepareSkillEntity(any());
        Mockito.doReturn(currentEntity).when(classUnderTestSpy).prepareRoleEntity(any(), any(), any());
        when(mockMyProjectExperienceHeader.getProfile()).thenReturn(mockProfile);
        when(mockProfile.getDataSubjectRole()).thenReturn(DATA_SUBJECT_ROLE);
        when(mockProfile.getEmailAddress()).thenReturn(DATA_SUBJECT_EMAIL);
        when(mockProfile.getWorkerExternalID()).thenReturn(DATA_SUBJECT_ID);
        classUnderTestSpy.beforeDraftCancelForMyProjectExperienceHeader(mockDraftCancelEventContext);
        verify(mockAuditLogUtil, never()).logDataModificationAuditMessage(mockDraftCancelEventContext,
                SKILL_ASSIGNMENT_OBJECT_TYPE, PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, currentEntity, null,
                mockAuditedDataSubject, UPDATE_OPERATION);
        verify(mockAuditLogUtil, never()).logDataModificationAuditMessage(mockDraftCancelEventContext,
                ROLE_ASSIGNMENT_OBJECT_TYPE, PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, currentEntity, null,
                mockAuditedDataSubject, UPDATE_OPERATION);
    }

    @Test
    @DisplayName("Verify draft cancel event for my project experience header skill create scenario")
    void testSkillCheck() {
        when(mockSkill.getSkillId()).thenReturn(UUID.randomUUID().toString());
        when(mockSkill.isEmpty()).thenReturn(false);
        when(mockSkill.getSkill()).thenReturn(mockSkillMasterListAll);
        MyProjectExperienceServiceEventHandler classUnderTestSpy = Mockito.spy(classUnderTest);
        Mockito.doReturn(mockSkill).when(classUnderTestSpy).getExpandedDataOfSkillAssignments(any(), anyBoolean());
        HashMap<String, String> currentEntity = new HashMap<>();
        currentEntity.put(ID, UUID.randomUUID().toString());
        Mockito.doReturn(currentEntity).when(classUnderTestSpy).prepareSkillEntity(any(), any());
        Mockito.doReturn(currentEntity).when(classUnderTestSpy).prepareSkillEntity(any());
        classUnderTestSpy.skillCheck(Collections.singletonList(mockSkill), mockDraftCancelEventContext,
                mockAuditedDataSubject);
        verify(this.mockAuditLogUtil, times(1)).logDataModificationAuditMessage(mockDraftCancelEventContext,
                SKILL_ASSIGNMENT_OBJECT_TYPE, PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, currentEntity, null,
                mockAuditedDataSubject, DELETE_OPERATION);
    }

    @Test
    @DisplayName("Verify draft cancel event for my project experience header role create scenario")
    void testRoleCheck() {
        when(mockRole.getRoleId()).thenReturn(UUID.randomUUID().toString());
        when(mockRole.isEmpty()).thenReturn(false);
        when(mockRole.getRole()).thenReturn(mockRoleMasterList);
        MyProjectExperienceServiceEventHandler classUnderTestSpy = Mockito.spy(classUnderTest);
        Mockito.doReturn(mockRole).when(classUnderTestSpy).getExpandedDataOfRoleAssignments(any(), anyBoolean());
        HashMap<String, String> currentEntity = new HashMap<>();
        currentEntity.put(ID, UUID.randomUUID().toString());
        Mockito.doReturn(currentEntity).when(classUnderTestSpy).prepareRoleEntity(any(), any(), any());
        classUnderTestSpy.roleCheck(Collections.singletonList(mockRole), mockDraftCancelEventContext,
                mockAuditedDataSubject);
        verify(this.mockAuditLogUtil, times(1)).logDataModificationAuditMessage(mockDraftCancelEventContext,
                ROLE_ASSIGNMENT_OBJECT_TYPE, PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, currentEntity, null,
                mockAuditedDataSubject, DELETE_OPERATION);
    }

    @Test
    @DisplayName("Verify draft cancel event for draft role delete scenario")
    void testBeforeDraftCancelForRoles() {
        when(mockCqnAnalyzer.analyze(any(CqnStructuredTypeRef.class))).thenReturn(mockAnalysisResult);
        when(mockDraftCancelEventContext.getCqn()).thenReturn(mockCqnDelete);
        when(mockCqnDelete.ref()).thenReturn(mockCqnStructuredTypeRef);
        Map<String, Object> roleIDMap = new HashMap<>();
        roleIDMap.put(ID, UUID.randomUUID().toString());
        when(mockAnalysisResult.targetKeys()).thenReturn(roleIDMap);
        when(mockMyProjectExperienceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockRole.getRoleId()).thenReturn(UUID.randomUUID().toString());
        when(mockRole.getRole()).thenReturn(mockRoleMasterList);
        MyProjectExperienceServiceEventHandler classUnderTestSpy = Mockito.spy(classUnderTest);
        Mockito.doReturn(mockRole).when(classUnderTestSpy).getExpandedDataOfRoleAssignments(any(), anyBoolean());
        HashMap<String, String> currentEntity = new HashMap<>();
        currentEntity.put(ID, UUID.randomUUID().toString());
        Mockito.doReturn(currentEntity).when(classUnderTestSpy).prepareRoleEntity(any(), any(), any());
        Mockito.doReturn(mockAuditedDataSubject).when(classUnderTestSpy).getAuditedDataSubject(any(), any(), any());
        when(mockRole.getProfile()).thenReturn(mockProfile);
        when(mockProfile.getDataSubjectRole()).thenReturn(DATA_SUBJECT_ROLE);
        when(mockProfile.getEmailAddress()).thenReturn(DATA_SUBJECT_EMAIL);
        when(mockProfile.getWorkerExternalID()).thenReturn(DATA_SUBJECT_ID);
        classUnderTestSpy.beforeDraftCancelForRoles(mockDraftCancelEventContext);
        verify(this.mockAuditLogUtil, times(1)).logDataModificationAuditMessage(mockDraftCancelEventContext,
                ROLE_ASSIGNMENT_OBJECT_TYPE, PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, currentEntity, null,
                mockAuditedDataSubject, DELETE_OPERATION);

    }

    @Test
    @DisplayName("Verify draft cancel event for active role delete scenario")
    void testBeforeDraftCancelForActiveRoles() {
        when(mockCqnAnalyzer.analyze(any(CqnStructuredTypeRef.class))).thenReturn(mockAnalysisResult);
        when(mockDraftCancelEventContext.getCqn()).thenReturn(mockCqnDelete);
        when(mockCqnDelete.ref()).thenReturn(mockCqnStructuredTypeRef);
        Map<String, Object> roleIDMap = new HashMap<>();
        roleIDMap.put(ID, UUID.randomUUID().toString());
        when(mockAnalysisResult.targetKeys()).thenReturn(roleIDMap);
        when(mockMyProjectExperienceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.rowCount()).thenReturn(Long.valueOf(2));
        HashMap<String, String> currentEntity = new HashMap<>();
        currentEntity.put(ID, UUID.randomUUID().toString());
        classUnderTest.beforeDraftCancelForRoles(mockDraftCancelEventContext);
        verify(this.mockAuditLogUtil, times(0)).logDataModificationAuditMessage(mockDraftCancelEventContext,
                ROLE_ASSIGNMENT_OBJECT_TYPE, PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, currentEntity, null,
                mockAuditedDataSubject, DELETE_OPERATION);

    }

    @Test
    @DisplayName("Verify draft cancel event for draft skill delete scenario")
    void testBeforeDraftCancelForSkills() {
        when(mockCqnAnalyzer.analyze(any(CqnStructuredTypeRef.class))).thenReturn(mockAnalysisResult);
        when(mockDraftCancelEventContext.getCqn()).thenReturn(mockCqnDelete);
        when(mockCqnDelete.ref()).thenReturn(mockCqnStructuredTypeRef);
        Map<String, Object> skillIDMap = new HashMap<>();
        skillIDMap.put(ID, UUID.randomUUID().toString());
        when(mockAnalysisResult.targetKeys()).thenReturn(skillIDMap);
        when(mockMyProjectExperienceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockSkill.getSkillId()).thenReturn(UUID.randomUUID().toString());
        when(mockSkill.getSkill()).thenReturn(mockSkillMasterListAll);
        MyProjectExperienceServiceEventHandler classUnderTestSpy = Mockito.spy(classUnderTest);
        Mockito.doReturn(mockSkill).when(classUnderTestSpy).getExpandedDataOfSkillAssignments(any(), anyBoolean());
        HashMap<String, String> currentEntity = new HashMap<>();
        currentEntity.put(ID, UUID.randomUUID().toString());
        Mockito.doReturn(currentEntity).when(classUnderTestSpy).prepareSkillEntity(any(), any());
        Mockito.doReturn(currentEntity).when(classUnderTestSpy).prepareSkillEntity(any());
        Mockito.doReturn(mockAuditedDataSubject).when(classUnderTestSpy).getAuditedDataSubject(any(), any(), any());
        when(mockSkill.getProfile()).thenReturn(mockProfile);
        when(mockProfile.getDataSubjectRole()).thenReturn(DATA_SUBJECT_ROLE);
        when(mockProfile.getEmailAddress()).thenReturn(DATA_SUBJECT_EMAIL);
        when(mockProfile.getWorkerExternalID()).thenReturn(DATA_SUBJECT_ID);
        classUnderTestSpy.beforeDraftCancelForSkills(mockDraftCancelEventContext);
        verify(this.mockAuditLogUtil, times(1)).logDataModificationAuditMessage(mockDraftCancelEventContext,
                SKILL_ASSIGNMENT_OBJECT_TYPE, PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, currentEntity, null,
                mockAuditedDataSubject, DELETE_OPERATION);

    }

    @Test
    @DisplayName("Verify draft cancel event for active skill delete scenario")
    void testBeforeDraftCancelForActiveSkills() {
        when(mockCqnAnalyzer.analyze(any(CqnStructuredTypeRef.class))).thenReturn(mockAnalysisResult);
        when(mockDraftCancelEventContext.getCqn()).thenReturn(mockCqnDelete);
        when(mockCqnDelete.ref()).thenReturn(mockCqnStructuredTypeRef);
        Map<String, Object> skillIDMap = new HashMap<>();
        skillIDMap.put(ID, UUID.randomUUID().toString());
        when(mockAnalysisResult.targetKeys()).thenReturn(skillIDMap);
        when(mockMyProjectExperienceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.rowCount()).thenReturn(Long.valueOf(2));
        HashMap<String, String> currentEntity = new HashMap<>();
        currentEntity.put(ID, UUID.randomUUID().toString());
        classUnderTest.beforeDraftCancelForSkills(mockDraftCancelEventContext);
        verify(this.mockAuditLogUtil, times(0)).logDataModificationAuditMessage(mockDraftCancelEventContext,
                SKILL_ASSIGNMENT_OBJECT_TYPE, PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, currentEntity, null,
                mockAuditedDataSubject, DELETE_OPERATION);

    }

    @Test
    @DisplayName("Verify if draft cancel event for my project experience header does nothing if select returns nothing")
    void beforeDraftCancelForMyProjectExperienceHeaderActiveDoesNotExist() {
        when(mockCqnAnalyzer.analyze(any(CqnStructuredTypeRef.class))).thenReturn(mockAnalysisResult);
        when(mockDraftCancelEventContext.getCqn()).thenReturn(mockCqnDelete);
        when(mockCqnDelete.ref()).thenReturn(mockCqnStructuredTypeRef);
        Map<String, Object> myProjectExperienceHeaderIDMap = new HashMap<>();
        String myProjectExperienceHeaderID = UUID.randomUUID().toString();
        myProjectExperienceHeaderIDMap.put(ID, myProjectExperienceHeaderID);
        when(mockAnalysisResult.targetKeys()).thenReturn(myProjectExperienceHeaderIDMap);
        when(mockMyProjectExperienceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.first(MyProjectExperienceHeader.class)).thenReturn(Optional.empty());
        MyProjectExperienceServiceEventHandler classUnderTestSpy = Mockito.spy(classUnderTest);
        HashMap<String, String> currentEntity = new HashMap<>();
        currentEntity.put(ID, UUID.randomUUID().toString());
        Mockito.doReturn(currentEntity).when(classUnderTestSpy).prepareSkillEntity(any(), any());
        Mockito.doReturn(currentEntity).when(classUnderTestSpy).prepareSkillEntity(any());
        Mockito.doReturn(currentEntity).when(classUnderTestSpy).prepareRoleEntity(any(), any(), any());
        when(mockMyProjectExperienceHeader.getProfile()).thenReturn(mockProfile);
        when(mockProfile.getDataSubjectRole()).thenReturn(DATA_SUBJECT_ROLE);
        when(mockProfile.getEmailAddress()).thenReturn(DATA_SUBJECT_EMAIL);
        when(mockProfile.getWorkerExternalID()).thenReturn(DATA_SUBJECT_ID);
        classUnderTestSpy.beforeDraftCancelForMyProjectExperienceHeader(mockDraftCancelEventContext);
        verify(mockAuditLogUtil, never()).logDataModificationAuditMessage(mockDraftCancelEventContext,
                SKILL_ASSIGNMENT_OBJECT_TYPE, PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, currentEntity, null,
                mockAuditedDataSubject, UPDATE_OPERATION);
        verify(mockAuditLogUtil, never()).logDataModificationAuditMessage(mockDraftCancelEventContext,
                ROLE_ASSIGNMENT_OBJECT_TYPE, PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, currentEntity, null,
                mockAuditedDataSubject, UPDATE_OPERATION);
    }

    @Test
    @DisplayName("test prepare role entity method")
    void testPrepareRoleEntity() {
        HashMap<String, String> actualEntity = classUnderTest.prepareRoleEntity("Developer", "T0D1", "developer");
        HashMap<String, String> expectedEntity = new HashMap<>();
        expectedEntity.put("name", "Developer");
        expectedEntity.put("code", "T0D1");
        expectedEntity.put("description", "developer");
        assertEquals(expectedEntity, actualEntity);
    }

    @Test
    @DisplayName("test get Expand of role assignments method")
    void testGetExpandedDataOfRoleAssignments() {
        when(mockMyProjectExperienceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.first(Roles.class)).thenReturn(Optional.of(mockRole));
        Roles actualRole = classUnderTest.getExpandedDataOfRoleAssignments("123", true);
        assertEquals(mockRole, actualRole);
    }

    @Test
    @DisplayName("test get Expand of skill assignments method")
    void testGetExpandedDataOfSkillAssignments() {
        when(mockMyProjectExperienceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.first(Skills.class)).thenReturn(Optional.of(mockSkill));
        Skills actualSkill = classUnderTest.getExpandedDataOfSkillAssignments("123", true);
        assertEquals(mockSkill, actualSkill);
    }

    @Test
    @DisplayName("test draft activate scenario")
    void testBeforeUpsertMyProjectExperienceHeader1() {
        when(mockMyProjectExperienceService.run(any(CqnSelect.class))).thenReturn(mockResult);
        when(mockResult.first(MyProjectExperienceHeader.class)).thenReturn(Optional.of(mockMyProjectExperienceHeader));
        when(mockMyProjectExperienceHeader.getRoles()).thenReturn(Collections.singletonList(mockRole));
        when(mockMyProjectExperienceHeader.getSkills()).thenReturn(Collections.singletonList(mockSkill));
        when(mockMyProjectExperienceHeader2.getSkills()).thenReturn(Collections.singletonList(mockSkill2));
        when(mockMyProjectExperienceHeader2.getRoles()).thenReturn(Collections.singletonList(mockRole2));
        when(mockMyProjectExperienceHeader.getProfilePhoto()).thenReturn(mockProfilePhoto);
        when(mockMyProjectExperienceHeader2.getProfilePhoto()).thenReturn(mockProfilePhoto);
        when(mockProfilePhoto.getProfileImage()).thenReturn(null);
        when(mockMyProjectExperienceHeader.getAttachment()).thenReturn(mockAttachment);
        when(mockMyProjectExperienceHeader2.getAttachment()).thenReturn(mockAttachment);
        when(mockAttachment.getContent()).thenReturn(null);
        when(mockRole.getId()).thenReturn(UUID.randomUUID().toString());
        when(mockRole2.getId()).thenReturn(UUID.randomUUID().toString());
        when(mockSkill.getId()).thenReturn(UUID.randomUUID().toString());
        when(mockSkill2.getId()).thenReturn(UUID.randomUUID().toString());
        MyProjectExperienceServiceEventHandler classUnderTestSpy = Mockito.spy(classUnderTest);
        Mockito.doReturn(mockSkill).when(classUnderTestSpy).getExpandedDataOfSkillAssignments(any(), anyBoolean());
        Mockito.doReturn(mockRole).when(classUnderTestSpy).getExpandedDataOfRoleAssignments(any(), anyBoolean());
        Mockito.doReturn(mockAuditedDataSubject).when(classUnderTestSpy).getAuditedDataSubject(any(), any(), any());
        HashMap<String, String> currentEntity = new HashMap<>();
        currentEntity.put(ID, UUID.randomUUID().toString());
        Mockito.doReturn(currentEntity).when(classUnderTestSpy).prepareSkillEntity(any(), any());
        Mockito.doReturn(currentEntity).when(classUnderTestSpy).prepareSkillEntity(any());
        Mockito.doReturn(currentEntity).when(classUnderTestSpy).prepareRoleEntity(any(), any(), any());
        when(mockMyProjectExperienceHeader.getProfile()).thenReturn(mockProfile);
        when(mockProfile.getDataSubjectRole()).thenReturn(DATA_SUBJECT_ROLE);
        when(mockProfile.getEmailAddress()).thenReturn(DATA_SUBJECT_EMAIL);
        when(mockProfile.getWorkerExternalID()).thenReturn(DATA_SUBJECT_ID);
        when(mockRole.isEmpty()).thenReturn(false);
        when(mockSkill.isEmpty()).thenReturn(false);
        when(mockRole.getRole()).thenReturn(mockRoleMasterList);
        when(mockSkill.getSkill()).thenReturn(mockSkillMasterListAll);
        classUnderTestSpy.beforeUpsertMyProjectExperienceHeader(mockEventContext, mockMyProjectExperienceHeader2);
        verify(this.mockAuditLogUtil, times(1)).logDataModificationAuditMessage(mockEventContext,
                SKILL_ASSIGNMENT_OBJECT_TYPE, PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, currentEntity, null,
                mockAuditedDataSubject, DELETE_OPERATION);
        verify(this.mockAuditLogUtil, times(1)).logDataModificationAuditMessage(mockEventContext,
                ROLE_ASSIGNMENT_OBJECT_TYPE, PROJECT_EXPERIENCE_SERVICE_IDENTIFIER, currentEntity, null,
                mockAuditedDataSubject, DELETE_OPERATION);
    }

    @Test
    @DisplayName("Test Periodic Utilization Data formed correctly")
    void readPeriodicUtilizationData() {
        CdsReadEventContext cdsReadEventContext = CdsReadEventContext.create(PeriodicUtilization_.CDS_NAME);
        classUnderTest.readPeriodicUtilizationData(cdsReadEventContext);
        verify(this.mockCommonEventHandlerUtil, times(1)).setLocalisedDataForPeriodicUtilization(cdsReadEventContext,
                PeriodicUtilization.MONTH_YEAR, PeriodicUtilization.CALMONTH);
    }

    @Test
    @DisplayName("Test Periodic Availability Data formed correctly")
    void readPeriodicAvailabilityData() {
        CdsReadEventContext cdsReadEventContext = CdsReadEventContext.create(PeriodicAvailability_.CDS_NAME);
        classUnderTest.readPeriodicAvailabilityMonthlyData(cdsReadEventContext);
        verify(this.mockCommonEventHandlerUtil, times(1)).setLocalisedDataForPeriodicAvailability(cdsReadEventContext,
                PeriodicAvailability.MONTH_YEAR, PeriodicAvailability.CALMONTH);
    }

    @Test
    @DisplayName("Test InternalWE#convertedCapacityInHours Data formed correctly")
    void testReadInternalWEData() {
        CdsReadEventContext cdsReadEventContext = CdsReadEventContext.create(InternalWorkExperience_.CDS_NAME);
        classUnderTest.afterReadInternalWorkExperience(cdsReadEventContext);
        verify(this.mockCommonEventHandlerUtil, times(1)).setLocalInternalWEConvertedAssigned(cdsReadEventContext,
                InternalWorkExperience.CONVERTED_ASSIGNED_CAPACITY);
    }

    @Test
    @DisplayName("Test if beforeRead ensure catalog expansion for skillMasterList when catalog present")
    void testBeforeRead() {
        CdsReadEventContext mockReadEventContext = CdsReadEventContext.create(SkillMasterList_.CDS_NAME);
        mockReadEventContext.setCqn(Select.from(SkillMasterList_.CDS_NAME));
        MyProjectExperienceServiceEventHandler classUnderTestSpy = Mockito.spy(classUnderTest);
        Mockito.doReturn(Boolean.TRUE).when(classUnderTestSpy).shouldComputeCommaSeparated(ArgumentMatchers.any());
        classUnderTestSpy.beforeReadExpandCatalogs(mockReadEventContext);

        verify(classUnderTestSpy, times(1)).shouldComputeCommaSeparated(ArgumentMatchers.any());
        verify(classUnderTestSpy, times(1)).ensureCatalogExpansion(ArgumentMatchers.any());
    }

    @Test
    @DisplayName("Test if beforeRead ensure catalog expansion for skillMasterList when no catalog present")
    void testBeforeReadNoCatalog() {
        CdsReadEventContext mockReadEventContext = CdsReadEventContext.create(SkillMasterList_.CDS_NAME);
        mockReadEventContext.setCqn(Select.from(SkillMasterList_.CDS_NAME));
        MyProjectExperienceServiceEventHandler classUnderTestSpy = Mockito.spy(classUnderTest);
        classUnderTestSpy.beforeReadExpandCatalogs(mockReadEventContext);

        verify(classUnderTestSpy, times(1)).shouldComputeCommaSeparated(ArgumentMatchers.any());
        verify(classUnderTestSpy, times(0)).ensureCatalogExpansion(ArgumentMatchers.any());
    }

    @Test
    @DisplayName("Test if afterRead combined catalogs in commaSeparatedCatalog when no catalog assigned")
    void testAfterReadNoCatalog() {
        CdsReadEventContext mockReadEventContext = CdsReadEventContext.create(SkillMasterList_.CDS_NAME);
        mockReadEventContext.setCqn(Select.from(SkillMasterList_.CDS_NAME));
        MyProjectExperienceServiceEventHandler classUnderTestSpy = Mockito.spy(classUnderTest);

        SkillMasterList skill = Struct.create(SkillMasterList.class);
        skill.setId("b08aabdf-6dcb-4df7-b319-b440f073e6dc");
        skill.setDescription("desc");
        skill.setName("name");

        Mockito.doReturn(Boolean.FALSE).when(classUnderTestSpy).shouldComputeCommaSeparated(ArgumentMatchers.any());
        Mockito.doNothing().when(classUnderTestSpy).removeInvalidAssociation(ArgumentMatchers.any());
        classUnderTestSpy.afterReadSetCommaSeparatedCatalogs(mockReadEventContext, Collections.singletonList(skill));

        verify(classUnderTestSpy, times(1)).shouldComputeCommaSeparated(ArgumentMatchers.any());
        verify(classUnderTestSpy, times(0)).computeCommaSeparated(ArgumentMatchers.any());
        verify(classUnderTestSpy, times(0)).removeInvalidAssociation(ArgumentMatchers.any());

    }

    @Test
    @DisplayName("Test if afterRead combined catalogs in commaSeparatedCatalog when no catalog assigned")
    void testAfterReadNoCatalogAssociation() {
        CdsReadEventContext mockReadEventContext = CdsReadEventContext.create(SkillMasterList_.CDS_NAME);
        mockReadEventContext.setCqn(Select.from(SkillMasterList_.CDS_NAME));
        MyProjectExperienceServiceEventHandler classUnderTestSpy = Mockito.spy(classUnderTest);

        SkillMasterList skill = Struct.create(SkillMasterList.class);
        skill.setId("b08aabdf-6dcb-4df7-b319-b440f073e6dc");
        skill.setDescription("desc");
        skill.setName("name");
        skill.setCatalogAssociations(null);

        Mockito.doReturn(Boolean.TRUE).when(classUnderTestSpy).shouldComputeCommaSeparated(ArgumentMatchers.any());
        Mockito.doNothing().when(classUnderTestSpy).removeInvalidAssociation(ArgumentMatchers.any());
        classUnderTestSpy.afterReadSetCommaSeparatedCatalogs(mockReadEventContext, Collections.singletonList(skill));

        verify(classUnderTestSpy, times(1)).shouldComputeCommaSeparated(ArgumentMatchers.any());
        verify(classUnderTestSpy, times(1)).computeCommaSeparated(ArgumentMatchers.any());
        verify(classUnderTestSpy, times(1)).removeInvalidAssociation(ArgumentMatchers.any());
    }

    @Test
    @DisplayName("Test if afterRead try to build catalogs for skillMasterList when invalid association")
    void testAfterReadInvalidAssociation() {
        CdsReadEventContext mockReadEventContext = CdsReadEventContext.create(SkillMasterList_.CDS_NAME);
        mockReadEventContext.setCqn(Select.from(SkillMasterList_.CDS_NAME));
        MyProjectExperienceServiceEventHandler classUnderTestSpy = Mockito.spy(classUnderTest);

        Catalogs2SkillsConsumption catalogAssociations = Struct.create(Catalogs2SkillsConsumption.class);
        catalogAssociations.setId(null);
        catalogAssociations.setCatalogId("b08aabdf-6dcb-4df7-b319-b440f073e6dc");
        catalogAssociations.setSkillId("b08aabdf-6dcb-4df7-b319-b440f073e6dc");

        SkillMasterList skill = Struct.create(SkillMasterList.class);
        skill.setId("b08aabdf-6dcb-4df7-b319-b440f073e6dc");
        skill.setDescription("desc");
        skill.setName("name");
        skill.setCatalogAssociations(Collections.singletonList(catalogAssociations));

        Mockito.doReturn(Boolean.TRUE).when(classUnderTestSpy).shouldComputeCommaSeparated(ArgumentMatchers.any());
        classUnderTestSpy.afterReadSetCommaSeparatedCatalogs(mockReadEventContext, Collections.singletonList(skill));

        verify(classUnderTestSpy, times(1)).shouldComputeCommaSeparated(ArgumentMatchers.any());
        verify(classUnderTestSpy, times(1)).computeCommaSeparated(ArgumentMatchers.any());
        verify(classUnderTestSpy, times(1)).removeInvalidAssociation(ArgumentMatchers.any());

    }

    @Test
    @DisplayName("Test if afterRead build catalogs for skillMasterList when valid association")
    void testAfterRead() {
        CdsReadEventContext mockReadEventContext = CdsReadEventContext.create(SkillMasterList_.CDS_NAME);
        mockReadEventContext.setCqn(Select.from(SkillMasterList_.CDS_NAME));
        MyProjectExperienceServiceEventHandler classUnderTestSpy = Mockito.spy(classUnderTest);

        Catalogs2SkillsConsumption catalogAssociations = Struct.create(Catalogs2SkillsConsumption.class);
        catalogAssociations.setId("b08aabdf-6dcb-4df7-b319-b440f073e6dc");
        catalogAssociations.setCatalogId("b08aabdf-6dcb-4df7-b319-b440f073e6dc");
        catalogAssociations.setSkillId("b08aabdf-6dcb-4df7-b319-b440f073e6dc");

        SkillMasterList skill = Struct.create(SkillMasterList.class);
        skill.setId("b08aabdf-6dcb-4df7-b319-b440f073e6dc");
        skill.setDescription("desc");
        skill.setName("name");
        skill.setCatalogAssociations(Collections.singletonList(catalogAssociations));

        Mockito.doReturn(Boolean.TRUE).when(classUnderTestSpy).shouldComputeCommaSeparated(ArgumentMatchers.any());
        classUnderTestSpy.afterReadSetCommaSeparatedCatalogs(mockReadEventContext, Collections.singletonList(skill));

        verify(classUnderTestSpy, times(1)).shouldComputeCommaSeparated(ArgumentMatchers.any());
        verify(classUnderTestSpy, times(1)).computeCommaSeparated(ArgumentMatchers.any());
        verify(classUnderTestSpy, times(1)).removeInvalidAssociation(ArgumentMatchers.any());

    }

    @Test
    @DisplayName("set an random skill uuid and verify that proficiencyLevelId is set to null")
    void populateDefaultProficiencyLevel() {
        Skills skillAssignment = Skills.create();
        skillAssignment.setSkillId(UUID.randomUUID().toString());

        assertDoesNotThrow(() -> this.classUnderTest.populateDefaultProficiencyLevel(skillAssignment));
        assertNull(skillAssignment.getProficiencyLevelId());
    }

    @Test
    @DisplayName("set random external work experience skill uuid and verify that proficiencyLevelId is set to null")
    void populateDefaultProficiencyLevel2() {
        ExternalWorkExperienceSkills skillAssignment = ExternalWorkExperienceSkills.create();
        skillAssignment.setSkillId(UUID.randomUUID().toString());

        ProficiencyLevels proficiencyLevel = ProficiencyLevels.create();
        proficiencyLevel.setId(UUID.randomUUID().toString());

        assertDoesNotThrow(() -> this.classUnderTest.populateDefaultProficiencyLevel(skillAssignment));
        assertNull(skillAssignment.getProficiencyLevelId());
    }

    @Test
    @DisplayName("set an random skill uuid  with proficiency level and verify that proficiencyLevelId is not set to null")
    void populateDefaultProficiencyLevel3() {
        Skills skillAssignment = Skills.create();
        skillAssignment.setSkillId(UUID.randomUUID().toString());
        skillAssignment.setProficiencyLevelId(UUID.randomUUID().toString());

        assertDoesNotThrow(() -> this.classUnderTest.populateDefaultProficiencyLevel(skillAssignment));
        assertNotNull(skillAssignment.getProficiencyLevelId());
    }

    @Test
    @DisplayName("set random external work experience skill uuid with proficiency level and verify that proficiencyLevelId is not set to null")
    void populateDefaultProficiencyLevel4() {
        ExternalWorkExperienceSkills skillAssignment = ExternalWorkExperienceSkills.create();
        skillAssignment.setSkillId(UUID.randomUUID().toString());
        skillAssignment.setProficiencyLevelId(UUID.randomUUID().toString());

        ProficiencyLevels proficiencyLevel = ProficiencyLevels.create();
        proficiencyLevel.setId(UUID.randomUUID().toString());

        assertDoesNotThrow(() -> this.classUnderTest.populateDefaultProficiencyLevel(skillAssignment));
        assertNotNull(skillAssignment.getProficiencyLevelId());
    }

    @Test
    @DisplayName("set virtual proficiencyLevelEditMode field to read only")
    void afterSkillDraftNew() {
        Skills skill = Skills.create();

        assertDoesNotThrow(() -> this.classUnderTest.afterSkillsDraftNew(skill));
        assertEquals(1, skill.getProficiencyLevelEditMode());
    }

    @Test
    @DisplayName("set virtual proficiencyLevelEditMode field to read only")
    void afterExternalWorkExperienceSkillsDraftNew() {
        ExternalWorkExperienceSkills skillAssignment = ExternalWorkExperienceSkills.create();

        assertDoesNotThrow(() -> this.classUnderTest.afterExternalWorkExperienceSkillsDraftNew(skillAssignment));
        assertEquals(1, skillAssignment.getProficiencyLevelEditMode());
    }

    @Test
    @DisplayName("Check if proficiencyLevelEditMode is valid")
    void afterSkillsRead() {
        Skills skill1 = Skills.create();
        skill1.setSkillId(UUID.randomUUID().toString());
        skill1.setProficiencyLevelId(UUID.randomUUID().toString());
        Skills skill2 = Skills.create();
        skill2.setProficiencyLevelId(UUID.randomUUID().toString());
        List<Skills> skillList = Arrays.asList(skill1, skill2);

        assertDoesNotThrow(() -> this.classUnderTest.afterSkillsRead(skillList));
        assertEquals(7, skillList.get(0).getProficiencyLevelEditMode());
        assertNotNull(skillList.get(0).getProficiencyLevelId());

        assertEquals(1, skillList.get(1).getProficiencyLevelEditMode());
    }

    @Test
    @DisplayName("Check if proficiencyLevelEditMode is valid")
    void afterExternalWorkExperienceSkillsRead() {
        ExternalWorkExperienceSkills skill1 = ExternalWorkExperienceSkills.create();
        skill1.setSkillId(UUID.randomUUID().toString());
        skill1.setProficiencyLevelId(UUID.randomUUID().toString());
        ExternalWorkExperienceSkills skill2 = ExternalWorkExperienceSkills.create();
        skill2.setProficiencyLevelId(UUID.randomUUID().toString());
        List<ExternalWorkExperienceSkills> skillList = Arrays.asList(skill1, skill2);

        assertDoesNotThrow(() -> this.classUnderTest.afterExternalWorkExperienceSkillsRead(skillList));
        assertEquals(7, skillList.get(0).getProficiencyLevelEditMode());
        assertNotNull(skillList.get(0).getProficiencyLevelId());

        assertEquals(1, skillList.get(1).getProficiencyLevelEditMode());
    }

    @Test
    @DisplayName("Check if utilization color is getting set properly in periodic availability")
    void populateUtilizationColorPeriodicAvailabilityTest() {
        when(mockCommonEventHandlerUtil.getUtilizationColor(Mockito.anyInt())).thenCallRealMethod();
        List<PeriodicAvailability> periodicAvailabilityArray = new ArrayList<PeriodicAvailability>();
        periodicAvailabilityArray.add(periodicAvailability);
        int[] utilizationArr = { 0, 75, 90 };
        int[] colorArr = { 1, 2, 3 };
        for (int i = 0; i != utilizationArr.length; i++) {
            when(periodicAvailability.getUtilizationPercentage()).thenReturn(utilizationArr[i]);
            this.classUnderTest.populateUtilizationColorPeriodicAvailability(periodicAvailabilityArray);
            verify(this.periodicAvailability, times(1)).setUtilizationColor(colorArr[i]);
        }
    }

    @Test
    @DisplayName("Check if utilization color is getting set properly in utilization")
    void populateUtilizationColorUtilizationTest() {
        when(mockCommonEventHandlerUtil.getUtilizationColor(Mockito.anyInt())).thenCallRealMethod();
        List<Utilization> utilizationArray = new ArrayList<Utilization>();
        utilizationArray.add(utilization);
        int[] utilizationArr = { 125, 115, 110 };
        int[] colorArr = { 1, 2, 3 };
        for (int i = 0; i != utilizationArr.length; i++) {
            when(utilization.getYearlyUtilization()).thenReturn(utilizationArr[i]);
            this.classUnderTest.populateUtilizationColorUtilization(utilizationArray);
            verify(this.utilization, times(1)).setUtilizationColor(colorArr[i]);
        }
    }
}
