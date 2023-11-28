package com.sap.c4p.rm.skill.mdiintegration.controller;

import static com.sap.c4p.rm.skill.TestConstants.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.IOException;
import java.util.Objects;

import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.skill.Application;
import com.sap.c4p.rm.skill.mdiintegration.IntegrationTestHelper;
import com.sap.c4p.rm.skill.mdiintegration.replicationdao.OneMDSReplicationDeltaTokenDAO;
import com.sap.c4p.rm.skill.mdiintegration.utils.IsNullCheckUtils;

@ActiveProfiles("integration-test")
@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = Application.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class WorkforceCapabilityNegativeAuthorizationTest {

  private final IntegrationTestHelper integrationTestHelper;
  private final WebClient webClient;
  private final HttpEntity<MultiValueMap<String, String>> requestEntity;

  public WorkforceCapabilityNegativeAuthorizationTest(@Value("${local.server.port}") int localPort,
      @Autowired PersistenceService persistenceService,
      @Autowired OneMDSReplicationDeltaTokenDAO oneMDSReplicationDeltaTokenDAO) {
    // Common integration test helper
    this.integrationTestHelper = new IntegrationTestHelper(localPort, persistenceService,
        oneMDSReplicationDeltaTokenDAO);

    // Local authentication
    this.webClient = WebClient.builder()
        .defaultHeaders(header -> header.setBasicAuth(APP_USER_UNAUTHORIZED, APP_PASSWORD_UNAUTHORIZED)).build();

    // Request Headers for RestControllers that are invoked by JobScheduler CF
    // Service
    HttpHeaders requestHttpHeaders = new HttpHeaders();
    requestHttpHeaders.set(X_SAP_JOB_ID, X_SAP_JOB_ID);
    requestHttpHeaders.set(X_SAP_JOB_SCHEDULE_ID, X_SAP_JOB_SCHEDULE_ID);
    requestHttpHeaders.set(X_SAP_JOB_RUN_ID, X_SAP_JOB_RUN_ID);
    requestHttpHeaders.set(X_SAP_RUN_AT, X_SAP_RUN_AT);
    requestHttpHeaders.set(X_SAP_SCHEDULER_HOST, X_SAP_SCHEDULER_HOST);
    this.requestEntity = new HttpEntity<>(null, requestHttpHeaders);
  }

  @BeforeEach
  public void setUp() throws IOException {
    this.integrationTestHelper.startMockServer();

  }

  @AfterEach
  public void tearDown() throws IOException {
    this.integrationTestHelper.shutMockServer();
  }

  @Test
  @Order(1)
  @DisplayName("Negative Authorization test for MDI Replication end point.")
  void testAuthorization() throws IOException, InterruptedException {
    MultiValueMap<String, String> queryParameters = new LinkedMultiValueMap<>();
    queryParameters.add(PAGE_SIZE, "3");
    String replicateWorkforceCapabilityURL = this.integrationTestHelper.getLocalUriComponentsBuilder().cloneBuilder()
        .pathSegment(ReplicationController.REPLICATE_WORK_FORCE_CAPABILITY).build().toUriString();
    // Setup of mock responses from mockwebserver
    ResponseEntity<String> response = null;
    try {

      if (Boolean.TRUE.equals(IsNullCheckUtils.isNullOrEmpty(this.requestEntity.getBody()))) {
        response = this.webClient.post().uri(replicateWorkforceCapabilityURL)
            .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders())).retrieve()
            .toEntity(String.class).block();
      } else {
        response = this.webClient.post().uri(replicateWorkforceCapabilityURL)
            .headers(httpHeaders -> httpHeaders.addAll(this.requestEntity.getHeaders()))
            .bodyValue(Objects.requireNonNull(this.requestEntity.getBody())).retrieve().toEntity(String.class).block();

      }
    } catch (WebClientResponseException webClientResponseException) {
      HttpStatus expStatus = HttpStatus.valueOf(403);
      assertEquals(expStatus, webClientResponseException.getStatusCode());
    }

  }

  @Test
  @Order(2)
  @DisplayName("test If MDI replication can be activated negative authorization test.")
  void testIfMDIReplicationCanBeActivated() throws IOException, InterruptedException {

    String isMDIReplicationAllowedURL = this.integrationTestHelper.getLocalUriComponentsBuilder().cloneBuilder()
        .pathSegment("odata").pathSegment("v4").pathSegment("SkillIntegrationService")
        .pathSegment("isSkillMDIReplicationAllowed()").build().toUriString();

    WebTestClient.bindToServer()
        .defaultHeaders(header -> header.setBasicAuth(APP_USER_UNAUTHORIZED, APP_PASSWORD_UNAUTHORIZED)).build().get()
        .uri(isMDIReplicationAllowedURL).exchange().expectStatus().isForbidden();

  }

}
