package com.sap.c4p.rm.consultantprofile.handlers;

/***
 * This class contains an indicator bean that shows whether a read is initial or
 * recursive
 *
 */
public class InitialReadFlag {

    public InitialReadFlag() {
        this.initialRead = Boolean.TRUE;
    }

    private Boolean initialRead;

    public Boolean isInitialRead() {
        return initialRead;
    }

    public void setInitialRead(Boolean initialRead) {
        this.initialRead = initialRead;
    }

}
