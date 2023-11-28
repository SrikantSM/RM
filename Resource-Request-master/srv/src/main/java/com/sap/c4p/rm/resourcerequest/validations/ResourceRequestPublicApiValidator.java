package com.sap.c4p.rm.resourcerequest.validations;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.services.messages.Messages;

import com.sap.c4p.rm.resourcerequest.gen.MessageKeys;
import com.sap.c4p.rm.resourcerequest.utils.ValuePath;

import resourcerequestservice.ResourceRequests;
import resourcerequestservice.ResourceRequests_;

@Component
public class ResourceRequestPublicApiValidator extends InjectionValidator<ResourceRequests, ResourceRequests_> {

  @Autowired
  protected ResourceRequestPublicApiValidator(Messages messages) {
    super(messages, ResourceRequests_.class);
  }

  @Override
  public List<ValuePath<String, ResourceRequests_>> extractValuesForHtmlInjection(
      final ResourceRequests resourceRequest) {
    return extractValuesForInjection(resourceRequest);
  }

  @Override
  public List<ValuePath<String, ResourceRequests_>> extractValuesForCsvInjection(
      final ResourceRequests resourceRequest) {
    return extractValuesForInjection(resourceRequest);
  }

  public List<ValuePath<String, ResourceRequests_>> extractValuesForInjection(final ResourceRequests resourceRequest) {

    final Stream<ValuePath<String, ResourceRequests_>> nameField = Stream
        .of(new ValuePath<>(resourceRequest.getName(), ResourceRequests_::name));

    final Stream<ValuePath<String, ResourceRequests_>> descrField = Stream
        .of(new ValuePath<>(resourceRequest.getDescription(), ResourceRequests_::description));

    return Stream.concat(nameField, descrField).collect(Collectors.toList());
  }

  @Override
  public String getMessageKeyForHtmlInjection() {
    return MessageKeys.RRSRV_CONTAINS_HTML_TAG;
  }

  @Override
  public String getMessageKeyForCsvInjection() {
    return MessageKeys.FORBIDDEN_FIRST_CHARACTER_RRSRV;
  }

}
