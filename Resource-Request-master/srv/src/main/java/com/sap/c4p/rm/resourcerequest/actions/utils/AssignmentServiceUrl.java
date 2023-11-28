package com.sap.c4p.rm.resourcerequest.actions.utils;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

@Component
@PropertySource("classpath:application.properties")
public class AssignmentServiceUrl {

  private String url;
  private String schema;
  private String host;

  private static final Logger LOGGER = LoggerFactory.getLogger(AssignmentServiceUrl.class);
  private static final Marker MARKER = LoggingMarker.ASSIGNMENT_SERVICE_URL.getMarker();

  // Constructor
  public AssignmentServiceUrl() {
  }

  // Overloaded constructor for mocking
  public AssignmentServiceUrl(String schema, String url, String host) {
    this.schema = schema;
    this.url = url;
    this.host = host;
  }

  public synchronized String getUrl() {
    return this.url;
  }

  public synchronized void setUrl(String url) {
    this.url = url;
  }

  public synchronized String getSchema() {
    return this.schema;
  }

  public synchronized void setSchema(String schema) {
    this.schema = schema;
  }

  public synchronized String getHost() {
    return this.host;
  }

  public synchronized void setHost(String host) {
    this.host = host;
  }

  // Assignment Simulation
  public final String getAssignmentServiceUrl() {

    // Workaround Code to fetch Assignment Srv URL
    String environmentVariable = getEnvironmentVariable();
    JSONObject environmentVariableJsonObject = null;
    JSONArray applicationUrls = null;
    String assignmentUrl = null;
    String urlToAssignmentSrv = null;

    if (environmentVariable != null && !environmentVariable.isEmpty()) {

      try {

        environmentVariableJsonObject = new JSONObject(environmentVariable);
        applicationUrls = environmentVariableJsonObject.getJSONArray("application_uris");

      } catch (JSONException e) {
        LOGGER.error(MARKER, "Error during parsing the environment variables", e);
      }

      if (applicationUrls != null && !applicationUrls.isEmpty()) {

        assignmentUrl = (String) applicationUrls.get(0);
        assignmentUrl = assignmentUrl.replace("resourcerequest-srv", "assignment-srv");

        LOGGER.info(MARKER, "application_uris found and replaced with 'assignment-srv': {}", assignmentUrl);
        this.setHost(assignmentUrl);

        // For CF the schema should be 'https'
        this.setSchema("https");
        urlToAssignmentSrv = this.getSchema() + "://" + assignmentUrl;

      } else {
        LOGGER.error(MARKER, "Error: no applicationUris found and cannot determine the URL of assignment-srv");
      }

    } else {

      // For local debugging:
      urlToAssignmentSrv = this.getUrl();
    }

    LOGGER.info(MARKER, "Assignment Service URL: {}", urlToAssignmentSrv);

    return urlToAssignmentSrv;

  }

  /*
   * The environment variables are read to retrieve the resource request app
   * route. This route is used to form url to assignment service. Currently, there
   * is no other alternative to get assignment service route and hence the
   * environment variables need to be read. Based on
   * https://rules.sonarsource.com/java/RSPEC-5304 - Sonarsource rules the rule -
   * S5304 is deprecated and will be eventually removed.
   */

  public String getEnvironmentVariable() {
    return System.getenv("VCAP_APPLICATION");
  }

}
