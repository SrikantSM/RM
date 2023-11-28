package com.sap.c4p.rm.skill.mdiintegration.utils;

import java.text.MessageFormat;

public class StringFormatter {

  private StringFormatter() {
  }

  public static String format(String msg, Object... args) {
    MessageFormat messageFormat = new MessageFormat(msg);
    return messageFormat.format(args);
  }

}
