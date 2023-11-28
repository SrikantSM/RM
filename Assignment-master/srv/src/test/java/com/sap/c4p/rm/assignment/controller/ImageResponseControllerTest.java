package com.sap.c4p.rm.assignment.controller;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.io.InputStream;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Consumer;

import jakarta.servlet.http.HttpServletResponse;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;

import com.sap.cds.Result;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.changeset.ChangeSetContext;
import com.sap.cds.services.persistence.PersistenceService;
import com.sap.cds.services.runtime.CdsRuntime;
import com.sap.cds.services.runtime.ChangeSetContextRunner;

import com.sap.resourcemanagement.employee.ProfilePhoto;

public class ImageResponseControllerTest {

  @Autowired
  @InjectMocks
  ImageResponseController imageResponseController;

  @Mock
  private ChangeSetContext mockChangeSetContext;

  @Mock
  HttpServletResponse mockHttpServletResponse;

  @Mock
  private InputStream mockInputStream;

  @Mock
  Result result;

  @Mock
  ProfilePhoto mockProfilePhoto;

  @Mock
  private ChangeSetContextRunner mockChangeSetContextRunner;

  private PersistenceService mockPersistenceService;
  private CdsRuntime cdsRuntime;

  private String id1;
  private ZonedDateTime current;
  private ArgumentCaptor<CqnSelect> argumentCqnSelect;

  @BeforeEach
  public void setUp() {
    this.cdsRuntime = mock(CdsRuntime.class, RETURNS_DEEP_STUBS);
    this.mockPersistenceService = mock(PersistenceService.class);
    this.imageResponseController = new ImageResponseController(mockPersistenceService, cdsRuntime);

    id1 = UUID.randomUUID().toString();

    ZoneId zoneId = ZoneId.of("America/New_York");
    current = ZonedDateTime.now(zoneId);

    mockProfilePhoto = mock(ProfilePhoto.class);
    result = mock(Result.class);
    mockHttpServletResponse = mock(HttpServletResponse.class);

    argumentCqnSelect = ArgumentCaptor.forClass(CqnSelect.class);

    ChangeSetContextRunner mockChangeSetContextRunner = mock(ChangeSetContextRunner.class);
    when(this.cdsRuntime.changeSetContext()).thenReturn(mockChangeSetContextRunner);
    doAnswer((invocation) -> {
      Consumer<ChangeSetContext> c = invocation.getArgument(0);
      c.accept(null);
      return null;
    }).when(mockChangeSetContextRunner).run(any(Consumer.class));
  }

  @Test
  @DisplayName("Reading of the profilePhoto when the record is present in DB")
  public void successScenario() throws IOException {

    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("uuuu-MM-dd HH:mm:ss.SSS", Locale.ENGLISH)
        .withZone(ZoneId.systemDefault());
    Instant valueInInstant = Instant.from(formatter.parse("2021-09-29 09:35:07.531"));
    String formattedModifiedAtValue = DateTimeFormatter.RFC_1123_DATE_TIME.withZone(ZoneOffset.UTC)
        .format(valueInInstant);

    when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn((Result) result);
    when(result.first(ProfilePhoto.class)).thenReturn(Optional.of(mockProfilePhoto));
    when(mockProfilePhoto.getProfileThumbnail()).thenReturn(mockInputStream);
    when(mockProfilePhoto.getModifiedAt()).thenReturn(valueInInstant);
    this.imageResponseController.execute(id1, mockHttpServletResponse);

    verify(mockPersistenceService, times(1)).run(argumentCqnSelect.capture());
    verify(mockHttpServletResponse, times(1)).setHeader(HttpHeaders.CACHE_CONTROL, "public; max-age=86400");
    verify(mockHttpServletResponse, times(1)).setHeader(HttpHeaders.CONTENT_TYPE, "image/png");
    verify(mockHttpServletResponse, times(1)).setHeader(HttpHeaders.LAST_MODIFIED, formattedModifiedAtValue);
  }

  @Test
  @DisplayName("Setting current timeStamp when modifiedAt is not set in DB")
  public void failureScenario() throws IOException {

    Instant instant = Instant.now();
    String formattedInstantValue = DateTimeFormatter.RFC_1123_DATE_TIME.withZone(ZoneOffset.UTC).format(instant);

    when(mockPersistenceService.run(any(CqnSelect.class))).thenReturn((Result) result);
    when(result.first(ProfilePhoto.class)).thenReturn(Optional.of(mockProfilePhoto));
    when(mockProfilePhoto.getProfileThumbnail()).thenReturn(null);
    when(mockProfilePhoto.getModifiedAt()).thenReturn(null);
    this.imageResponseController.execute(id1, mockHttpServletResponse);

    verify(mockPersistenceService, times(1)).run(argumentCqnSelect.capture());
    verify(mockHttpServletResponse, times(1)).setHeader(HttpHeaders.CACHE_CONTROL, "public; max-age=86400");
    verify(mockHttpServletResponse, times(1)).setHeader(HttpHeaders.CONTENT_TYPE, "image/png");

    /*
     * With the help of argument captors check that the actual value set in the
     * servlet response is at least as recent as the formattedInstantValue. Doing
     * "equals" check will fail if one or more seconds elapse between execution of
     * line 128 and the actual setting of last_modified inside the method in line
     * 134. This would lead to random looking failures of assignment-srv builds
     */
    ArgumentCaptor<String> formattedInstantvalueCaptor = ArgumentCaptor.forClass(String.class);
    verify(mockHttpServletResponse, times(1)).setHeader(argThat(s -> s.equals(HttpHeaders.LAST_MODIFIED)),
        formattedInstantvalueCaptor.capture());
    assertTrue(formattedInstantvalueCaptor.getValue().compareTo(formattedInstantValue) != -1);

  }
}