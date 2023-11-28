package com.sap.c4p.rm.processor.costcenter.converters;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import com.sap.c4p.rm.processor.costcenter.dto.IsValid;
import com.sap.c4p.rm.utils.CommonUtility;

import com.sap.resourcemanagement.organization.CostCenterValidity;

@Component
public class OneMDSCostCenterValidityToRMCostCenterValidity implements Converter<IsValid, CostCenterValidity> {

    private final CommonUtility commonUtility;

    @Autowired
    public OneMDSCostCenterValidityToRMCostCenterValidity(final CommonUtility commonUtility) {
        this.commonUtility = commonUtility;
    }

    @Override
    public CostCenterValidity convert(IsValid oneMDSValidity) {
        CostCenterValidity costCenterValidity = CostCenterValidity.create();
        costCenterValidity.setId(UUID.randomUUID().toString());
        costCenterValidity.setValidFrom(this.commonUtility.toLocalDate(oneMDSValidity.getValidFrom()));
        costCenterValidity.setValidTo(this.commonUtility.toLocalDate(oneMDSValidity.getValidTo()));
        costCenterValidity.setIsValid(oneMDSValidity.getContent());
        return costCenterValidity;
    }

}
