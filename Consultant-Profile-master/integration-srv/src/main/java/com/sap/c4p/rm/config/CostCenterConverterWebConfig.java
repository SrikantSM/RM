package com.sap.c4p.rm.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.sap.c4p.rm.processor.costcenter.converters.OneMDSCostCenterAttributesToRMCostCenterAttributes;
import com.sap.c4p.rm.processor.costcenter.converters.OneMDSCostCenterValidityToRMCostCenterValidity;

/**
 * A Configuration class to inform registry about the spring converters
 */
@Configuration
public class CostCenterConverterWebConfig implements WebMvcConfigurer {

    private final OneMDSCostCenterAttributesToRMCostCenterAttributes oneMDSCostCenterAttributesToRMCostCenterAttributes;
    private final OneMDSCostCenterValidityToRMCostCenterValidity oneMDSCostCenterValidityToRMCostCenterValidity;

    @Autowired
    public CostCenterConverterWebConfig(
            final OneMDSCostCenterAttributesToRMCostCenterAttributes oneMDSCostCenterAttributesToRMCostCenterAttributes,
            final OneMDSCostCenterValidityToRMCostCenterValidity oneMDSCostCenterValidityToRMCostCenterValidity) {
        this.oneMDSCostCenterAttributesToRMCostCenterAttributes = oneMDSCostCenterAttributesToRMCostCenterAttributes;
        this.oneMDSCostCenterValidityToRMCostCenterValidity = oneMDSCostCenterValidityToRMCostCenterValidity;
    }

    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(this.oneMDSCostCenterAttributesToRMCostCenterAttributes);
        registry.addConverter(this.oneMDSCostCenterValidityToRMCostCenterValidity);
    }

}
