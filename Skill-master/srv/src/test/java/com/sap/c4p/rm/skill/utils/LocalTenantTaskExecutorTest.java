package com.sap.c4p.rm.skill.utils;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.util.function.Consumer;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class LocalTenantTaskExecutorTest {

  private LocalTenantTaskExecutor cut;
  private Runnable mockRunnable;
  private Consumer<String> mockConsumer;

  @BeforeEach
  public void setUp() {
    this.mockRunnable = mock(Runnable.class);
    this.mockConsumer = mock(Consumer.class);
    this.cut = new LocalTenantTaskExecutor();
  }

  @Test
  @DisplayName("verify that execute() invokes all expected methods")
  public void execute() {
    this.cut.execute(this.mockRunnable);
    verify(this.mockRunnable, times(1)).run();
  }

  @Test
  @DisplayName("verify that execute() invokes all expected methods")
  public void executeConsumer() {
    this.cut.execute(this.mockConsumer);
    verify(this.mockConsumer, times(1)).accept("LOCAL");
  }
}
