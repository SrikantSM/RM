package com.sap.c4p.rm.skill.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.*;

@Configuration
public class CacheConfig {

  @Primary
  @Bean
  @Scope(scopeName = "requestWithFallback", proxyMode = ScopedProxyMode.TARGET_CLASS)
  public CacheManager requestScopedCacheManager() {

    return new ConcurrentMapCacheManager("findByRank", "findExistingLanguageCodes", "ProficiencySets.findByName");
  }
}
