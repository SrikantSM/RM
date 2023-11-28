package com.sap.c4p.rm.skill.config;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.aMapWithSize;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.not;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.UUID;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;

import com.sap.cds.ql.Insert;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.Upsert;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.environment.CdsProperties.DataSource;
import com.sap.cds.services.runtime.CdsRuntime;

import com.sap.c4p.rm.skill.services.validators.CompletenessValidator;
import com.sap.c4p.rm.skill.testconfig.SpringBootTestWithoutSharedSqliteCache;

import proficiencyservice.ProficiencyLevelsTexts_;
import proficiencyservice.ProficiencyLevels_;
import proficiencyservice.ProficiencyService_;
import proficiencyservice.ProficiencySets_;
import proficiencyservice.Skills_;

@SpringBootTestWithoutSharedSqliteCache
class DynamicCompletenessValidatorRegistrationConfigTest {

  @MockBean
  CompletenessValidator completenessValidator;

  @Autowired
  List<DraftService> draftServices;

  @Autowired
  CdsRuntime cdsRuntime;

  @Autowired
  DynamicCompletenessValidatorRegistrationConfig cut;

  @MockBean
  DataSource dataSource;

  @Test
  @DisplayName("check that at least three draft services (skill, catalog, proficiency) are found")
  void testThatDraftServicesAreFound() {
    assertNotNull(draftServices);
    assertThat(draftServices, hasSize(greaterThanOrEqualTo(3)));
  }

  @Test
  @DisplayName("check that at least the currently existing entities are found for the proficiency service")
  void testThatExistingEntitiesAreFoundInProficiencyService() {
    Map<String, List<String>> servicesWithEntities = cut.findEntitiesForCompletenessCheck();
    assertThat(servicesWithEntities, is(aMapWithSize(greaterThanOrEqualTo(3))));

    List<String> entitiesToBeCheckedProfService = servicesWithEntities.get(ProficiencyService_.CDS_NAME);

    assertThat(entitiesToBeCheckedProfService, hasSize(greaterThanOrEqualTo(3)));
    assertThat("should contain editable entities", entitiesToBeCheckedProfService,
        hasItems(ProficiencySets_.CDS_NAME, ProficiencyLevels_.CDS_NAME, ProficiencyLevelsTexts_.CDS_NAME));
    assertThat("should not contain readonly entities", entitiesToBeCheckedProfService, not(hasItems(Skills_.CDS_NAME)));
  }

  @Test
  @DisplayName("check that completenessValidator is registered successfully for update and before other validations ")
  void testThatCompletenessValidatorIsCalledOnPatchProficiencySet() {
    DraftService profService = draftServices.stream().filter(ds -> ds.getName() == ProficiencyService_.CDS_NAME)
        .findFirst().orElseThrow(() -> new NoSuchElementException());
    cdsRuntime.requestContext().privilegedUser().run(privilegedContext -> {
      try {
        profService.run(Update.entity(ProficiencySets_.class).data("ID", UUID.randomUUID().toString()));
      } catch (Exception e) {
        // other validations will fail, but this is not the point of this test
      }
    });
    verify(completenessValidator, times(1)).validateCompleteness(eq(ProficiencySets_.CDS_NAME), any());
  }

  @Test
  @DisplayName("check that completenessValidator is registered successfully for create and before other validations ")
  void testThatCompletenessValidatorIsCalledOnCreateProficiencySet() {
    DraftService profService = draftServices.stream().filter(ds -> ds.getName() == ProficiencyService_.CDS_NAME)
        .findFirst().orElseThrow(() -> new NoSuchElementException());
    cdsRuntime.requestContext().privilegedUser().run(privilegedContext -> {
      try {
        profService.run(Insert.into(ProficiencySets_.class).entry("ID", UUID.randomUUID().toString()));
      } catch (Exception e) {
        // other validations will fail, but this is not the point of this test
      }
    });
    verify(completenessValidator, times(1)).validateCompleteness(eq(ProficiencySets_.CDS_NAME), any());
  }

  @Test
  @DisplayName("check that completenessValidator is registered successfully for upsert and before other validations ")
  void testThatCompletenessValidatorIsCalledOnUpsertProficiencySet() {
    DraftService profService = draftServices.stream().filter(ds -> ds.getName() == ProficiencyService_.CDS_NAME)
        .findFirst().orElseThrow(() -> new NoSuchElementException());
    cdsRuntime.requestContext().privilegedUser().run(privilegedContext -> {
      try {
        profService.run(Upsert.into(ProficiencySets_.class).entry("ID", UUID.randomUUID().toString()));
      } catch (Exception e) {
        // other validations will fail, but this is not the point of this test
      }
    });
    verify(completenessValidator, times(1)).validateCompleteness(eq(ProficiencySets_.CDS_NAME), any());
  }

}
