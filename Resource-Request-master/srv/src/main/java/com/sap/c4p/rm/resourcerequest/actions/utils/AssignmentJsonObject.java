package com.sap.c4p.rm.resourcerequest.actions.utils;

import java.io.IOException;

import org.apache.http.HttpResponse;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;

public class AssignmentJsonObject {

  public JSONObject getAssignmentJsonObject(HttpResponse httpResponse) throws IOException {

    return new JSONObject(EntityUtils.toString(httpResponse.getEntity()));

  }

}
