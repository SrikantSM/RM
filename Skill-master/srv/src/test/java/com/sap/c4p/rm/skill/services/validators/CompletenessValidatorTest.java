package com.sap.c4p.rm.skill.services.validators;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.Map;
import java.util.Optional;
import java.util.function.Consumer;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.sap.cds.reflect.CdsAnnotation;
import com.sap.cds.reflect.CdsAssociationType;
import com.sap.cds.reflect.CdsElement;
import com.sap.cds.reflect.CdsEntity;
import com.sap.cds.reflect.CdsModel;
import com.sap.cds.services.ServiceException;

import skillservice.Skills;

class CompletenessValidatorTest {

  private CompletenessValidator cut;
  private CdsEntity entity;

  @BeforeEach
  void setUp() throws Exception {
    CdsModel model = mock(CdsModel.class);
    entity = mock(CdsEntity.class);

    when(model.getEntity(anyString())).thenReturn(entity);
    cut = new CompletenessValidator(model);
  }

  @Test
  void testValidateCompletenessAssociationsFilteredOut() {
    Stream<CdsElement> mockCdsElements = Stream.of(associationElement("assoc1"));
    when(entity.elements()).thenReturn(mockCdsElements);
    assertDoesNotThrow(() -> cut.validateCompleteness("someEntity", createMapWithKeys()));
  }

  @Test
  @DisplayName("check entity with mixed elements passes completness check if all properties are present")
  void testValidateCompletenessWithMixedElements() {
    Stream<CdsElement> mockCdsElements = Stream.of(associationElement("assoc1"), hasDraftEntityEl(), keyElement(),
        simpleElement("someEl"), simpleElement("someOtherEl"), compositionElement("compEl"));
    when(entity.elements()).thenReturn(mockCdsElements);
    assertDoesNotThrow(
        () -> cut.validateCompleteness("someEntity", createMapWithKeys("someEl", "someOtherEl", "compEl")));
  }

  @Test
  @DisplayName("check entity fails completeness check if composition properties are missing")
  void testValidateCompletenessMissesComposition() {
    Stream<CdsElement> mockCdsElements = Stream.of(compositionElement("compEl"), simpleElement("anotherEl"));
    when(entity.elements()).thenReturn(mockCdsElements);
    assertThrows(ServiceException.class, () -> cut.validateCompleteness("someEntity", createMapWithKeys("anotherEl")));
  }

  @Test
  @DisplayName("check computed properties are ignored on completeness check")
  void testValidateCompletenessWithComputedProperties() {
    Stream<CdsElement> mockCdsElements = Stream.of(computedElement("compEl"), computedElement("compEl2"),
        simpleElement("anotherEl"));
    when(entity.elements()).thenReturn(mockCdsElements);
    assertDoesNotThrow(() -> cut.validateCompleteness("someEntity", createMapWithKeys("anotherEl")));
  }

  @Test
  @DisplayName("check entity fails completeness check if no properties are given")
  void testValidateCompletenessWithoutProperties() {
    Stream<CdsElement> mockCdsElements = Stream.of(compositionElement("compEl"), simpleElement("anotherEl"));
    when(entity.elements()).thenReturn(mockCdsElements);
    assertThrows(ServiceException.class, () -> cut.validateCompleteness("someEntity", createMapWithKeys()));
  }

  private CdsElement computedElement(String name) {
    return simpleElement(name, el -> {
      CdsAnnotation<?> computedAnnotation = mock(CdsAnnotation.class);
      Mockito.doReturn(true).when(computedAnnotation).getValue();
      Mockito.doReturn(Optional.of(computedAnnotation)).when(el).findAnnotation(eq("Core.Computed"));
    });
  }

  private CdsElement compositionElement(String name) {
    CdsElement compElement = associationElement(name);
    when(((CdsAssociationType) compElement.getType()).isComposition()).thenReturn(true);
    return compElement;
  }

  private CdsElement associationElement(String name) {
    return simpleElement(name, el -> {
      CdsAssociationType assocType = mock(CdsAssociationType.class);
      when(assocType.isComposition()).thenReturn(false);
      when(assocType.isAssociation()).thenReturn(true);
      when(assocType.isSimple()).thenReturn(false);
      when(el.getType()).thenReturn(assocType);
    });
  }

  private CdsElement hasDraftEntityEl() {
    return simpleElement(Skills.HAS_DRAFT_ENTITY);
  }

  private CdsElement keyElement() {
    return simpleElement("key", el -> {
      when(el.isKey()).thenReturn(true);
    });
  }

  private CdsElement simpleElement(String name) {
    return simpleElement(name, elName -> {
    });
  }

  private CdsElement simpleElement(String name, Consumer<CdsElement> consumer) {
    CdsElement el = mock(CdsElement.class, Mockito.RETURNS_DEEP_STUBS);
    when(el.getName()).thenReturn(name);
    when(el.isKey()).thenReturn(false);
    when(el.getType().isSimple()).thenReturn(true);
    consumer.accept(el);
    return el;
  }

  private Map<String, Object> createMapWithKeys(String... fieldNames) {
    return Arrays.stream(fieldNames).collect(Collectors.toMap(s -> s, s -> s + "_value"));
  }
}
