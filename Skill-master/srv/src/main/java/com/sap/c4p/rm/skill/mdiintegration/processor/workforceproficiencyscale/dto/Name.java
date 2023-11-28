package com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dto;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Name implements Serializable {
  @JsonProperty("lang")
  private String lang;
  @JsonProperty("content")
  private String content;

  @JsonProperty("lang")
  public String getLang() {
    return lang;
  }

  @JsonProperty("lang")
  public void setLang(String lang) {
    this.lang = lang;
  }

  @JsonProperty("content")
  public String getContent() {
    return content;
  }

  @JsonProperty("content")
  public void setContent(String content) {
    this.content = content;
  }

}
