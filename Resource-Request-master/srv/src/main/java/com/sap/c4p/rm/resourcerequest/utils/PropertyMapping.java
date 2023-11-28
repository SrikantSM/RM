package com.sap.c4p.rm.resourcerequest.utils;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import manageresourcerequestservice.ResourceRequests;
import manageresourcerequestservice.ResourceRequests_;

@Component
public class PropertyMapping {

  private Map<String, Map<String, String>> propertyMappingMap = new HashMap<>();

  private Map<String, String> idMapping = new HashMap<>();
  private Map<String, String> displaIdMapping = new HashMap<>();
  private Map<String, String> startDateMapping = new HashMap<>();
  private Map<String, String> endDateMapping = new HashMap<>();
  private Map<String, String> requestedCapacityMapping = new HashMap<>();
  private Map<String, String> nameMapping = new HashMap<>();
  private Map<String, String> descriptionMapping = new HashMap<>();

  public PropertyMapping() {
    // Fill all mappings in the hashmap.
    idMapping.put(ResourceRequests_.CDS_NAME, ResourceRequests.ID);
    idMapping.put(resourcerequestservice.ResourceRequests_.CDS_NAME, resourcerequestservice.ResourceRequests.ID);
    propertyMappingMap.put(Constants.PropertyNames.ID, idMapping);

    displaIdMapping.put(ResourceRequests_.CDS_NAME, ResourceRequests.DISPLAY_ID);
    displaIdMapping.put(resourcerequestservice.ResourceRequests_.CDS_NAME,
        resourcerequestservice.ResourceRequests.DISPLAY_ID);
    propertyMappingMap.put(Constants.PropertyNames.DISPLAY_ID, displaIdMapping);

    startDateMapping.put(ResourceRequests_.CDS_NAME, ResourceRequests.START_DATE);
    startDateMapping.put(resourcerequestservice.ResourceRequests_.CDS_NAME,
        resourcerequestservice.ResourceRequests.START_DATE);
    propertyMappingMap.put(Constants.PropertyNames.START_DATE, startDateMapping);

    endDateMapping.put(ResourceRequests_.CDS_NAME, ResourceRequests.END_DATE);
    endDateMapping.put(resourcerequestservice.ResourceRequests_.CDS_NAME,
        resourcerequestservice.ResourceRequests.END_DATE);
    propertyMappingMap.put(Constants.PropertyNames.END_DATE, endDateMapping);

    requestedCapacityMapping.put(ResourceRequests_.CDS_NAME, ResourceRequests.REQUESTED_CAPACITY);
    requestedCapacityMapping.put(resourcerequestservice.ResourceRequests_.CDS_NAME,
        resourcerequestservice.ResourceRequests.REQUIRED_EFFORT);
    propertyMappingMap.put(Constants.PropertyNames.REQUESTED_CAPACITY, requestedCapacityMapping);

    nameMapping.put(ResourceRequests_.CDS_NAME, ResourceRequests.NAME);
    nameMapping.put(resourcerequestservice.ResourceRequests_.CDS_NAME, resourcerequestservice.ResourceRequests.NAME);
    propertyMappingMap.put(Constants.PropertyNames.NAME, nameMapping);

    descriptionMapping.put(ResourceRequests_.CDS_NAME, ResourceRequests.DESCRIPTION);
    descriptionMapping.put(resourcerequestservice.ResourceRequests_.CDS_NAME,
        resourcerequestservice.ResourceRequests.DESCRIPTION);
    propertyMappingMap.put(Constants.PropertyNames.DESCRIPTION, descriptionMapping);

  }

  /*
   * This method is used to get the target value when an error occurs this way
   * custom target value can be provided based on requesting service.
   */

  public String getTargetForServiceAndField(String entityName, String fieldName) {
    String field = propertyMappingMap.get(fieldName).get(entityName);
    if (entityName.equals(ResourceRequests_.CDS_NAME)) {
      return "in/" + field;
    } else {
      return field;
    }
  }
}