package com.sap.c4p.rm.handlers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.sap.c4p.rm.cloudfoundry.environment.DestinationVCAP;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.slf4j.LoggerFactory;

import com.sap.cds.services.mt.MtGetDependenciesEventContext;
import com.sap.cds.services.mt.MtUnsubscribeEventContext;

import com.sap.c4p.rm.InitMocks;
import com.sap.c4p.rm.cloudfoundry.environment.JobSchedulerVCAP;
import com.sap.c4p.rm.utils.StringFormatter;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import io.pivotal.cfenv.core.CfApplication;
import io.pivotal.cfenv.core.CfCredentials;
import io.pivotal.cfenv.core.CfEnv;
import io.pivotal.cfenv.core.CfService;

public class SubscriptionHandlerTest extends InitMocks {

    private final Logger logger = (Logger) LoggerFactory.getLogger(SubscriptionHandler.class);

    private static final String UAA_NAME = "uaa";
    protected static final String XS_APP_NAME = "xsappname";
    protected static final String UAA_DOMAIN = "uaadomain";
    protected static final String IDENTITY_ZONE = "identityzone";
    protected static final String TENANT_ID = "tenantid";
    private static final String ONE_MDS_XS_APP_NAME = "oneMDSSAppName";

    private ListAppender<ILoggingEvent> listAppender;

    @Mock
    CfEnv cfEnv;

    @Mock
    CfApplication cfApplication;

    @Mock
    CfService cfService;

    @Mock
    CfCredentials cfCredentials;

    @Mock
    JobSchedulerVCAP jobSchedulerVCAP;

    @Mock
    DestinationVCAP destinationVCAP;

    @Mock
    MtUnsubscribeEventContext mtUnsubscribeEventContext;

    @Mock
    MtGetDependenciesEventContext mtGetDependenciesEventContext;

    private SubscriptionHandler classUnderTest;

    @BeforeEach
    public void setUp() {
        when(cfEnv.getApp()).thenReturn(cfApplication);
        when(cfEnv.findServiceByLabel(anyString())).thenReturn(cfService);
        when(cfService.getCredentials()).thenReturn(cfCredentials);
        Map<String, Object> map = new HashMap<>();
        when(cfCredentials.getMap()).thenReturn(map);
        HashMap<String, String> uaaDetails = new HashMap<>();
        uaaDetails.put(UAA_DOMAIN, UAA_DOMAIN);
        uaaDetails.put(XS_APP_NAME, ONE_MDS_XS_APP_NAME);
        uaaDetails.put(IDENTITY_ZONE, IDENTITY_ZONE);
        uaaDetails.put(TENANT_ID, TENANT_ID);
        map.put(UAA_NAME, uaaDetails);
        this.classUnderTest = new SubscriptionHandler(this.jobSchedulerVCAP, this.cfEnv, destinationVCAP);
        this.listAppender = new ListAppender<>();
        this.listAppender.start();
        logger.addAppender(listAppender);
    }

    @Test
    @DisplayName("Test beforeUnsubscribe when subscription is invoked")
    public void testBeforeUnsubscribe() {
        this.classUnderTest.beforeUnsubscribe(this.mtUnsubscribeEventContext);
        verify(this.mtUnsubscribeEventContext, times(1)).setDelete(anyBoolean());
    }

    @Test
    @DisplayName("test afterGetDependencies when call for dependencies collection is triggered")
    public void testAfterGetDependencies() {
        String jobSchedulerXSAppName = "jobSchedulerXSAppName";
        when(this.jobSchedulerVCAP.getXsAppName()).thenReturn(jobSchedulerXSAppName);
        this.classUnderTest.afterGetDependencies(this.mtGetDependenciesEventContext);
        List<ILoggingEvent> logsList = listAppender.list;
        assertEquals(4, logsList.size());
        ILoggingEvent afterHookGetDependencies = logsList.get(0);
        ILoggingEvent jobSchedulerLog = logsList.get(1);
        ILoggingEvent oneMDSLog = logsList.get(2);
        assertEquals(Level.INFO, afterHookGetDependencies.getLevel());
        assertEquals("@After (GET_DEPENDENCIES)", afterHookGetDependencies.getFormattedMessage());
        assertEquals(Level.INFO, jobSchedulerLog.getLevel());
        assertEquals(StringFormatter.format("JobScheduler XSAPPNAME : ({0})", jobSchedulerXSAppName),
                jobSchedulerLog.getFormattedMessage());
        assertEquals(Level.INFO, oneMDSLog.getLevel());
        assertEquals(StringFormatter.format("OneMDS/MasterDataIntegration XSAPPNAME : ({0})", ONE_MDS_XS_APP_NAME),
                oneMDSLog.getFormattedMessage());
    }

}
