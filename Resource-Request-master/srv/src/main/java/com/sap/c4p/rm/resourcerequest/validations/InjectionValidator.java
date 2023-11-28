package com.sap.c4p.rm.resourcerequest.validations;

import java.util.Collections;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;

import com.sap.cds.CdsData;
import com.sap.cds.ql.StructuredType;
import com.sap.cds.services.messages.Messages;

import com.sap.c4p.rm.resourcerequest.utils.ValuePath;

public abstract class InjectionValidator<T extends CdsData, E extends StructuredType<E>> {
  private static final String[] FORBIDDEN_FIRST_CHARACTERS = new String[] { "+", "-", "=", "@" };
  private final Class<E> queryClass;
  private final Messages messages;

  protected InjectionValidator(final Messages messages, final Class<E> queryClass) {
    this.messages = messages;
    this.queryClass = queryClass;
  }

  public final void validateForInjection(final T entity) {
    this.validateHtml(entity);
    this.validateForbiddenFirstCharacters(entity);
  }

  void validateHtml(final T entity) {
    this.extractValuesForHtmlInjection(entity).forEach(valuePath -> {
      if (valuePath.getValue() != null && !Jsoup.isValid(valuePath.getValue(), Safelist.none())) {
        this.messages.error(this.getMessageKeyForHtmlInjection()).target("in", this.queryClass, valuePath.getPath());
      }
    });
  }

  void validateForbiddenFirstCharacters(final T entity) {
    this.extractValuesForCsvInjection(entity).forEach(valuePath -> {
      if (valuePath.getValue() != null && StringUtils.startsWithAny(valuePath.getValue(), FORBIDDEN_FIRST_CHARACTERS)) {
        this.messages.error(this.getMessageKeyForCsvInjection()).target("in", this.queryClass, valuePath.getPath());
      }
    });
  }

  /**
   * Override this method to define a list of fields that are checked for html
   * injection in the respective entity
   *
   * @param entity The fields that are checked for html injection are extracted
   *               from that entity in overriding classes
   * @return Map of field values to a CDS path function starting at the
   *         validator's entity
   */
  List<ValuePath<String, E>> extractValuesForHtmlInjection(final T entity) {
    return Collections.emptyList();
  }

  /**
   * Override this method to define a list of fields that are checked for csv
   * injection in the respective entity
   *
   * @param entity The fields that are checked for csv injection are extracted
   *               from that entity in overriding classes
   * @return Map of field values to a CDS path function starting at the
   *         validator's entity
   */
  List<ValuePath<String, E>> extractValuesForCsvInjection(final T entity) {
    return Collections.emptyList();
  }

  /**
   * Override this method in order to define the message that is shown if the html
   * injection fails
   *
   * @return Message key for message that occurs in case an invalid html tag was
   *         detected
   */
  String getMessageKeyForHtmlInjection() {
    throw new UnsupportedOperationException();
  }

  /**
   * Override this method in order to define the message that is shown if the csv
   * injection fails
   *
   * @return Message key for message that occurs in case an invalid forbidden
   *         first character was detected
   */
  String getMessageKeyForCsvInjection() {
    throw new UnsupportedOperationException();
  }
}
