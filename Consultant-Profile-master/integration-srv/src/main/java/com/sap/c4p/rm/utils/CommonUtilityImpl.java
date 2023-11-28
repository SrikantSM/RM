package com.sap.c4p.rm.utils;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONTokener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.c4p.rm.exceptions.LanguageCodeFormatException;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.resourcemanagement.config.DefaultLanguages;
import com.sap.resourcemanagement.config.DefaultLanguages_;

/**
 * Class to implement {@link CommonUtility}.
 */
@Component
public class CommonUtilityImpl implements CommonUtility {

    private final PersistenceService persistenceService;

    @Autowired
    public CommonUtilityImpl(final PersistenceService persistenceService) {
        this.persistenceService = persistenceService;
    }

    @Override
    public LocalDate toLocalDate(String dateString) {
        if (IsNullCheckUtils.isNullOrEmpty(dateString))
            return null;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        return LocalDate.parse(dateString, formatter);
    }

    @Override
    public DefaultLanguages getDefaultLanguage() {
        DefaultLanguages defaultLanguage = DefaultLanguages.create();
        defaultLanguage.setLanguageCode("EN");
        CqnSelect defaultLanguageSelect = Select.from(DefaultLanguages_.class).where(l -> l.rank().eq(0));
        return this.persistenceService.run(defaultLanguageSelect).first(DefaultLanguages.class).orElse(defaultLanguage);
    }

    @Override
    public boolean isValidJson(final String str) {
        try {
            Object json = new JSONTokener(str).nextValue();
            return (json instanceof JSONObject || json instanceof JSONArray);
        } catch (JSONException jsonException) {
            return false;
        }
    }

	@Override
	public String convertBCPToISO(String bcpLanguageCode, String fieldName) {
		String[] codes = bcpLanguageCode.split("-", 2);
		String languageCode = codes[0];
		if (languageCode.length() == 2)
			return languageCode;
		else if (languageCode.length() == 3)
			return null;
		else
			throw new LanguageCodeFormatException(fieldName);
	}
}
