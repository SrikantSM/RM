package com.sap.c4p.rm.projectintegrationadapter.service;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.sap.cds.services.ServiceException;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.activitytype.CostCenterActivityTypeText;
import com.sap.cloud.sdk.s4hana.datamodel.odata.namespaces.businesspartner.Customer;

import com.sap.c4p.rm.projectintegrationadapter.repository.DemandRepository;
import com.sap.c4p.rm.projectintegrationadapter.repository.ProjectRepository;
import com.sap.c4p.rm.projectintegrationadapter.util.ProjectManagementS4Client;

import com.sap.resourcemanagement.project.BillingRoles;
import com.sap.resourcemanagement.project.Customers;

@DisplayName("Unit Test for Master Data Replication service objects")
public class MasterDataReplicationTest {

  public MasterDataReplication cut;

  private Map<String, String> customerMap;
  private Customers customer;
  private String customerID;
  private String customerName;

  private Map<String, String> billingRoleMap;
  private BillingRoles billingRole;
  private String billingRoleID;
  private String billingRoleName;
  String costCtrActivityType;
  String costCtrActivityTypeName;
  @Mock
  public ProjectRepository mockProjectRepository;
  @Mock
  public ProjectManagementS4Client mockS4Client;
  @Mock
  public DemandRepository mockDemandRepository;

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.initMocks(this);
    cut = new MasterDataReplication(mockProjectRepository, mockS4Client, mockDemandRepository);
  }

  @Nested
  @DisplayName("Tests to test the method:createCustomerIfNotPresent")
  public class CreateCustomerIfNotPresentTest {

    @BeforeEach
    public void setUp() {
      customer = Customers.create();

      customerID = "customer1";
      customerName = "Megatronics";
      customerMap = new HashMap<>();
      customerMap.put(Customers.ID, customerID);
      customerMap.put(Customers.NAME, customerName);
      customer.putAll(customerMap);
    }

    /**
     * When customer is present in RM,do not create customer in RM
     */
    @Test
    public void customerPresentinRM() {

      when(mockProjectRepository.getCustomerById(anyString())).thenReturn(customer);

      cut.createCustomerIfNotPresent(customerID);
      verify(mockProjectRepository, times(0)).upsertCustomer(customer);
    }

    /**
     * When customer is not present in RM create customer in RM
     */
    @Test
    public void customerNotPresentinRM() {
      Customer s4Customer = new Customer();
      Customer mockS4Customer = mock(Customer.class);
      s4Customer.setCustomer(customerID);
      s4Customer.setCustomerFullName(customerName);

      when(mockProjectRepository.getCustomerById(anyString())).thenReturn(null);
      when(mockS4Client.getCustomerDetails(customerID)).thenReturn(s4Customer);
      when(mockS4Customer.getCustomerFullName()).thenReturn(customerName);
      cut.createCustomerIfNotPresent(customerID);
      verify(mockProjectRepository, times(1)).upsertCustomer(any());

    }

    /**
     * When the method createCustomerIfNotPresent throws exception
     */
    @Test
    public void createCustomerIfNotPresentException() {
      Customer s4Customer = new Customer();
      Customer mockS4Customer = mock(Customer.class);
      s4Customer.setCustomer(customerID);
      s4Customer.setCustomerFullName(customerName);

      when(mockProjectRepository.getCustomerById(anyString())).thenReturn(null);
      when(mockS4Client.getCustomerDetails(customerID)).thenReturn(s4Customer);
      when(mockS4Customer.getCustomerFullName()).thenReturn(customerName);

      ServiceException e = new ServiceException("Error occured while creating customer masterdata");

      doThrow(e).when(mockProjectRepository).upsertCustomer(any());

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.createCustomerIfNotPresent(customerID));

      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));

    }

  }

  @Nested
  @DisplayName("Tests to test the method:createBillingIfNotPresent")
  public class CreateBillingIfNotPresentTest {

    @BeforeEach
    public void setUp() {
      billingRole = BillingRoles.create();

      billingRoleID = "billingRole1";
      billingRoleName = "Senior Developer";
      billingRoleMap = new HashMap<>();
      billingRoleMap.put(BillingRoles.ID, billingRoleID);
      billingRoleMap.put(BillingRoles.NAME, billingRoleName);
      billingRole.putAll(billingRoleMap);

      costCtrActivityType = "billingRole1";
      costCtrActivityTypeName = "Senior Developer";
    }

    /**
     * When billingRole is present in RM,do not create billingRole in RM
     */
    @Test
    public void billingRolePresentinRM() {

      when(mockDemandRepository.getBillingRoleById(billingRoleID)).thenReturn(billingRole);

      cut.createBillingIfNotPresent(billingRoleID);
      verify(mockDemandRepository, times(0)).upsertBillingRole(billingRole);
    }

    /**
     * When billingRole is not present in RM create billingRole in RM
     */
    @Test
    public void billingRoleNotPresentinRM() {

      CostCenterActivityTypeText activityType = new CostCenterActivityTypeText();
      CostCenterActivityTypeText mockActivityType = mock(CostCenterActivityTypeText.class);
      activityType.setCostCtrActivityType(costCtrActivityType);
      activityType.setCostCtrActivityTypeName(costCtrActivityTypeName);

      when(mockDemandRepository.getBillingRoleById(anyString())).thenReturn(null);
      when(mockS4Client.getCostCenterActivityTypeText(billingRoleID)).thenReturn(activityType);
      when(mockActivityType.getCostCtrActivityTypeName()).thenReturn(costCtrActivityTypeName);
      cut.createBillingIfNotPresent(billingRoleID);
      verify(mockDemandRepository, times(1)).upsertBillingRole(any());

    }

    /**
     * When the method createBillingIfNotPresent throws exception
     */
    @Test
    public void createBillingIfNotPresentException() {
      CostCenterActivityTypeText activityType = new CostCenterActivityTypeText();
      CostCenterActivityTypeText mockActivityType = mock(CostCenterActivityTypeText.class);
      activityType.setCostCtrActivityType(costCtrActivityType);
      activityType.setCostCtrActivityTypeName(costCtrActivityTypeName);

      when(mockDemandRepository.getBillingRoleById(anyString())).thenReturn(null);
      when(mockS4Client.getCostCenterActivityTypeText(billingRoleID)).thenReturn(activityType);
      when(mockActivityType.getCostCtrActivityTypeName()).thenReturn(costCtrActivityTypeName);

      ServiceException e = new ServiceException("Error occured while creating billing-role masterdata");

      doThrow(e).when(mockDemandRepository).upsertBillingRole(any());

      final ServiceException exception = assertThrows(ServiceException.class,
          () -> cut.createBillingIfNotPresent(billingRoleID));

      assertAll(() -> assertEquals(e.getMessage(), exception.getMessage()));

    }

  }

}
