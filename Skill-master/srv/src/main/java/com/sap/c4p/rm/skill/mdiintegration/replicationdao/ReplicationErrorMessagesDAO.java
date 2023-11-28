package com.sap.c4p.rm.skill.mdiintegration.replicationdao;

import java.util.Map;

import com.sap.resourcemanagement.skill.integration.ReplicationErrorMessages;

/**
 * An Interface to perform the DAO related operation for
 * {@link ReplicationErrorMessages}
 */
public interface ReplicationErrorMessagesDAO {

  /**
   * Method to fetch the list fo available error codes and message
   *
   * @return Returns an {@link Map} having the Error code as key and Error message
   *         as value.
   */
  Map<String, String> getReplicationErrorMessages();

}
