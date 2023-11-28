package com.sap.c4p.rm.assignment.integration;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;

import com.sap.cds.services.ServiceException;
import com.sap.cloud.sdk.cloudplatform.connectivity.DestinationOptions;
import com.sap.cloud.sdk.cloudplatform.connectivity.HttpDestination;
import com.sap.cloud.sdk.cloudplatform.connectivity.ScpCfDestination;
import com.sap.cloud.sdk.cloudplatform.connectivity.ScpCfDestinationLoader;
import com.sap.cloud.sdk.cloudplatform.connectivity.ScpCfDestinationOptionsAugmenter;
import com.sap.cloud.sdk.cloudplatform.connectivity.ScpCfDestinationRetrievalStrategy;

import com.sap.c4p.rm.assignment.config.LoggingMarker;
import com.sap.c4p.rm.assignment.gen.MessageKeys;
import com.sap.c4p.rm.assignment.utils.HttpStatus;

import io.vavr.control.Try;

public class SupplyDestination {

  private static final Logger LOGGER = LoggerFactory.getLogger(SupplyDestination.class);
  private static final Marker INTEGRATION_MARKER = LoggingMarker.INTEGRATION_MARKER.getMarker();
  private static final String PROPERTY_C4PRMCONSUMER = "C4PRMS4Consumer";
  private static final String PROPERTY_C4PRMCONSUMER_VALUE = "true";

  public SupplyDestination() {
    // No data to set, thus empty.
  }

  public HttpDestination getDestination() {

    try {
      DestinationOptions destinationOptions = DestinationOptions.builder()
          .augmentBuilder(ScpCfDestinationOptionsAugmenter.augmenter()
              .retrievalStrategy(ScpCfDestinationRetrievalStrategy.CURRENT_TENANT))
          .build();

      LOGGER.info(INTEGRATION_MARKER, "Destinations Options  {}", destinationOptions);

      final Try<Iterable<ScpCfDestination>> destinations = new ScpCfDestinationLoader()
          .tryGetAllDestinations(destinationOptions);

      List<ScpCfDestination> s4DestinationsList = StreamSupport.stream(destinations.get().spliterator(), false)
          .filter(s4Destination -> {
            Optional<Object> configuredObject = s4Destination.get(PROPERTY_C4PRMCONSUMER).toJavaOptional();
            if (configuredObject.isPresent()) {
              return configuredObject.get().equals(PROPERTY_C4PRMCONSUMER_VALUE);
            } else {
              return false;
            }
          }).collect(Collectors.toList());

      if (s4DestinationsList.size() == 1) {
        HttpDestination destination = new ScpCfDestinationLoader()
            .tryGetDestination(s4DestinationsList.get(0).getName()).get().asHttp();
        LOGGER.info(INTEGRATION_MARKER, "Destination found, S4 integration will take place");
        return destination;
      } else if (s4DestinationsList.isEmpty()) {
        LOGGER.warn(INTEGRATION_MARKER, "No configured destination found to trigger S4 integration");
        throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.MISSING_S4_DESTINATION);
      } else {
        LOGGER.warn(INTEGRATION_MARKER, "Multiple configured destination entries found for S4 integration");
        throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.MULTIPLE_S4_DESTINATIONS);
      }

    } catch (ServiceException explicitlyRaisedException) {
      throw explicitlyRaisedException;
    } catch (Exception e) {
      LOGGER.error(INTEGRATION_MARKER, "Unexpected error while determining destination for S4 integration", e);
      throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.ERROR_ON_DESTINATION_READ);
    }
  }
}