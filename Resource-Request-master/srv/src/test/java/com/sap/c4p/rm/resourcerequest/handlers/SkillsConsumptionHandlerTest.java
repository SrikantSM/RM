package com.sap.c4p.rm.resourcerequest.handlers;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.util.Arrays;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;

import com.sap.cds.Struct;
import com.sap.cds.ql.Select;
import com.sap.cds.services.cds.CdsReadEventContext;

import manageresourcerequestservice.Catalogs2SkillsConsumption;
import manageresourcerequestservice.SkillsConsumptionVH;
import manageresourcerequestservice.SkillsConsumptionVH_;

@DisplayName("Unit test for Skills Consumption Handler")
public class SkillsConsumptionHandlerTest {

  /*
   * Class under test
   *
   */
  private static SkillsConsumptionHandler cut;

  @BeforeEach
  public void setUp() {
    cut = new SkillsConsumptionHandler();
  }

  @Nested
  @DisplayName("Before read of skills consumption value help")
  class SkillsConsumptionValueHelpBeforeRead {
    @Test
    @DisplayName("Test if beforeRead ensure catalog expansion for skill consumption value help when catalog present")
    void testBeforeRead() {
      CdsReadEventContext mockReadEventContext = CdsReadEventContext.create(SkillsConsumptionVH_.CDS_NAME);
      mockReadEventContext.setCqn(Select.from(SkillsConsumptionVH_.CDS_NAME));
      SkillsConsumptionHandler classUnderTestSpy = Mockito.spy(cut);
      Mockito.doReturn(Boolean.TRUE).when(classUnderTestSpy).shouldComputeCommaSeparated(ArgumentMatchers.any());
      classUnderTestSpy.beforeRead(mockReadEventContext);

      verify(classUnderTestSpy, times(1)).shouldComputeCommaSeparated(ArgumentMatchers.any());
      verify(classUnderTestSpy, times(1)).ensureCatalogExpansion(ArgumentMatchers.any());
    }

    @Test
    @DisplayName("Test if beforeRead ensure catalog expansion for skill consumption value help when no catalog present")
    void testBeforeReadNoCatalog() {
      CdsReadEventContext mockReadEventContext = CdsReadEventContext.create(SkillsConsumptionVH_.CDS_NAME);
      mockReadEventContext.setCqn(Select.from(SkillsConsumptionVH_.CDS_NAME));
      SkillsConsumptionHandler classUnderTestSpy = Mockito.spy(cut);
      classUnderTestSpy.beforeRead(mockReadEventContext);

      verify(classUnderTestSpy, times(1)).shouldComputeCommaSeparated(ArgumentMatchers.any());
      verify(classUnderTestSpy, times(0)).ensureCatalogExpansion(ArgumentMatchers.any());
    }

  }

  @Nested
  @DisplayName("After read of skill consumption value help")
  class SkillsConsumptionValueHelpAfterRead {

    @Test
    @DisplayName("Test if afterRead combined catalogs in commaSeparatedCatalog when no catalog assigned")
    void testAfterReadNoCatalog() {
      CdsReadEventContext mockReadEventContext = CdsReadEventContext.create(SkillsConsumptionVH_.CDS_NAME);
      mockReadEventContext.setCqn(Select.from(SkillsConsumptionVH_.CDS_NAME));
      SkillsConsumptionHandler classUnderTestSpy = Mockito.spy(cut);

      SkillsConsumptionVH skill = Struct.create(SkillsConsumptionVH.class);
      skill.setId("b08aabdf-6dcb-4df7-b319-b440f073e6dc");
      skill.setDescription("desc");
      skill.setName("name");

      Mockito.doReturn(Boolean.FALSE).when(classUnderTestSpy).shouldComputeCommaSeparated(ArgumentMatchers.any());
      Mockito.doNothing().when(classUnderTestSpy).removeInvalidAssociation(ArgumentMatchers.any());
      classUnderTestSpy.afterRead(mockReadEventContext, Arrays.asList(skill));

      verify(classUnderTestSpy, times(1)).shouldComputeCommaSeparated(ArgumentMatchers.any());
      verify(classUnderTestSpy, times(0)).computeCommaSeparated(ArgumentMatchers.any());
      verify(classUnderTestSpy, times(0)).removeInvalidAssociation(ArgumentMatchers.any());

    }

