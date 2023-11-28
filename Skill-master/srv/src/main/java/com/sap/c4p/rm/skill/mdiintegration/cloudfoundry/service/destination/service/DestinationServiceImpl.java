package com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.destination.service;

import java.util.Arrays;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.util.UriComponentsBuilder;

import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.authclient.DestinationToken;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.environment.DestinationVCAP;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.destination.model.AuthTokens;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.destination.model.DestinationResponse;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.model.JobScheduleRunPayload;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.model.JobScheduleRunPayloadMessage;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.model.JobSchedulerRunHeader;
import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.service.JobSchedulerService;
import com.sap.c4p.rm.skill.mdiintegration.exceptions.ReplicationErrorCodes;
import com.sap.c4p.rm.skill.mdiintegration.replicationdao.ReplicationErrorMessagesDAO;
import com.sap.c4p.rm.skill.mdiintegration.utils.StringFormatter;

@Service
public class DestinationServiceImpl implements DestinationService {

  private static final Logger LOGGER = LoggerFactory.getLogger(DestinationServiceImpl.class);
  protected static final String DESTINATION_JOB_PATH_SEGMENT = "destination-configuration/v1/destinations/";
  private static final String DESTINATION_NAME = "C4PRM";

  private final DestinationToken destinationToken;
  private final DestinationVCAP destinationVCAP;
  private final WebClient webClient;
  private final UriComponentsBuilder destinationBaseUriBuilder;
  private final JobSchedulerService jobSchedulerService;
  private final ReplicationErrorMessagesDAO replicationErrorMessagesDAO;

  @Autowired
  public DestinationServiceImpl(final DestinationToken destinationToken, final DestinationVCAP destinationVCAP,
      final WebClient webClient, final JobSchedulerService jobSchedulerService,
      ReplicationErrorMessagesDAO replicationErrorMessagesDAO) {
    this.destinationToken = destinationToken;
    this.destinationVCAP = destinationVCAP;
    this.webClient = webClient;
    this.destinationBaseUriBuilder = UriComponentsBuilder.fromUriString(destinationVCAP.getServiceUrl())
        .pathSegment(DESTINATION_JOB_PATH_SEGMENT).pathSegment(DESTINATION_NAME);
    this.jobSchedulerService = jobSchedulerService;
    this.replicationErrorMessagesDAO = replicationErrorMessagesDAO;
  }

  @Override
  public DestinationResponse getDestinationDetails(final Marker loggingMarker, final String subDomain,
      JobSchedulerRunHeader jobSchedulerRunHeader, final String nextDeltaToken) {

    String destinationURL = this.destinationBaseUriBuilder.cloneBuilder().build().toUriString();

    String bearerToken = this.destinationToken.getOAuthToken(loggingMarker, this.destinationVCAP, subDomain);
    if (bearerToken == null)
      return null;

    HttpHeaders requestHeaders = new HttpHeaders();
    requestHeaders.setContentType(MediaType.APPLICATION_JSON);
    requestHeaders.setBearerAuth(bearerToken);

    HttpEntity<String> requestEntity = new HttpEntity<>(requestHeaders);

    return request(loggingMarker, subDomain, jobSchedulerRunHeader, destinationURL, requestEntity,
        DestinationResponse.class, nextDeltaToken);
  }

