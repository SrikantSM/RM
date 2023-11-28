package com.sap.c4p.rm.resourcerequest.utils;

import static org.junit.jupiter.api.Assertions.*;

import java.util.function.Function;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import manageresourcerequestservice.ResourceRequests_;

class ValuePathTest {

  @Test
  @DisplayName("Create and Read")
  public void createAndRead() {
    final Function<ResourceRequests_, Object> path = ResourceRequests_::name;
    final String value = "Test";

    ValuePath<String, ResourceRequests_> cut = new ValuePath<>(value, path);
    assertEquals(value, cut.getValue());
    assertEquals(path, cut.getPath());
  }
}
