package com.sap.c4p.rm.skill.mdiintegration.utils;

import com.sap.cds.Struct;

public interface LanguageContent {

  public String getLang();

  public void setLang(String lang);

  public String getContent();

  public void setContent(String content);

  static LanguageContent create() {
    return Struct.create(LanguageContent.class);
  }
}
