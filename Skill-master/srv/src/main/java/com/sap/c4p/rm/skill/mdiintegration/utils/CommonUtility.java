package com.sap.c4p.rm.skill.mdiintegration.utils;

import java.util.List;
import java.util.Optional;
import java.util.function.Predicate;

import com.sap.resourcemanagement.config.DefaultLanguages;

public interface CommonUtility {
  DefaultLanguages getDefaultLanguage();

  boolean isValidJson(final String str);

  Predicate<LanguageContent> containsEnglishPredicate();

  <T> Optional<T> getContentByPredicate(List<T> content, Predicate<T> predicate);

  <T> Optional<T> getFirstContent(List<T> content);

  String getContent(List<LanguageContent> content);

  String normalizeLocales(String bcpLanguageCode);
   <T> List<LanguageContent> prepareLanguageContents(List<T> mdiContentList);

  <T> String getLanguageCode(T mdiContent);

  <T> String getLanguageContent(T mdiContent);
}
