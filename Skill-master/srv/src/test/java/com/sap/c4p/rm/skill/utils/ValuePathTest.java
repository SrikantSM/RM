package com.sap.c4p.rm.skill.utils;

import static org.junit.jupiter.api.Assertions.*;

import java.util.function.Function;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import skillservice.Skills_;

class ValuePathTest {

  @Test
  @DisplayName("Create and Read")
  public void createAndRead() {
    final Function<Skills_, Object> path = Skills_::externalID;
    final String value = "Test";

    ValuePath<String, Skills_> cut = new ValuePath<>(value, path);
    assertEquals(value, cut.getValue());
    assertEquals(path, cut.getPath());
  }
}
