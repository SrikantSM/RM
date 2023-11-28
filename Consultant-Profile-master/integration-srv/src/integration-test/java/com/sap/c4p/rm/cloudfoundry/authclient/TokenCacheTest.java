package com.sap.c4p.rm.cloudfoundry.authclient;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.sap.c4p.rm.cloudfoundry.environment.AbstractVCAPService;

@ExtendWith(SpringExtension.class)
@ContextConfiguration
public class TokenCacheTest {

    @Component
    public class TokenCache extends AbstractAuthClient {
        @Override
        @Cacheable(cacheNames = "testCache", key = "#subDomain", unless = "#result == null")
        public String getOAuthToken(final Marker loggingMarker, final AbstractVCAPService saasRegistryVCAP,
                final String subDomain) {
            if (subDomain == "s1") {
                if (saasRegistryVCAP == null)
                    return null;
                else
                    return "t1";
            } else if (subDomain == "s2") {
                if (saasRegistryVCAP == null)
                    return "t2";
                else
                    return "t3";
            } else {
                return "t";
            }
        }
    }

    @Configuration
    @EnableCaching
    public static class TestConfig {
        @Bean
        CacheManager cacheManager() {
            return new ConcurrentMapCacheManager();
        }

        @Bean
        TokenCache tokenCacheBean() {
            TokenCacheTest tokenCacheTest = new TokenCacheTest();
            TokenCacheTest.TokenCache tokenCache = tokenCacheTest.new TokenCache();
            return tokenCache;
        }
    }

    @Autowired
    TokenCache tokencache;

    @Autowired
    CacheManager cachemanager;

    @Mock
    AbstractVCAPService saasRegistryVCAP2;

    @Test
    public void TestSaasTokenCache() {
        Marker m = null;
        AbstractVCAPService saasRegistryVCAP1 = null;
        assertNull(tokencache.getOAuthToken(m, saasRegistryVCAP1, "s1"));
        assertEquals("t1", tokencache.getOAuthToken(m, saasRegistryVCAP2, "s1"));
        assertEquals("t2", tokencache.getOAuthToken(m, saasRegistryVCAP1, "s2"));
        assertEquals("t2", tokencache.getOAuthToken(m, saasRegistryVCAP2, "s2"));
        assertEquals("t1", tokencache.getOAuthToken(m, saasRegistryVCAP1, "s1"));
    }
}
