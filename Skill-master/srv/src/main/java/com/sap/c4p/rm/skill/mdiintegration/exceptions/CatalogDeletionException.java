package com.sap.c4p.rm.skill.mdiintegration.exceptions;

/**
 * Exception Class to capture the catalog deletion failure.
 * This Class extends {@link ReplicationException} to
 * provide some generic functionality for replication exceptions
 */
public class CatalogDeletionException extends ReplicationException {
// Cannot delete Catalog {}, as there are skills assigned to it.
  public CatalogDeletionException(String... parameters) {
    super(null, ReplicationErrorCodes.CANNOT_DELETE_CATALOGS, parameters);
  }

}
