package com.sap.c4p.rm.resourcerequest.utils;

import java.util.function.Function;

import com.sap.cds.ql.StructuredType;

/**
 * Class representing a tuple of a value of type V (within CdsData) and its path
 * in cds from a given RootEntity R
 *
 * @param <V> Type of the value, e.g. String
 * @param <R> RootEntity, given as StructuredType (e.g. ResourceRequests_)
 */
public class ValuePath<V, R extends StructuredType<R>> {
  private final V value;
  private final Function<R, Object> path;

  public ValuePath(V value, Function<R, Object> path) {
    this.value = value;
    this.path = path;
  }

  public V getValue() {
    return this.value;
  }

  public Function<R, Object> getPath() {
    return this.path;
  }
}
