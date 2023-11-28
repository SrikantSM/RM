package com.sap.c4p.rm.cloudfoundry.service.jobscheduler.service;

public enum JobSchedulerSymbols {
    COST_CENTER("CS"),
    WORKFORCE_PERSON("WF"),
    TIME_DIMENSION("TD"),
    WORKFORCE_CAPABILITY("WC");

    private final String symbol;

    public String getSymbol() {
        return this.symbol;
    }

    JobSchedulerSymbols(String symbol) {
        this.symbol = symbol;
    }
}
