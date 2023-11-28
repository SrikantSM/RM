package com.sap.c4p.rm.consultantprofile.handlers;

import com.sap.cds.services.changeset.ChangeSetContext;
import com.sap.cds.services.changeset.ChangeSetListener;

/**
 * Spy Implementation of ChangeSetContext. Is capable of remembering <i>only
 * one</i> {@link com.sap.cds.services.changeset.ChangeSetListener}.
 * {@code getChangeSetListener()} returns this
 * {@link com.sap.cds.services.changeset.ChangeSetListener} after it has been
 * registered using {@link #register(ChangeSetListener)}.
 */
public class SpyChangeSetContext implements ChangeSetContext {

    /** the ChangeSetListener that has been registered latest */
    private ChangeSetListener listener;

    @Override
    public void markForCancel() {
    }

    @Override
    public boolean isMarkedForCancel() {
        return false;
    }

    @Override
    public void register(final ChangeSetListener listener) {
        this.listener = listener;
    }

    /**
     * return the {@link com.sap.cds.services.changeset.ChangeSetListener} that has
     * been registered latest
     *
     * @return the ChangeSetListener
     */
    public ChangeSetListener getChangeSetListener() {
        return this.listener;
    }

    @Override
    public int getId() {
        return 0;
    }
}
