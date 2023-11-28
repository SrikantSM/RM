package com.sap.c4p.rm.consultantprofile.utils.commonvalidations;

import java.util.Optional;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document.OutputSettings;
import org.jsoup.parser.Parser;
import org.jsoup.safety.Safelist;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sap.cds.Result;
import com.sap.cds.Row;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.persistence.PersistenceService;

/**
 * Class to implement the {@link CommonValidator} interface
 */
@Service
public class CommonValidatorImpl implements CommonValidator {

    /**
     * instance to execute DB specific operation
     */
    private final PersistenceService persistenceService;

    /**
     * initialize {@link CommonValidatorImpl} instance and accept the instance of
     * {@link PersistenceService} to be used
     *
     * @param persistenceService will be used to perform DB specific operation
     */
    @Autowired
    public CommonValidatorImpl(final PersistenceService persistenceService) {
        this.persistenceService = persistenceService;
    }

    @Override
    public boolean checkInputValueExistingDB(String dbArtifact, String dbField, String value) {
        CqnSelect query = Select.from(dbArtifact).where(b -> b.get(dbField).eq(value));
        Result result = this.persistenceService.run(query);
        Optional<Row> row = result.first();
        return row.isPresent();
    }

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

    @Override
    public boolean isBlank(String value) {
        return (value == null || value.trim().isEmpty());
    }

    @Override
    public boolean checkInputGuidFieldLength(String str) {
        final int guidLength = 36;
        return (str.length() > guidLength);
    }
}