    @Test
    @DisplayName("Test if afterRead combined catalogs in commaSeparatedCatalog when no catalog assigned")
    void testAfterReadNoCatalogAssociation() {
      CdsReadEventContext mockReadEventContext = CdsReadEventContext.create(SkillsConsumptionVH_.CDS_NAME);
      mockReadEventContext.setCqn(Select.from(SkillsConsumptionVH_.CDS_NAME));
      SkillsConsumptionHandler classUnderTestSpy = Mockito.spy(cut);

      SkillsConsumptionVH skill = Struct.create(SkillsConsumptionVH.class);
      skill.setId("b08aabdf-6dcb-4df7-b319-b440f073e6dc");
      skill.setDescription("desc");
      skill.setName("name");
      skill.setCatalogAssociations(null);

      Mockito.doReturn(Boolean.TRUE).when(classUnderTestSpy).shouldComputeCommaSeparated(ArgumentMatchers.any());
      Mockito.doNothing().when(classUnderTestSpy).removeInvalidAssociation(ArgumentMatchers.any());
      classUnderTestSpy.afterRead(mockReadEventContext, Arrays.asList(skill));

      verify(classUnderTestSpy, times(1)).shouldComputeCommaSeparated(ArgumentMatchers.any());
      verify(classUnderTestSpy, times(1)).computeCommaSeparated(ArgumentMatchers.any());
      verify(classUnderTestSpy, times(1)).removeInvalidAssociation(ArgumentMatchers.any());

    }

    @Test
    @DisplayName("Test if afterRead try to build catalogs for SkillsConsumptionVH when invalid association")
    void testAfterReadInvalidAssociation() {
      CdsReadEventContext mockReadEventContext = CdsReadEventContext.create(SkillsConsumptionVH_.CDS_NAME);
      mockReadEventContext.setCqn(Select.from(SkillsConsumptionVH_.CDS_NAME));
      SkillsConsumptionHandler classUnderTestSpy = Mockito.spy(cut);

      Catalogs2SkillsConsumption catalogAssociations = Struct.create(Catalogs2SkillsConsumption.class);
      catalogAssociations.setId(null);
      catalogAssociations.setCatalogId("b08aabdf-6dcb-4df7-b319-b440f073e6dc");
      catalogAssociations.setSkillId("b08aabdf-6dcb-4df7-b319-b440f073e6dc");

      SkillsConsumptionVH skill = Struct.create(SkillsConsumptionVH.class);
      skill.setId("b08aabdf-6dcb-4df7-b319-b440f073e6dc");
      skill.setDescription("desc");
      skill.setName("name");
      skill.setCatalogAssociations(Arrays.asList(catalogAssociations));

      Mockito.doReturn(Boolean.TRUE).when(classUnderTestSpy).shouldComputeCommaSeparated(ArgumentMatchers.any());
      classUnderTestSpy.afterRead(mockReadEventContext, Arrays.asList(skill));

      verify(classUnderTestSpy, times(1)).shouldComputeCommaSeparated(ArgumentMatchers.any());
      verify(classUnderTestSpy, times(1)).computeCommaSeparated(ArgumentMatchers.any());
      verify(classUnderTestSpy, times(1)).removeInvalidAssociation(ArgumentMatchers.any());

    }

    @Test
    @DisplayName("Test if afterRead build catalogs for SkillsConsumptionVH when valid association")
    void testAfterRead() {
      CdsReadEventContext mockReadEventContext = CdsReadEventContext.create(SkillsConsumptionVH_.CDS_NAME);
      mockReadEventContext.setCqn(Select.from(SkillsConsumptionVH_.CDS_NAME));
      SkillsConsumptionHandler classUnderTestSpy = Mockito.spy(cut);

      Catalogs2SkillsConsumption catalogAssociations = Struct.create(Catalogs2SkillsConsumption.class);
      catalogAssociations.setId("b08aabdf-6dcb-4df7-b319-b440f073e6dc");
      catalogAssociations.setCatalogId("b08aabdf-6dcb-4df7-b319-b440f073e6dc");
      catalogAssociations.setSkillId("b08aabdf-6dcb-4df7-b319-b440f073e6dc");

      SkillsConsumptionVH skill = Struct.create(SkillsConsumptionVH.class);
      skill.setId("b08aabdf-6dcb-4df7-b319-b440f073e6dc");
      skill.setDescription("desc");
      skill.setName("name");
      skill.setCatalogAssociations(Arrays.asList(catalogAssociations));

      Mockito.doReturn(Boolean.TRUE).when(classUnderTestSpy).shouldComputeCommaSeparated(ArgumentMatchers.any());
      classUnderTestSpy.afterRead(mockReadEventContext, Arrays.asList(skill));

      verify(classUnderTestSpy, times(1)).shouldComputeCommaSeparated(ArgumentMatchers.any());
      verify(classUnderTestSpy, times(1)).computeCommaSeparated(ArgumentMatchers.any());
      verify(classUnderTestSpy, times(1)).removeInvalidAssociation(ArgumentMatchers.any());

    }
  }

}
