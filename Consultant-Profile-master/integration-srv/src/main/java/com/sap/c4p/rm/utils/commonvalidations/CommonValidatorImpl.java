package com.sap.c4p.rm.utils.commonvalidations;


import org.jsoup.Jsoup;
import org.jsoup.nodes.Document.OutputSettings;
import org.jsoup.parser.Parser;
import org.jsoup.safety.Safelist;
import org.springframework.stereotype.Service;

/**
 * Class to implement the {@link CommonValidator} interface
 */
@Service
public class CommonValidatorImpl implements CommonValidator {

    @Override
    public boolean validateFreeTextforScripting(String value) {
        if (value != null) {
            OutputSettings settings = new OutputSettings();
            settings.prettyPrint(false);
            String cleanedValue = Jsoup.clean(value, "", Safelist.none(), settings);
            cleanedValue = Parser.unescapeEntities(cleanedValue, true);
            return cleanedValue.equals(value);
        } else
            return true;
    }
}
