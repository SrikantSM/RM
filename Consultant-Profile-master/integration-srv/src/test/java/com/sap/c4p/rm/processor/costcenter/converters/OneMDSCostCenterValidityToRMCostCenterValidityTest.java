package com.sap.c4p.rm.processor.costcenter.converters;

import static com.sap.c4p.rm.TestConstants.VALID_FROM_DATE;
import static com.sap.c4p.rm.TestConstants.VALID_TO_DATE;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.core.convert.support.GenericConversionService;

import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.processor.costcenter.dto.IsValid;
import com.sap.c4p.rm.utils.CommonUtility;
import com.sap.c4p.rm.utils.CommonUtilityImpl;

import com.sap.resourcemanagement.organization.CostCenterValidity;

public class OneMDSCostCenterValidityToRMCostCenterValidityTest {

    private static final GenericConversionService classUnderTest = new GenericConversionService();

    @Mock
    private static PersistenceService persistenceService;

    @BeforeAll
    public static void setUpAll() {
        CommonUtility commonUtility = new CommonUtilityImpl(persistenceService);
        classUnderTest.addConverter(new OneMDSCostCenterValidityToRMCostCenterValidity(commonUtility));
    }

    @Test
    @DisplayName("test convert if source is null.")
    public void testConvertIfSourceIsNull() {
        assertNull(classUnderTest.convert(null, IsValid.class));
    }

    @Test
    @DisplayName("test convert.")
    public void testConvert() {
        IsValid oneMDSValidity = new IsValid();
        oneMDSValidity.setValidFrom(VALID_FROM_DATE);
        oneMDSValidity.setValidTo(VALID_TO_DATE);
        oneMDSValidity.setContent(true);
        CostCenterValidity costCenterValidity = OneMDSCostCenterValidityToRMCostCenterValidityTest.classUnderTest
                .convert(oneMDSValidity, CostCenterValidity.class);
        assertNotNull(costCenterValidity);
        assertEquals(VALID_FROM_DATE, costCenterValidity.getValidFrom().toString());
        assertEquals(VALID_TO_DATE, costCenterValidity.getValidTo().toString());
        assertEquals(true, costCenterValidity.getIsValid());
        assertNotNull(costCenterValidity.getId());
    }

}
