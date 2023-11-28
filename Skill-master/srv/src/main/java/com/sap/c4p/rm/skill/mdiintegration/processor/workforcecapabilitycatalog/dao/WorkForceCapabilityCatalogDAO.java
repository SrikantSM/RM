package com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapabilitycatalog.dao;

import java.util.List;

import com.sap.cds.Row;

import com.sap.resourcemanagement.skill.Catalogs;

public interface WorkForceCapabilityCatalogDAO {
  void save(final Catalogs catalogs);

  Row getExistingCatalog(String catalogID);

  void update(final Catalogs catalog);

  List<Catalogs> readAll();

  Boolean isCatalogDeletionAllowed(String catalogID);

  void delete(final String catalogId);

  String getCatalogName(final String catalogId);
}