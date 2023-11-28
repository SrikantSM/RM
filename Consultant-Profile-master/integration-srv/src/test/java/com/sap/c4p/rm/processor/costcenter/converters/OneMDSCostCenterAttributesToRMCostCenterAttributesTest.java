package com.sap.c4p.rm.processor.costcenter.converters;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.core.convert.ConversionFailedException;
import org.springframework.core.convert.support.GenericConversionService;

import com.sap.c4p.rm.InitMocks;
import com.sap.c4p.rm.exceptions.LanguageCodeFormatException;
import com.sap.c4p.rm.processor.costcenter.dto.Attribute;
import com.sap.c4p.rm.processor.costcenter.dto.Content;
import com.sap.c4p.rm.processor.costcenter.dto.Description;
import com.sap.c4p.rm.processor.costcenter.dto.Name;
import com.sap.c4p.rm.utils.CommonUtility;
import com.sap.c4p.rm.utils.CommonUtilityImpl;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.resourcemanagement.config.DefaultLanguages;
import com.sap.resourcemanagement.organization.CostCenterAttributes;

public class OneMDSCostCenterAttributesToRMCostCenterAttributesTest extends InitMocks {

    private static final String NAME = "test name";
    private static final String DESCRIPTION = "test description";
    private static final String LANGUAGE = "en";
    private static final GenericConversionService classUnderTest = new GenericConversionService();
    private static CommonUtility commonUtility;

    @Mock
    private static PersistenceService persistenceService;

    @BeforeAll
    public static void setUpAll() {
        commonUtility = new CommonUtilityImpl(persistenceService);
        classUnderTest.addConverter(new OneMDSCostCenterAttributesToRMCostCenterAttributes(commonUtility));
    }

    @Test
    @DisplayName("test convert if source is null.")
    public void testConvertIfSourceIsNull() {
        assertNull(classUnderTest.convert(null, Attribute.class));
    }

    @Test
    @DisplayName("test convert.")
    public void testConvert() {
        Attribute oneMDSAttribute = new Attribute();
        Content content = new Content();
        Description description = new Description();
        description.setLang(LANGUAGE);
        description.setContent(DESCRIPTION);
        Name name = new Name();
        name.setLang(LANGUAGE);
        name.setContent(NAME);
        content.setDescription(Collections.singletonList(description));
        content.setName(Collections.singletonList(name));
        oneMDSAttribute.setContent(content);
        DefaultLanguages defaultLanguage = DefaultLanguages.create();
        defaultLanguage.setLanguageCode("EN");
        CommonUtility commonUtilitySpy = Mockito.spy(commonUtility);
        classUnderTest.addConverter(new OneMDSCostCenterAttributesToRMCostCenterAttributes(commonUtilitySpy));
        Mockito.doReturn(defaultLanguage).when(commonUtilitySpy).getDefaultLanguage();
        CostCenterAttributes costCenterAttributes = OneMDSCostCenterAttributesToRMCostCenterAttributesTest.classUnderTest
                .convert(oneMDSAttribute, CostCenterAttributes.class);
        assertNotNull(costCenterAttributes);
        assertNotNull(costCenterAttributes.getId());
        assertEquals(NAME, costCenterAttributes.getName());
        assertEquals(DESCRIPTION, costCenterAttributes.getDescription());
    }

	@Test
	@DisplayName("test convert BCP lang code for name and description")
	public void testConvertBCPLangCodeForNameAndDescription() {
		Attribute oneMDSAttribute = new Attribute();
		Content content = new Content();
		Description description = new Description();
		description.setLang("en-US");
		description.setContent(DESCRIPTION);
		Name name = new Name();
		name.setLang("en-US");
		name.setContent(NAME);
		content.setDescription(Collections.singletonList(description));
		content.setName(Collections.singletonList(name));
		oneMDSAttribute.setContent(content);
		DefaultLanguages defaultLanguage = DefaultLanguages.create();
		defaultLanguage.setLanguageCode("EN");
		CommonUtility commonUtilitySpy = Mockito.spy(commonUtility);
		classUnderTest.addConverter(new OneMDSCostCenterAttributesToRMCostCenterAttributes(commonUtilitySpy));
		Mockito.doReturn(defaultLanguage).when(commonUtilitySpy).getDefaultLanguage();
		CostCenterAttributes costCenterAttributes = OneMDSCostCenterAttributesToRMCostCenterAttributesTest.classUnderTest
				.convert(oneMDSAttribute, CostCenterAttributes.class);
		assertNotNull(costCenterAttributes);
		assertNotNull(costCenterAttributes.getId());
		assertEquals(NAME, costCenterAttributes.getName());
		assertEquals(DESCRIPTION, costCenterAttributes.getDescription());
	}

