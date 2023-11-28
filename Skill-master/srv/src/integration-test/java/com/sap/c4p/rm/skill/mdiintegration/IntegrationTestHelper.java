package com.sap.c4p.rm.skill.mdiintegration;

import static com.sap.c4p.rm.skill.TestConstants.JOB_SCHEDULER_DUMMY_SERVICE_URL;
import static com.sap.c4p.rm.skill.TestConstants.SCHEDULER_JOB_PATH_SEGMENT;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import com.sap.resourcemanagement.skill.integration.MDIObjectReplicationStatus;
import com.sap.resourcemanagement.skill.integration.MDIObjectReplicationStatus_;
import org.slf4j.Marker;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.util.MultiValueMap;
import org.springframework.web.util.UriComponentsBuilder;

import com.sap.cds.Result;
import com.sap.cds.Struct;
import com.sap.cds.ql.Delete;
import com.sap.cds.ql.Insert;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.masterdataintegration.MDIEntities;
import com.sap.c4p.rm.skill.mdiintegration.replicationdao.OneMDSReplicationDeltaTokenDAO;
import com.sap.c4p.rm.skill.mdiintegration.utils.IsNullCheckUtils;

import com.sap.resourcemanagement.skill.ProficiencySets;
import com.sap.resourcemanagement.skill.ProficiencySets_;
import com.sap.resourcemanagement.skill.Skills;
import com.sap.resourcemanagement.skill.Skills_;
import com.sap.resourcemanagement.skill.integration.OneMDSDeltaTokenInfo;
import com.sap.resourcemanagement.skill.integration.OneMDSDeltaTokenInfo_;

import catalogservice.Catalogs;
import catalogservice.Catalogs_;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;

public class IntegrationTestHelper {
  private final UriComponentsBuilder localUriComponentsBuilder;
  private final PersistenceService persistenceService;
  protected final OneMDSReplicationDeltaTokenDAO oneMDSReplicationDeltaTokenDAO;
  private MockWebServer mockWebServer;

  public IntegrationTestHelper(final int localPort, final PersistenceService persistenceService,
      final OneMDSReplicationDeltaTokenDAO oneMDSReplicationDeltaTokenDAO) {
    this.localUriComponentsBuilder = UriComponentsBuilder.newInstance().scheme("http").host("localhost")
        .port(localPort);
    this.persistenceService = persistenceService;
    this.oneMDSReplicationDeltaTokenDAO = oneMDSReplicationDeltaTokenDAO;
  }

  public void startMockServer() throws IOException {
    this.mockWebServer = new MockWebServer();
    this.mockWebServer.start(8090); // Starts the mock web server on port 8090
  }

  public void shutMockServer() throws IOException {
    this.mockWebServer.shutdown();
  }

  public UriComponentsBuilder getLocalUriComponentsBuilder() {
    return this.localUriComponentsBuilder;
  }

  private String processJSONExpectation(final String file) throws IOException {
    return new String(Files.readAllBytes(Paths.get("src", "integration-test", "resources", file)));
  }

  public void setMock(final String expectedResponse, final MediaType mediaType, HttpStatus httpStatus)
      throws IOException {
    if (mediaType.equals(MediaType.APPLICATION_JSON)) {
      MockResponse mockResponse = new MockResponse().addHeader("Content-Type", "application/json")
          .setResponseCode(httpStatus.value()).setBody(this.processJSONExpectation(expectedResponse));
      this.mockWebServer.enqueue(mockResponse);

    } else if (mediaType.equals(MediaType.TEXT_PLAIN)) {
      MockResponse mockResponse = new MockResponse().addHeader("Content-Type", "text/plain")
          .setResponseCode(httpStatus.value()).setBody(expectedResponse);
      this.mockWebServer.enqueue(mockResponse);
    }
  }

  public void setJobSchedulerMock(final String file, final MediaType mediaType, final String... additionalPathSegment)
      throws IOException {
    this.setJobSchedulerMock(file, mediaType, null, additionalPathSegment);
  }

  public void setJobSchedulerMock(final String file, final MediaType mediaType,
      final MultiValueMap<String, String> queryParameters, final String... additionalPathSegment) throws IOException {
    UriComponentsBuilder jobSchedulerUriComponentsBuilder = UriComponentsBuilder
        .fromUriString(JOB_SCHEDULER_DUMMY_SERVICE_URL + SCHEDULER_JOB_PATH_SEGMENT);

    if (additionalPathSegment.length > 0)
      jobSchedulerUriComponentsBuilder.pathSegment(additionalPathSegment);

    if (!IsNullCheckUtils.isNullOrEmpty(queryParameters))
      jobSchedulerUriComponentsBuilder.queryParams(queryParameters);

    this.setMock(file, mediaType, HttpStatus.OK);
  }

