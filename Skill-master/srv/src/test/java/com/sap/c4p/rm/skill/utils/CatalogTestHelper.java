package com.sap.c4p.rm.skill.utils;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.function.Function;

import catalogservice.Catalogs;

public class CatalogTestHelper {
  public static final String CATALOG_DESCRIPTION = "IT-Skill Catalog";
  public static final String CATALOG_NAME = "Catalog IT-Skills";

  public static <T> List<T> createTestEntities(int numberOfTestEntities, Function<Integer, T> entityCreationFunction) {
    List<T> entities = new ArrayList<>();
    for (int i = 0; i < numberOfTestEntities; i++) {
      entities.add(entityCreationFunction.apply(i));
    }
    return entities;
  }

  public static Catalogs createCatalog(UUID id) {
    return CatalogTestHelper.createTestEntities(i -> {
      final Catalogs catalog = Catalogs.create();
      catalog.setDescription(CATALOG_DESCRIPTION);
      catalog.setName(CATALOG_NAME);
      catalog.setId(id.toString());
      return catalog;
    });
  }

  public static Catalogs createCatalog() {
    return createCatalog(UUID.randomUUID());
  }

  public static <T> T createTestEntities(Function<Integer, T> entityCreationFunction) {
    return createTestEntities(1, entityCreationFunction).get(0);
  }
}
