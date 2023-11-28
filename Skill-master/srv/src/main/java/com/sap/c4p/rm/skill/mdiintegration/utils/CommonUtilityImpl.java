package com.sap.c4p.rm.skill.mdiintegration.utils;

import com.sap.cds.impl.localized.LocaleUtils;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.resourcemanagement.config.DefaultLanguages;
import com.sap.resourcemanagement.config.DefaultLanguages_;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONTokener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.function.Predicate;

@Component
public class CommonUtilityImpl implements CommonUtility {
  private final PersistenceService persistenceService;

  private static final List<Locale> PRESERVED_LOCALE_LIST = Arrays.asList(
          Locale.forLanguageTag("zh-CN"),
          Locale.forLanguageTag("zh-HK"),
          Locale.forLanguageTag("zh-TW"),
          Locale.forLanguageTag("en-GB"),
          Locale.forLanguageTag("fr-CA"),
          Locale.forLanguageTag("pt-PT"),
          Locale.forLanguageTag("es-CO"),
          Locale.forLanguageTag("es-MX"),
          Locale.forLanguageTag("en-US-x-saptrc"),
          Locale.forLanguageTag("en-US-x-sappsd"),
          Locale.forLanguageTag("en-US-x-saprigi")
  );

  @Autowired
  public CommonUtilityImpl(final PersistenceService persistenceService) {
    this.persistenceService = persistenceService;
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
  public Predicate<LanguageContent> containsEnglishPredicate() {
    return f -> f.getLang().contains("en");
  }

  @Override
  public <T> Optional<T> getContentByPredicate(List<T> content, Predicate<T> predicate) {
    return content.stream().filter(predicate).findFirst();
  }

  @Override
  public <T> Optional<T> getFirstContent(List<T> content) {
    return content.stream().findFirst();
  }

  @Override
  public String getContent(List<LanguageContent> content) {
    Optional<LanguageContent> englishContent = this.getContentByPredicate(content, this.containsEnglishPredicate());

    if (englishContent.isPresent()) {
      return englishContent.get().getContent();
      //
    } else {
      /* falling back to first content */
      Optional<LanguageContent> firstContent = this.getFirstContent(content);

      if (firstContent.isPresent()) {
        return firstContent.get().getContent();
      } else
        return null;
    }
  }

  @Override
  public String normalizeLocales(String bcpLanguageCode) {
    Locale locale = Locale.forLanguageTag(bcpLanguageCode);

    if (PRESERVED_LOCALE_LIST.stream().anyMatch(preservedLocale -> preservedLocale.equals(locale))) {
      return LocaleUtils.getLocaleString(locale);
    }
    else
    {
      return locale.getLanguage();
    }
  }

 @Override
  public <T> List<LanguageContent> prepareLanguageContents(List<T> mdiContentList) {
    Map<String, LanguageContent> languageContentMap = new HashMap<>();
    mdiContentList.forEach(mdiContent -> {
      //normalize locales
      String convertedLocale = normalizeLocales(getLanguageCode(mdiContent));
        LanguageContent langContent = LanguageContent.create();
        langContent.setLang(convertedLocale);
        langContent.setContent(getLanguageContent(mdiContent));

        if(!languageContentMap.containsKey(convertedLocale)) {
          languageContentMap.put(langContent.getLang(), langContent);
        }
    });
    return new ArrayList<>(languageContentMap.values());

  }

  @Override
  public <T> String getLanguageCode(T mdiContent) {
    if (mdiContent instanceof com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dto.Name) {
      return ((com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dto.Name) mdiContent).getLang();
    }
    else if (mdiContent instanceof com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dto.Description) {
      return ((com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dto.Description) mdiContent).getLang();
    }
    else if (mdiContent instanceof com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto.Description) {
      return ((com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto.Description) mdiContent).getLang();
    }
    else if (mdiContent instanceof com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto.Name) {
      return ((com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto.Name) mdiContent).getLang();
    }
    else return null;
  }

  @Override
  public <T> String getLanguageContent(T mdiContent) {
    if (mdiContent instanceof com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dto.Name) {
      return ((com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dto.Name) mdiContent).getContent();
    }
    else if (mdiContent instanceof com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dto.Description) {
      return ((com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dto.Description) mdiContent).getContent();
    }
    else if (mdiContent instanceof com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto.Description) {
      return ((com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto.Description) mdiContent).getContent();
    }
    else if (mdiContent instanceof com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto.Name) {
      return ((com.sap.c4p.rm.skill.mdiintegration.processor.workforcecapability.dto.Name) mdiContent).getContent();
    }
    else return null;
  }


}
