package com.sap.c4p.rm.skill.mdiintegration.cloudfoundry.service.jobscheduler.service;

public enum JobSchedulerSymbols {
  WORKFORCE_CAPABILITY("WC");

  private final String symbol;

  public String getSymbol() {
    return this.symbol;
  }

  JobSchedulerSymbols(String symbol) {
    this.symbol = symbol;
  }
}
