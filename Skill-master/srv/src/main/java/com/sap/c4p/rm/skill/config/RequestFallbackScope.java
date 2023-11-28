package com.sap.c4p.rm.skill.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.ObjectFactory;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.web.context.request.RequestScope;

public class RequestFallbackScope extends RequestScope {
  private static final Logger LOGGER = LoggerFactory.getLogger(RequestFallbackScope.class);
  private static final Marker MARKER = LoggingMarker.REQUEST_FALLBACK_SCOPE.getMarker();

  @Override
  @NonNull
  public Object get(@NonNull String name, @NonNull ObjectFactory<?> objectFactory) {
    try {
      return super.get(name, objectFactory);
    } catch (IllegalStateException e) {
      // thrown by RequestContextHolder.currentRequestAttributes() w/o request
      // return a new instance in this case
      LOGGER.info(MARKER, "No request context found, falling back to prototype scoping", e);
      return objectFactory.getObject();
    }
  }

  @Override
  @Nullable
  public Object remove(@NonNull String name) {
    try {
      return super.remove(name);
    } catch (IllegalStateException e) {
      // thrown by RequestContextHolder.currentRequestAttributes() w/o request
      // do nothing in this case
      return null;
    }
  }
}
