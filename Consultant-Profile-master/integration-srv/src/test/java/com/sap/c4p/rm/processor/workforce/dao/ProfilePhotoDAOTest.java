package com.sap.c4p.rm.processor.workforce.dao;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.c4p.rm.InitMocks;
import com.sap.c4p.rm.exceptions.TransactionException;
import com.sap.cds.Result;
import com.sap.cds.ql.cqn.CqnUpsert;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.resourcemanagement.employee.ProfilePhoto;

public class ProfilePhotoDAOTest extends InitMocks {

    @Mock
    PersistenceService persistenceService;

    @Mock
    Result result;

    @Autowired
    @InjectMocks
    ProfilePhotoDAOImpl classUnderTest;

    @Test
    @DisplayName("test save when persistence run raise exception")
    public void testSaveWhenPersistenceRunRaiseException() {
        ProfilePhoto profilePhoto = ProfilePhoto.create();
        doThrow(ServiceException.class).when(this.persistenceService).run(any(CqnUpsert.class));
        assertThrows(TransactionException.class, () -> this.classUnderTest.save(profilePhoto));
        verify(this.persistenceService, times(1)).run(any(CqnUpsert.class));
    }

    @Test
    @DisplayName("test save when persistence do not raise exception")
    public void testSaveWhenPersistenceDoNotRaiseException() {
        ProfilePhoto profilePhoto = ProfilePhoto.create();
        this.classUnderTest.save(profilePhoto);
        verify(this.persistenceService, times(1)).run(any(CqnUpsert.class));
    }

}
