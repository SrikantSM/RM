package com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapabilitycatalog.dao;

import java.util.List;

import com.sap.cds.ql.*;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.resourcemanagement.skill.Catalogs2Skills;
import com.sap.resourcemanagement.skill.Catalogs2Skills_;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.sap.cds.Result;
import com.sap.cds.Row;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.skill.config.LoggingMarker;
import com.sap.c4p.rm.skill.mdiintegration.exceptions.TransactionException;
import com.sap.c4p.rm.skill.mdiintegration.utils.IsNullCheckUtils;

import com.sap.resourcemanagement.skill.Catalogs;
import com.sap.resourcemanagement.skill.Catalogs_;

@Repository
public class WorkForceCapabilityCatalogDAOImpl implements WorkForceCapabilityCatalogDAO {

  private static final Logger LOGGER = LoggerFactory.getLogger(WorkForceCapabilityCatalogDAO.class);
  private static final Marker WORKFORCE_CAPABILITY_CATALOG_REPLICATION = LoggingMarker.WORKFORCE_CAPABILITY_CATALOG_REPLICATION
      .getMarker();

  private final PersistenceService persistenceService;

  @Autowired
  public WorkForceCapabilityCatalogDAOImpl(final PersistenceService persistenceService) {
    this.persistenceService = persistenceService;
  }

  @Override
  public void save(final Catalogs catalogs) {
    CqnInsert cqnInsert = Insert.into(Catalogs_.CDS_NAME).entry(catalogs);
    try {
      this.persistenceService.run(cqnInsert);
      LOGGER.info("Inserted Catalog Successfully");
    } catch (ServiceException serviceException) {
      LOGGER.error(WORKFORCE_CAPABILITY_CATALOG_REPLICATION, "Error occurred while inserting Catalogs Information");
      throw new TransactionException(serviceException, "inserting", "Catalogs");
    }
  }

  @Override
  public List<Catalogs> readAll() {
    CqnSelect cqnSelect = Select.from(Catalogs_.class).columns(catalog -> catalog.ID()).where(catalog -> catalog.OID().isNotNull());
    return this.persistenceService.run(cqnSelect).listOf(Catalogs.class);
  }

  @Override
  public Row getExistingCatalog(String catalogID) {
    Result catalogs = persistenceService
        .run(Select.from(Catalogs_.CDS_NAME).where(b -> b.get(Catalogs.OID).eq(catalogID)));
    if (!IsNullCheckUtils.isNullOrEmpty(catalogs))
      return catalogs.single();
    else
      return null;
  }

  @Override
  public void update(final Catalogs catalog) {
    CqnUpdate cqnUpdate = Update.entity(Catalogs_.CDS_NAME).data(catalog);
    try {
      this.persistenceService.run(cqnUpdate);
      LOGGER.info("Updated Catalog Successfully");
    } catch (ServiceException serviceException) {
      LOGGER.error(WORKFORCE_CAPABILITY_CATALOG_REPLICATION, "Error occurred while updating Catalogs Information");
      throw new TransactionException(serviceException, "updating", "Catalogs");
    }
  }

  @Override
  public Boolean isCatalogDeletionAllowed(String catalogID) {

    Result catalog2Skill = persistenceService.run(Select.from(Catalogs2Skills_.CDS_NAME).where(c -> c.get(Catalogs2Skills.CATALOG_ID).eq(catalogID)).limit(1));

    if (IsNullCheckUtils.isNullOrEmpty(catalog2Skill))
      return Boolean.TRUE;
    else
      return Boolean.FALSE;
  }

  @Override
  public void delete(final String catalogId) {
    CqnDelete cqnDelete = Delete.from(Catalogs_.CDS_NAME).where(a -> a.get("ID").eq(catalogId));
    try {
      this.persistenceService.run(cqnDelete);
      LOGGER.info("Deleted Catalog Successfully");
    } catch (ServiceException serviceException) {
      LOGGER.error(WORKFORCE_CAPABILITY_CATALOG_REPLICATION, "Error occurred while deleting Catalogs Information");
      throw new TransactionException(serviceException, "deleting", "Catalogs");
    }
  }

  @Override
  public String getCatalogName(final String catalogId) {

    Result catalog = persistenceService
            .run(Select.from(Catalogs_.CDS_NAME).where(b -> b.get(Catalogs.ID).eq(catalogId)));
    if (!IsNullCheckUtils.isNullOrEmpty(catalog))
      return catalog.single().get(Catalogs.NAME).toString();
    else
      return "";

  }

}
