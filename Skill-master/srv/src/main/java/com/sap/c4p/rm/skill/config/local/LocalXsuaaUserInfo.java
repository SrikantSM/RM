package com.sap.c4p.rm.skill.config.local;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.sap.cds.feature.xsuaa.XsuaaUserInfo;

@Profile({ "!cloud & !local-int-test" })
@Primary
@Qualifier("xsuaaUserInfo")
@Component
public class LocalXsuaaUserInfo implements XsuaaUserInfo {

  @Override
  public String getName() {
    return "JohnDoe";
  }

  @Override
  public boolean isAuthenticated() {
    return true;
  }

  @Override
  public String getEmail() {
    return "authenticated-user@sap.com";
  }

  @Override
  public String getOrigin() {
    return "sap";
  }

  @Override
  public String getGivenName() {
    return "JohnDoe";
  }

  @Override
  public String getFamilyName() {
    return null;
  }

  @Override
  public String getSubDomain() {
    return "consumer-subdomain";
  }

  @Override
  public String getTenant() {
    return "51c2cff27e944d4d8e983284727b8493";
  }

}
