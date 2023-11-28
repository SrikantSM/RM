package com.sap.c4p.rm.skill.mdiintegration.replicationdao;

import java.util.Optional;

import org.slf4j.Marker;

import com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.masterdataintegration.MDIEntities;

import com.sap.resourcemanagement.skill.integration.OneMDSDeltaTokenInfo;

/**
 * An Interface to perform the DAO related operation for
 * {@link OneMDSDeltaTokenInfo}
 */
public interface OneMDSReplicationDeltaTokenDAO {

  /**
   * Method to persist the deltaToken received from OneMDS.MSI System
   *
   * @param entity:     Represent the entity for which the deltaToken needs to be
   *                    persisted.
   * @param deltaToken: Represent the deltaToken received from OneMDS/MDI System.
   */
  void save(final Marker loggingMarker, final MDIEntities entity, final String deltaToken);

  /**
   * Method to fetch and provide the deltaToken for the entity token is requested
   * for.
   *
   * @param entity: Represents the entity type
   * @return Returns the deltaToken available in the DB.
   */
  Optional<OneMDSDeltaTokenInfo> getDeltaToken(final MDIEntities entity);

  void markReplicationAsInitialLoadCandidate(Boolean status);

  void markReplicationForInitialLoad(final Marker loggingMarker);

}
