package com.sap.c4p.rm.consultantprofile.repositories;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.cds.ql.cqn.CqnDelete;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.consultantprofile.InitMocks;

import projectroleservice.Roles;

class ProjectRolesTextRepositoryTest extends InitMocks {

    @Mock
    private PersistenceService persistenceService;

    @Mock
    Roles roles;

    @InjectMocks
    @Autowired
    private ProjectRolesTextRepository classUnderTest;

    @Test
    @DisplayName("test deleteActiveTexts")
    void testDeleteActiveTexts() {
        this.classUnderTest.deleteActiveTexts(roles);
        verify(this.persistenceService, times(1)).run(any(CqnDelete.class));
    }

}