  public String getDeltaTokenFromSystem(final MDIEntities entity) {
    CqnSelect selectQuery = Select.from(OneMDSDeltaTokenInfo_.CDS_NAME)
        .where(b -> b.get(OneMDSDeltaTokenInfo.ENTITY_NAME).eq(entity.getName()));
    Result result = this.persistenceService.run(selectQuery);
    if (result.rowCount() > 0) {
      Optional<OneMDSDeltaTokenInfo> oneMDSDeltaTokenInfo = result.first(OneMDSDeltaTokenInfo.class);
      if (oneMDSDeltaTokenInfo.isPresent())
        return oneMDSDeltaTokenInfo.get().getDeltaToken();
    }
    return null;
  }

  public void insertRMCatalogData() {
    Catalogs catalog = Struct.create(Catalogs.class);
    catalog.setId("828bbd5f-4473-4bf6-9de5-5c17634222ff");
    catalog.setName("catalogName");
    catalog.setDescription("catalogDescription");
    persistenceService.run(Insert.into(Catalogs_.CDS_NAME).entry(catalog));
  }

  public void deleteRMCatalogData() {
    persistenceService
        .run(Delete.from(Catalogs_.CDS_NAME).where(a -> a.get("ID").eq("828bbd5f-4473-4bf6-9de5-5c17634222ff")));
  }

  public Boolean getInitialLoadCandidateStatusFromSystem(final MDIEntities entity) {
    CqnSelect selectQuery = Select.from(OneMDSDeltaTokenInfo_.CDS_NAME)
        .where(b -> b.get(OneMDSDeltaTokenInfo.ENTITY_NAME).eq(entity.getName()));
    Result result = this.persistenceService.run(selectQuery);
    if (result.rowCount() > 0) {
      Optional<OneMDSDeltaTokenInfo> oneMDSDeltaTokenInfo = result.first(OneMDSDeltaTokenInfo.class);
      if (oneMDSDeltaTokenInfo.isPresent())
        return oneMDSDeltaTokenInfo.get().getIsInitialLoadCandidate();
    }
    return null;
  }

  public Boolean getInitialLoadCandidateStatusCP(final MDIEntities entity) {
    CqnSelect selectQuery = Select
        .from(com.sap.resourcemanagement.consultantprofile.integration.OneMDSDeltaTokenInfo_.CDS_NAME)
        .where(b -> b.get(OneMDSDeltaTokenInfo.ENTITY_NAME).eq(entity.getName()));
    Result result = this.persistenceService.run(selectQuery);
    if (result.rowCount() > 0) {
      Optional<com.sap.resourcemanagement.consultantprofile.integration.OneMDSDeltaTokenInfo> oneMDSDeltaTokenInfo = result
          .first(com.sap.resourcemanagement.consultantprofile.integration.OneMDSDeltaTokenInfo.class);
      if (oneMDSDeltaTokenInfo.isPresent())
        return oneMDSDeltaTokenInfo.get().getIsInitialLoadCandidate();
    }
    return null;
  }

  public void setReplicationForReInitialLoad(Marker marker) {
    this.oneMDSReplicationDeltaTokenDAO.markReplicationForInitialLoad(marker);
  }

  public <T> List<T> getEntityList(final String entityName, final Class<T> entity) {
    CqnSelect selectQuery = Select.from(entityName);
    Result result = this.persistenceService.run(selectQuery);
    if (result.rowCount() > 0)
      return result.listOf(entity);
    else
      return Collections.emptyList();
  }

  public List<ProficiencySets> getProficiencySets() {
    CqnSelect selectQuery = Select.from(ProficiencySets_.class).columns(a -> a._all(),
        a -> a.proficiencyLevels().expand(b -> b._all(), b -> b.texts().expand()));
    Result result = this.persistenceService.run(selectQuery);

    return result.listOf(ProficiencySets.class);
  }

  public List<Skills> getSkills() {
    CqnSelect selectQuery = Select.from(Skills_.class).columns(a -> a._all(),
        a -> a.catalogAssociations().expand(b -> b._all()), a -> a.texts().expand(b -> b._all()));
    Result result = this.persistenceService.run(selectQuery);

    return result.listOf(Skills.class);
  }

  public <T> List<T> getEntityList(final CqnSelect cqnSelect, final Class<T> entity) {
    Result result = this.persistenceService.run(cqnSelect);
    if (result.rowCount() > 0)
      return result.listOf(entity);
    else
      return Collections.emptyList();
  }

  public Integer getMDIObjectReplicationStatusListCount(MDIEntities entity)
  {
    Integer count = 0;
    CqnSelect cqnSelect = Select.from(MDIObjectReplicationStatus_.class)
            .where(mdiObjectReplicationStatus -> mdiObjectReplicationStatus.entityName().eq(entity.getName()));
     Result result = this.persistenceService.run(cqnSelect);
    result.stream().forEach(System.out::println);
     
     if(result != null)
      count = Math.toIntExact((result.rowCount()));
     return count;
  }

}
