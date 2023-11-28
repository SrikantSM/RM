package com.sap.c4p.rm.projectintegrationadapter.util;

import java.util.List;
import java.util.stream.Stream;

public interface ReplicationMessages {

  /**
   * @param message Replication message
   * @return The resulting {@link ReplicationMessage} object which can be adapted
   *         accordingly
   */
  ReplicationMessage info(String message);

  /**
   * @param message Replication message
   * @return The resulting {@link ReplicationMessage} object which can be adapted
   *         accordingly
   */
  ReplicationMessage success(String message);

  /**
   * @param message Replication message
   * @return The resulting {@link ReplicationMessage} object which can be adapted
   *         accordingly
   */
  ReplicationMessage warn(String message);

  /**
   * @param message Replication message
   * @return The resulting {@link ReplicationMessage} object which can be adapted
   *         accordingly
   */
  ReplicationMessage error(String message);

  /**
   * Returns a {@link Stream} of the added messages
   *
   * @return The {@link Stream} of the added messages
   */
  Stream<ReplicationMessage> stream();

  /**
   * Returns a {@link List} of the added messages
   *
   * @return The {@link List} of the added messages
   */
  List<ReplicationMessage> getMessages();

  /**
   * Returns a {@link List} of the added error messages
   *
   * @return The {@link List} of the added error messages
   */
  List<ReplicationMessage> getErrorMessages();

}