  private DestinationResponse request(final Marker loggingMarker, final String subDomain,
      final JobSchedulerRunHeader jobSchedulerRunHeader, final String url, final HttpEntity<String> request,
      final Class<DestinationResponse> responseType, final String nextDeltaToken) {
    DestinationResponse destinationResponse;
    try {
      ResponseEntity<DestinationResponse> responseEntity = this.webClient.method(HttpMethod.GET).uri(url)
          .headers(httpHeaders -> httpHeaders.addAll(request.getHeaders())).retrieve().toEntity(responseType).block();

      destinationResponse = responseEntity != null ? responseEntity.getBody() : null;
      if (destinationResponse == null) {
        LOGGER.error(loggingMarker, "Destination service responded with empty response");
        this.jobSchedulerService.updateJobRun(loggingMarker, subDomain, jobSchedulerRunHeader,
            new JobScheduleRunPayload(false,
                new JobScheduleRunPayloadMessage(ReplicationErrorCodes.INVALID_DESTINATION_RESPONSE.getErrorCode(),
                    nextDeltaToken, this.replicationErrorMessagesDAO.getReplicationErrorMessages()
                        .get(ReplicationErrorCodes.INVALID_DESTINATION_RESPONSE.getErrorCode())).toString()));
        return null;
      }
      List<AuthTokens> authTokens = destinationResponse.getAuthTokens();
      if (authTokens == null || authTokens.isEmpty() || !authTokens.get(0).getType().equalsIgnoreCase("bearer")
          || authTokens.get(0).getValue() == null) {
        String error = authTokens != null && !authTokens.isEmpty() && authTokens.get(0) != null
            && authTokens.get(0).getError() != null ? authTokens.get(0).getError() : null;
        LOGGER.error(loggingMarker, "Destination Find API returned an error: {}", error);

        this.jobSchedulerService
            .updateJobRun(loggingMarker, subDomain, jobSchedulerRunHeader,
                new JobScheduleRunPayload(false,
                    new JobScheduleRunPayloadMessage(
                        ReplicationErrorCodes.INCORRECT_DESTINATION_CONFIGURATION.getErrorCode(), nextDeltaToken,
                        this.replicationErrorMessagesDAO.getReplicationErrorMessages()
                            .get(ReplicationErrorCodes.INCORRECT_DESTINATION_CONFIGURATION.getErrorCode()))
                                .toString()));

        return null;
      }
      if (destinationResponse.getDestinationConfiguration() == null
          || destinationResponse.getDestinationConfiguration().getUrl() == null) {
        LOGGER.error(loggingMarker, "MDI URL received from Destination response is incorrect or empty");

        this.jobSchedulerService.updateJobRun(loggingMarker, subDomain, jobSchedulerRunHeader,
            new JobScheduleRunPayload(false,
                new JobScheduleRunPayloadMessage(ReplicationErrorCodes.MDI_URL_ERROR.getErrorCode(), nextDeltaToken,
                    this.replicationErrorMessagesDAO.getReplicationErrorMessages()
                        .get(ReplicationErrorCodes.MDI_URL_ERROR.getErrorCode())).toString()));

        return null;
      }
    } catch (WebClientResponseException webClientResponseException) {
      LOGGER.error(loggingMarker, "{} {} returned error code {}. Response Body: {} Message: {}", HttpMethod.GET, url,
          webClientResponseException.getRawStatusCode(), webClientResponseException.getResponseBodyAsString(),
          webClientResponseException.getMessage(), webClientResponseException);
      if (webClientResponseException.getStatusCode() == HttpStatus.NOT_FOUND) {
        String errorMessage = StringFormatter.format(
            this.replicationErrorMessagesDAO.getReplicationErrorMessages()
                .get(ReplicationErrorCodes.DESTINATION_NOT_FOUND.getErrorCode()),
            Arrays.asList(Integer.toString(webClientResponseException.getRawStatusCode()),
                webClientResponseException.getResponseBodyAsString()));

        this.jobSchedulerService.updateJobRun(loggingMarker, subDomain, jobSchedulerRunHeader,
            new JobScheduleRunPayload(false,
                new JobScheduleRunPayloadMessage(ReplicationErrorCodes.DESTINATION_NOT_FOUND.getErrorCode(),
                    nextDeltaToken, errorMessage).toString()));

      } else {
        String errorMessage = StringFormatter.format(
            this.replicationErrorMessagesDAO.getReplicationErrorMessages()
                .get(ReplicationErrorCodes.EXCEPTION.getErrorCode()),
            Arrays.asList(Integer.toString(webClientResponseException.getRawStatusCode()),
                webClientResponseException.getResponseBodyAsString()));

        this.jobSchedulerService.updateJobRun(loggingMarker, subDomain, jobSchedulerRunHeader,
            new JobScheduleRunPayload(false,
                new JobScheduleRunPayloadMessage(ReplicationErrorCodes.EXCEPTION.getErrorCode(), nextDeltaToken,
                    errorMessage).toString()));

      }
      return null;
    } catch (Exception exception) {
      LOGGER.error(loggingMarker, "{} {} returned Message: {} Exception: {}", HttpMethod.GET, url,
          exception.getMessage(), exception);
      String errorMessage = StringFormatter.format(this.replicationErrorMessagesDAO.getReplicationErrorMessages()
          .get(ReplicationErrorCodes.UNKNOWN.getErrorCode()), exception.getMessage());

      this.jobSchedulerService.updateJobRun(loggingMarker, subDomain, jobSchedulerRunHeader, new JobScheduleRunPayload(
          false,
          new JobScheduleRunPayloadMessage(ReplicationErrorCodes.EXCEPTION.getErrorCode(), nextDeltaToken, errorMessage)
              .toString()));
      return null;
    }
    return destinationResponse;
  }
}
