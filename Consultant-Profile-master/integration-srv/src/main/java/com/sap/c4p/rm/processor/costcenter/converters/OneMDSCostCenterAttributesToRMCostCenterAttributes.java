package com.sap.c4p.rm.processor.costcenter.converters;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import com.sap.c4p.rm.processor.costcenter.dto.Attribute;
import com.sap.c4p.rm.processor.costcenter.dto.Description;
import com.sap.c4p.rm.processor.costcenter.dto.Name;
import com.sap.c4p.rm.utils.CommonUtility;
import com.sap.c4p.rm.utils.IsNullCheckUtils;
import com.sap.resourcemanagement.config.DefaultLanguages;
import com.sap.resourcemanagement.organization.CostCenterAttributes;
import com.sap.resourcemanagement.organization.CostCenterAttributesTexts;

@Component
public class OneMDSCostCenterAttributesToRMCostCenterAttributes implements Converter<Attribute, CostCenterAttributes> {

	public static final String COST_CENTER_NAME_LANGUAGE_CODE = "CostCenter.attributes.name.lang";

	public static final String COST_CENTER_DESCRIPTION_LANGUAGE_CODE = "CostCenter.attributes.description.lang";

    private final CommonUtility commonUtility;

    @Autowired
    public OneMDSCostCenterAttributesToRMCostCenterAttributes(final CommonUtility commonUtility) {
        this.commonUtility = commonUtility;
    }

    @Override
    public CostCenterAttributes convert(Attribute oneMDSAttribute) {
        CostCenterAttributes costCenterAttributes = CostCenterAttributes.create();
        costCenterAttributes.setId(UUID.randomUUID().toString());
        costCenterAttributes.setValidFrom(this.commonUtility.toLocalDate(oneMDSAttribute.getValidFrom()));
        costCenterAttributes.setValidTo(this.commonUtility.toLocalDate(oneMDSAttribute.getValidTo()));
        if (!IsNullCheckUtils.isNullOrEmpty(oneMDSAttribute.getContent())) {
            DefaultLanguages defaultLanguage = this.commonUtility.getDefaultLanguage();
            List<Name> oneMdsNameList = oneMDSAttribute.getContent().getName();
            List<Description> oneMDSDescriptionList = oneMDSAttribute.getContent().getDescription();
			List<Name> uniqueOneMdsNameList = new ArrayList<>();
			List<Description> uniqueOneMdsDescriptionList = new ArrayList<>();
			HashSet<String> uniqueoneMdsNameSet = new HashSet<>();
			HashSet<String> uniqueoneMdsDescriptionSet = new HashSet<>();

			oneMdsNameList.forEach(name -> {
				String convertedLocale = this.commonUtility.convertBCPToISO(name.getLang(),
						COST_CENTER_NAME_LANGUAGE_CODE);
				if (!uniqueoneMdsNameSet.add(convertedLocale)) {
					return;
				} else {
					name.setLang(convertedLocale);
					uniqueOneMdsNameList.add(name);
				}
			});
			oneMDSDescriptionList.forEach(description -> {
				String convertedLocale = this.commonUtility.convertBCPToISO(description.getLang(),
						COST_CENTER_DESCRIPTION_LANGUAGE_CODE);
				if (!uniqueoneMdsDescriptionSet.add(convertedLocale)) {
					return;
				} else {
					description.setLang(convertedLocale);
					uniqueOneMdsDescriptionList.add(description);
				}
			});

			Optional<Name> defaultName = uniqueOneMdsNameList.stream()
                    .filter(name -> name.getLang().equalsIgnoreCase(defaultLanguage.getLanguageCode())).findFirst();
			Optional<Description> defaultDescription = uniqueOneMdsDescriptionList.stream()
                    .filter(description -> description.getLang().equalsIgnoreCase(defaultLanguage.getLanguageCode()))
                    .findFirst();
            defaultName.ifPresent(name -> costCenterAttributes.setName(name.getContent()));
            defaultDescription.ifPresent(description -> costCenterAttributes.setDescription(description.getContent()));
			costCenterAttributes.setTexts(getListOfCostCenterAttributeTexts(uniqueOneMdsNameList,
					uniqueOneMdsDescriptionList,
                    costCenterAttributes.getId()));
        }
        return costCenterAttributes;
    }

    private List<CostCenterAttributesTexts> getListOfCostCenterAttributeTexts(List<Name> oneMdsNameList,
            List<Description> oneMDSDescriptionList, String id) {
        List<CostCenterAttributesTexts> costCenterAttributesTexts = new ArrayList<>(oneMdsNameList.size());
        for (Name oneMdsName : oneMdsNameList) {
            CostCenterAttributesTexts costCenterAttributesText = CostCenterAttributesTexts.create();
            costCenterAttributesText.setLocale(oneMdsName.getLang());
            costCenterAttributesText.setId(id);
            Optional<Description> oneMDSDescription = oneMDSDescriptionList.stream()
					.filter(description -> description.getLang().equalsIgnoreCase(oneMdsName.getLang())).findFirst();
            if (oneMDSDescription.isPresent() && !IsNullCheckUtils.isNullOrEmpty(oneMDSDescription.get().getContent()))
                costCenterAttributesText.setDescription(oneMDSDescription.get().getContent());
            costCenterAttributesText.setName(oneMdsName.getContent());
            costCenterAttributesTexts.add(costCenterAttributesText);
        }
        return costCenterAttributesTexts;
    }

}
