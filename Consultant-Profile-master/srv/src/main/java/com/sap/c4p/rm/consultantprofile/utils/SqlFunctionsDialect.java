package com.sap.c4p.rm.consultantprofile.utils;

import java.sql.Connection;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.sqlite.Function;
import org.sqlite.SQLiteConnection;

@Component
@Profile("!hana")
public class SqlFunctionsDialect implements ApplicationListener<ApplicationReadyEvent> {

    private static final Logger LOGGER = LoggerFactory.getLogger(SqlFunctionsDialect.class);

    private static final String DATE_FORMAT = "uuuuMMdd";

    private final DataSource dataSource;

    @Autowired
    public SqlFunctionsDialect(final DataSource dataSource) {
        this.dataSource = dataSource;
    }

    private void formatDateForSql(SQLiteConnection conn, String functionName) {
        try {

            Function.create(conn, functionName, new Function() {
                protected void xFunc() throws SQLException {
                    if (args() != 2) {
                        throw new SQLException(
                                StringFormatter.format("{0}(arg1,arg2): Invalid argument count. Requires 2, but found ",
                                        functionName) + args());
                    }
                    String value = value_text(0);
                    String format = value_text(1);
                    String valueToReturn;
                    if ("YYYYMMDD".equals(format))
                        valueToReturn = LocalDate.parse(value).format(DateTimeFormatter.ofPattern(DATE_FORMAT));
                    else
                        valueToReturn = "20001231";
                    LOGGER.debug("{} invoked with values: {} {} and returns value {}", functionName, value, format,
                            valueToReturn);
                    result(valueToReturn);

                }
            });

        } catch (SQLException e) {
            LOGGER.error("SQL Exception has occurred : {}", e.getMessage());
        }
    }

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        try (Connection wrappedConnection = dataSource.getConnection()) {
            SQLiteConnection conn = wrappedConnection.unwrap(SQLiteConnection.class);

            Function.create(conn, "SUBSTRING", new Function() {
                protected void xFunc() throws SQLException {
                    if (args() != 3) {
                        throw new SQLException(
                                "SUBSTRING(arg1,arg2,arg3): Invalid argument count. Requires 3, but found " + args());
                    }
                    String string = value_text(0);
                    int indexStart = value_int(1);
                    int indexEnd = value_int(2);
                    String valueToReturn = string.substring(indexStart, indexEnd);
                    LOGGER.debug("SUBSTRING invoked with input values: {} {} {} and returns value: {}", string,
                            indexStart, indexEnd, valueToReturn);
                    result(valueToReturn);
                }
            });

            Function.create(conn, "ADD_MONTHS", new Function() {
                protected void xFunc() throws SQLException {
                    if (args() != 2) {
                        throw new SQLException(
                                "ADD_MONTHS(arg1,arg2): Invalid argument count. Requires 2, but found " + args());
                    }
                    String value = value_text(0);
                    int months = value_int(1);
                    String valueToReturn = LocalDate.parse(value).plusMonths(months)
                            .format(DateTimeFormatter.ofPattern(DATE_FORMAT));
                    LOGGER.debug("ADD_MONTHS invoked with input values: {} {} and returns value: {}", value, months,
                            valueToReturn);
                    result(valueToReturn);
                }
            });

            Function.create(conn, "NDIV0", new Function() {
                protected void xFunc() throws SQLException {
                    if (args() != 2) {
                        throw new SQLException(
                                "NDIV0(arg1,arg2): Invalid argument count. Requires 2, but found " + args());
                    }
                    int num = value_int(0);
                    int den = value_int(1);
                    int valueToReturn = 0;
                    if (den != 0) {
                        valueToReturn = num / den;
                    }
                    LOGGER.debug("NDIV0 invoked with input values: {} {} and returns value: {}", num, den,
                            valueToReturn);
                    result(valueToReturn);
                }
            });

            formatDateForSql(conn, "TO_VARCHAR");
            formatDateForSql(conn, "TO_DATE");

        } catch (SQLException e) {
            LOGGER.error("SQL Exception has occurred : {}", e.getMessage());
        }
    }

}
