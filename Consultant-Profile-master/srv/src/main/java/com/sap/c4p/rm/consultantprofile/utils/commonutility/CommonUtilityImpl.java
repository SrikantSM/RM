package com.sap.c4p.rm.consultantprofile.utils.commonutility;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sap.cds.Result;
import com.sap.cds.Row;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.persistence.PersistenceService;

/**
 * Class to implement the {@link CommonUtility} interface
 */
@Service
public class CommonUtilityImpl implements CommonUtility {

    /**
     * instance to execute DB specific operation
     */
    private final PersistenceService persistenceService;

    /**
     * initialize {@link CommonUtility} instance and accept the instance of
     * {@link PersistenceService} to be used
     *
     * @param persistenceService will be used to perform DB specific operation
     */
    @Autowired
    public CommonUtilityImpl(final PersistenceService persistenceService) {
        this.persistenceService = persistenceService;
    }

    @Override
    public List<String> getRecordsValueFromDB(final String dbArtifact, final String dbCompareColumn,
            final List<String> keyValueList, final String dbGetValueColumn) {
        CqnSelect sql = Select.from(dbArtifact).columns(dbGetValueColumn)
                .where(b -> b.get(dbCompareColumn).in(keyValueList.toArray()));
        Result results = persistenceService.run(sql);
        List<Row> rows = results.list();
        List<String> resultValueList = new ArrayList<>();
        rows.forEach(row -> resultValueList.add(row.get(dbGetValueColumn).toString()));

        return resultValueList;
    }

    @Override
    public List<String> getRecordsValueFromDB(final String dbArtifact, final String dbCompareColumn,
            final Set<String> keyValueSet, final String dbGetValueColumn) {
        List<String> keyValueList = keyValueSet.stream().collect(Collectors.toList());
        return getRecordsValueFromDB(dbArtifact, dbCompareColumn, keyValueList, dbGetValueColumn);
    }

}
