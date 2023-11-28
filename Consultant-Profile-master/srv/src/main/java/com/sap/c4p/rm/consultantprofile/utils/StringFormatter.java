package com.sap.c4p.rm.consultantprofile.utils;

import java.text.MessageFormat;

/**
 * To unify the message pattern for logging
 */
public class StringFormatter {

    private StringFormatter() {
    }

    public static String format(String msg, Object... args) {
        MessageFormat messageFormat = new MessageFormat(msg);
        return messageFormat.format(args);
    }

}
