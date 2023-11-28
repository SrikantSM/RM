package com.sap.c4p.rm.projectintegrationadapter.util;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
import com.sap.cloud.sdk.cloudplatform.connectivity.Destination;
import com.sap.cloud.sdk.cloudplatform.connectivity.DestinationOptions;
import com.sap.cloud.sdk.cloudplatform.connectivity.ScpCfDestination;
import com.sap.cloud.sdk.cloudplatform.connectivity.ScpCfDestinationLoader;
import com.sap.cloud.sdk.cloudplatform.connectivity.ScpCfDestinationOptionsAugmenter;
import com.sap.cloud.sdk.cloudplatform.connectivity.ScpCfDestinationRetrievalStrategy;
import com.sap.cloud.sdk.s4hana.connectivity.DefaultErpHttpDestination;
import com.sap.cloud.sdk.s4hana.connectivity.ErpHttpDestination;

import com.sap.c4p.rm.projectintegrationadapter.config.LoggingMarker;

import io.vavr.control.Try;

@Component
@Profile({ "cloud" })
public class CloudDestinationAccess implements DestinationAccess {

  private static final Logger logger = LoggerFactory.getLogger(CloudDestinationAccess.class);
  private static final Marker MARKER = LoggingMarker.REPLICATION_DESTINATION_ACCESS_MARKER.getMarker();
  public static final String PROPERTY_C4PRMCONSUMER = "C4PRMS4Consumer";
  public static final String PROPERTY_C4PRMCONSUMER_VALUE = "true";

  public ErpHttpDestination getDestination() {

    try {

      DestinationOptions destinationOptions = DestinationOptions.builder()
          .augmentBuilder(ScpCfDestinationOptionsAugmenter.augmenter()
              .retrievalStrategy(ScpCfDestinationRetrievalStrategy.CURRENT_TENANT))
          .build();

      logger.info(MARKER, "Destinations Options  {}", destinationOptions);

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
        logger.info(MARKER, "Destination Name {}", s4DestinationsList.get(0).getName());
        final Try<Destination> destination = new ScpCfDestinationLoader()
            .tryGetDestination(s4DestinationsList.get(0).getName());

        return destination.get().asHttp().decorate((DefaultErpHttpDestination::new));

      } else {
        return null;
      }

    } catch (Exception e) {
      logger.debug(MARKER, "Failed to access destiantion");
      // Error logged in calling function.
      throw new ServiceException(ErrorStatuses.SERVER_ERROR, "Failed to access destiantion", e);
    }

  }

}