	@Test
	@DisplayName("test convert incorrect lang code for name")
	public void testConvertIncorrectLangCodeForName() {
		Attribute oneMDSAttribute = new Attribute();
		Content content = new Content();
		Description description = new Description();
		description.setLang("en-US");
		description.setContent(DESCRIPTION);
		Name name = new Name();
		name.setLang("something/US");
		name.setContent(NAME);
		content.setDescription(Collections.singletonList(description));
		content.setName(Collections.singletonList(name));
		oneMDSAttribute.setContent(content);
		DefaultLanguages defaultLanguage = DefaultLanguages.create();
		defaultLanguage.setLanguageCode("EN");
		CommonUtility commonUtilitySpy = Mockito.spy(commonUtility);
		classUnderTest.addConverter(new OneMDSCostCenterAttributesToRMCostCenterAttributes(commonUtilitySpy));
		Mockito.doReturn(defaultLanguage).when(commonUtilitySpy).getDefaultLanguage();
		ConversionFailedException conversionFailedException = assertThrows(ConversionFailedException.class,
				() -> OneMDSCostCenterAttributesToRMCostCenterAttributesTest.classUnderTest.convert(oneMDSAttribute,
						CostCenterAttributes.class));
		LanguageCodeFormatException languageCodeFormatException = (LanguageCodeFormatException) conversionFailedException
				.getCause();
		List<String> languageCodeFormatExceptionParameters = languageCodeFormatException.getParameters();
		assertEquals(OneMDSCostCenterAttributesToRMCostCenterAttributes.COST_CENTER_NAME_LANGUAGE_CODE,
				languageCodeFormatExceptionParameters.get(0));
	}

	@Test
	@DisplayName("test convert incorrect lang code for description")
	public void testConvertIncorrectLangCodeForDescription() {
		Attribute oneMDSAttribute = new Attribute();
		Content content = new Content();
		Description description = new Description();
		description.setLang("long---US");
		description.setContent(DESCRIPTION);
		Name name = new Name();
		name.setLang("en-FR");
		name.setContent(NAME);
		content.setDescription(Collections.singletonList(description));
		content.setName(Collections.singletonList(name));
		oneMDSAttribute.setContent(content);
		DefaultLanguages defaultLanguage = DefaultLanguages.create();
		defaultLanguage.setLanguageCode("EN");
		CommonUtility commonUtilitySpy = Mockito.spy(commonUtility);
		classUnderTest.addConverter(new OneMDSCostCenterAttributesToRMCostCenterAttributes(commonUtilitySpy));
		Mockito.doReturn(defaultLanguage).when(commonUtilitySpy).getDefaultLanguage();
		ConversionFailedException conversionFailedException = assertThrows(ConversionFailedException.class,
				() -> OneMDSCostCenterAttributesToRMCostCenterAttributesTest.classUnderTest.convert(oneMDSAttribute,
						CostCenterAttributes.class));
		LanguageCodeFormatException languageCodeFormatException = (LanguageCodeFormatException) conversionFailedException
				.getCause();
		List<String> languageCodeFormatExceptionParameters = languageCodeFormatException.getParameters();
		assertEquals(OneMDSCostCenterAttributesToRMCostCenterAttributes.COST_CENTER_DESCRIPTION_LANGUAGE_CODE,
				languageCodeFormatExceptionParameters.get(0));
	}

}
