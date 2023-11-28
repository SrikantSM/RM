package com.sap.c4p.rm.skill.services;

import java.util.UUID;

import org.springframework.stereotype.Service;

@Service
public class SkillUriGenerator {

  private static final String SCHEME = "sap-rm://";
  private static final String PATH_PREFIX = "skill/";

  public String generateRandomUri() {
    return SkillUriGenerator.SCHEME + SkillUriGenerator.PATH_PREFIX + UUID.randomUUID();
  }
}
