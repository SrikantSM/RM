package com.sap.c4p.rm.consultantprofile.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.sap.cds.ql.Delete;
import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.services.persistence.PersistenceService;

import projectroleservice.Roles;
import projectroleservice.RolesTexts;
import projectroleservice.RolesTexts_;

@Repository
public class ProjectRolesTextRepository {
    private final PersistenceService persistenceService;

    @Autowired
    public ProjectRolesTextRepository(final PersistenceService persistenceService) {
        this.persistenceService = persistenceService;
    }

    public void deleteActiveTexts(final Roles roles) {
        CqnDelete cqnDelete = Delete.from(RolesTexts_.CDS_NAME)
                .where(projectRolesTexts -> projectRolesTexts.get(RolesTexts.ID).eq(roles.getId()));
        this.persistenceService.run(cqnDelete);
    }

}
