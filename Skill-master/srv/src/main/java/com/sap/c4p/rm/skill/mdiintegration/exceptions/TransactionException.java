package com.sap.c4p.rm.skill.mdiintegration.exceptions;

/**
 * Exception Class to capture the transaction error for DAOs This Class extends
 * {@link ReplicationException} to provide some generic functionality for
 * replication exceptions
 */
public class TransactionException extends ReplicationException {

  public TransactionException(Throwable throwable, String... parameters) {
    super(throwable, ReplicationErrorCodes.DB_TRANSACTION, parameters);
  }

  public TransactionException(String... parameters) {
    super(null, ReplicationErrorCodes.DB_TRANSACTION, parameters);
  }

}
