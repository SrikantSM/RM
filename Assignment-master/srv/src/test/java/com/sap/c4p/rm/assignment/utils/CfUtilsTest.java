/**
 * 
 */
package com.sap.c4p.rm.assignment.utils;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import io.pivotal.cfenv.core.CfEnv;
import io.pivotal.cfenv.core.CfService;

/**
 * @author I310562
 *
 */
public class CfUtilsTest {

  public CfUtils cut;

  @Mock
  CfEnv cfEnv;

  @BeforeEach
  public void setUp() throws Exception {
    MockitoAnnotations.openMocks(this).close();
    this.cut = spy(new CfUtils());
  }

  @Test
  @DisplayName("Test for getCertUrlByServiceNameTest")
  void getCertUrlByServiceNameTest() {
    String expectedString = "https://TENANT.authentication.cert.sap.hana.ondemand.com";
    CfService cfService = null;
    when(cfEnv.findServiceByLabel(expectedString)).thenReturn(cfService);
    assertThrows(IllegalArgumentException.class, () -> {
      cut.getCertUrlByServiceName(expectedString);

    });

  }

}
