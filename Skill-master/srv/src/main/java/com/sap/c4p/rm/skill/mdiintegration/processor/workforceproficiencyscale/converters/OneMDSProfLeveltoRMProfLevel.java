package com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.converters;

import com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dao.WorkForceProficiencyDAO;
import com.sap.c4p.rm.skill.mdiintegration.processor.workforceproficiencyscale.dto.WorkforceCapabilityProficiency;
import com.sap.c4p.rm.skill.mdiintegration.utils.CommonUtility;
import com.sap.c4p.rm.skill.mdiintegration.utils.IsNullCheckUtils;
import com.sap.c4p.rm.skill.mdiintegration.utils.LanguageContent;
import com.sap.cds.Row;
import com.sap.resourcemanagement.skill.ProficiencyLevels;
import com.sap.resourcemanagement.skill.ProficiencyLevelsTexts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class OneMDSProfLeveltoRMProfLevel implements Converter<WorkforceCapabilityProficiency, ProficiencyLevels> {

  private final CommonUtility commonUtility;

  private final WorkForceProficiencyDAO workForceProficiencyDAO;

  @Autowired
  public OneMDSProfLeveltoRMProfLevel(final CommonUtility commonUtility,
      final WorkForceProficiencyDAO workForceProficiencyDAO) {
    this.commonUtility = commonUtility;
    this.workForceProficiencyDAO = workForceProficiencyDAO;
  }

  @Override
  public ProficiencyLevels convert(WorkforceCapabilityProficiency proficiencyLevel) {
    ProficiencyLevels proficiencyLevels = ProficiencyLevels.create();

    proficiencyLevels.setOdmUUID(proficiencyLevel.getId());
    proficiencyLevels.setRank(proficiencyLevel.getLevel());

    Row existingProfLevel = this.workForceProficiencyDAO.getExistingProfLevel(proficiencyLevel.getId());
    if (!IsNullCheckUtils.isNullOrEmpty(existingProfLevel)) {
      proficiencyLevels.setId(existingProfLevel.get(ProficiencyLevels.ID).toString());
    }


    // Set Proficiency Level Name
    List<LanguageContent> profLevelNameContents = new ArrayList<>();
    if (!IsNullCheckUtils.isNullOrEmpty(proficiencyLevel.getName())) {
      profLevelNameContents = this.commonUtility.prepareLanguageContents(proficiencyLevel.getName());
      proficiencyLevels.setName(this.commonUtility.getContent(profLevelNameContents));
    }

    // Set proficiency level description
    List<LanguageContent> profLevelDescriptionContents = new ArrayList<>();
    if (!IsNullCheckUtils.isNullOrEmpty(proficiencyLevel.getDescription())) {
      profLevelDescriptionContents = this.commonUtility.prepareLanguageContents(proficiencyLevel.getDescription());
      proficiencyLevels.setDescription(this.commonUtility.getContent(profLevelDescriptionContents));
    }

    proficiencyLevels.setTexts(convertProficiencyLevelTexts(profLevelNameContents, profLevelDescriptionContents));
    return proficiencyLevels;
  }

  public List<ProficiencyLevelsTexts> convertProficiencyLevelTexts(List<LanguageContent> profLevelNameContents, List<LanguageContent> profLevelDescContents) {
    //merge lists
    Map<String, ProficiencyLevelsTexts> map = new HashMap<>();
    for(LanguageContent languageContent :  profLevelNameContents)
    {
      ProficiencyLevelsTexts proficiencyLevelsName = ProficiencyLevelsTexts.create();
      proficiencyLevelsName.setLocale(languageContent.getLang());
      proficiencyLevelsName.setName(languageContent.getContent());
      map.put(languageContent.getLang(), proficiencyLevelsName);
    }

    for(LanguageContent languageContent :  profLevelDescContents)
    {

      if(map.containsKey(languageContent.getLang())) {
      map.get(languageContent.getLang()).setDescription(languageContent.getContent());
    }
    else
    {
      ProficiencyLevelsTexts proficiencyLevelsDesc = ProficiencyLevelsTexts.create();
      proficiencyLevelsDesc.setLocale(languageContent.getLang());
      proficiencyLevelsDesc.setDescription(languageContent.getContent());
      map.put(languageContent.getLang(), proficiencyLevelsDesc);

      }
    }

    return new ArrayList<>(map.values());

  }
}
