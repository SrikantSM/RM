package com.sap.c4p.rm.projectintegrationadapter.util;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

import com.sap.c4p.rm.projectintegrationadapter.util.ReplicationMessage.Severity;

@Component
@RequestScope
public class ReplicationMessagesImpl implements ReplicationMessages {

  private List<ReplicationMessage> messages = new ArrayList<>();

  @Override
  public ReplicationMessage info(String message) {

    ReplicationMessage replicationMessage = new ReplicationMessageImpl(Severity.INFO, message);
    messages.add(replicationMessage);
    return replicationMessage;
  }

  @Override
  public ReplicationMessage success(String message) {

    ReplicationMessage replicationMessage = new ReplicationMessageImpl(Severity.SUCCESS, message);
    messages.add(replicationMessage);
    return replicationMessage;
  }

  @Override
  public ReplicationMessage warn(String message) {

    ReplicationMessage replicationMessage = new ReplicationMessageImpl(Severity.WARNING, message);
    messages.add(replicationMessage);
    return replicationMessage;
  }

  @Override
  public ReplicationMessage error(String message) {

    ReplicationMessage replicationMessage = new ReplicationMessageImpl(Severity.ERROR, message);
    messages.add(replicationMessage);
    return replicationMessage;
  }

  @Override
  public Stream<ReplicationMessage> stream() {
    return messages.stream();
  }

  @Override
  public List<ReplicationMessage> getMessages() {
    return messages;
  }

  @Override
  public List<ReplicationMessage> getErrorMessages() {
    return messages.stream().filter(message -> message.getSeverity().equals(Severity.ERROR))
        .collect(Collectors.toList());

  }
}
