package com.sap.c4p.rm.utils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.springframework.beans.factory.annotation.Autowired;

import com.sap.c4p.rm.InitMocks;
import com.sap.c4p.rm.exceptions.LanguageCodeFormatException;

public class CommonUtilityImplTest extends InitMocks {

    @Autowired
    @InjectMocks
    CommonUtilityImpl classUnderTest;

    @Test
    @DisplayName("Test toLocalDate When given Date string is a TimeStamp")
    public void testToLocalDate() {
        String timeStamp = "2020-01-01 00:00:00";
        assertThrows(DateTimeParseException.class, () -> this.classUnderTest.toLocalDate(timeStamp));
    }

    @Test
    @DisplayName("Test toLocalDate When given string is a TimeStamp")
    public void testToLocalDate1() {
        String timeStamp = "2020-01-01";
        LocalDate sdvs = LocalDate.parse("2020-01-01");
        assertEquals(sdvs, this.classUnderTest.toLocalDate(timeStamp));
    }

    @Test
    @DisplayName("Test isValidJson when given string is not a JSONObject||JSONArray")
    public void testIsValidJson() {
        String str = "ascdfas";
        assertFalse(this.classUnderTest.isValidJson(str));
        String str1 = "}";
        assertFalse(this.classUnderTest.isValidJson(str1));
        String str2 = "]";
        assertFalse(this.classUnderTest.isValidJson(str2));
        String str3 = "}dcs{";
        assertFalse(this.classUnderTest.isValidJson(str3));
        String str4 = "]dcs[";
        assertFalse(this.classUnderTest.isValidJson(str4));
    }

    @Test
    @DisplayName("Test isValidJson when given string is with valid JSONObject||JSONArray")
    public void testIsValidJson1() {
        String str = "{}";
        assertTrue(this.classUnderTest.isValidJson(str));
        String str1 = "[]";
        assertTrue(this.classUnderTest.isValidJson(str1));
        String str2 = "[{}]";
        assertTrue(this.classUnderTest.isValidJson(str2));
        String str3 = "[{}, das]";
        assertTrue(this.classUnderTest.isValidJson(str3));
        String str4 = "[{}],{}";
        assertTrue(this.classUnderTest.isValidJson(str4));
        String str6 = "{\"key\":\"value\"}";
        assertTrue(this.classUnderTest.isValidJson(str6));
        String str7 = "[{\"key1\":\"value1\"}]";
        assertTrue(this.classUnderTest.isValidJson(str7));
        String str8 = "[{\"key1\":\"value1\"},{\"key2\":\"value2\"}]";
        assertTrue(this.classUnderTest.isValidJson(str8));
    }

	@Test
	@DisplayName("Test convertBCPToISO when given language code is a valid BCP code")
	public void testConvertBCPToISOValidBCPCode() {
		String languageCode = "en-US";
		assertEquals("en", this.classUnderTest.convertBCPToISO(languageCode, "name"));
	}

	@Test
	@DisplayName("Test convertBCPToISO when given language code is a valid 3 letter lang code BCP code")
	public void testConvertBCPToISOValidBCPCode3LetterLangCode() {
		String languageCode = "eng-US";
		assertEquals(null, this.classUnderTest.convertBCPToISO(languageCode, "name"));
	}

	@Test
	@DisplayName("Test convertBCPToISO when given language code is a invalid BCP code")
	public void testConvertBCPToISOInvalidBCPCode() {
		String languageCode = "enUS-FR";
		assertThrows(LanguageCodeFormatException.class,() -> this.classUnderTest.convertBCPToISO(languageCode, "name"));
	}

	@Test
	@DisplayName("Test convertBCPToISO when given language code is a empty")
	public void testConvertBCPToISOEmptyCode() {
		String languageCode = "";
		assertThrows(LanguageCodeFormatException.class,
				() -> this.classUnderTest.convertBCPToISO(languageCode, "name"));
	}

	@Test
	@DisplayName("Test convertBCPToISO when given language code is a valid ISO code")
	public void testConvertBCPToISOValidISOCode() {
		String languageCode = "en";
		assertEquals("en", this.classUnderTest.convertBCPToISO(languageCode, "name"));
	}

}
