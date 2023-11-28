package com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.environment;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class UaaDetails {
  private String clientid;
  private String clientsecret;
  private String uaadomain;
  private String xsappname;
  private String identityzone;
  private String tenantid;
  private String certificate;
  private String certurl;
  private String key;
}
