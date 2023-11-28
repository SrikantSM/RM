package com.sap.c4p.rm.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.sap.c4p.rm.handlers.MyBackgroundJobs;

/**
 * A Configuration class to create and initialize the HouseKeeper Job.
 */
@Component
@Profile("hana")
public class StartupApplicationListener implements ApplicationListener<ApplicationReadyEvent> {

    private final MyBackgroundJobs myBackgroundJobs;

    @Autowired
    public StartupApplicationListener(final MyBackgroundJobs myBackgroundJobs) {
        this.myBackgroundJobs = myBackgroundJobs;
    }

    /**
     * This event is executed as late as conceivably possible to indicate that the
     * application is ready to serve requests.
     */
    @Override
    public void onApplicationEvent(final ApplicationReadyEvent event) {
        this.myBackgroundJobs.submitForHouseKeeperJob();
    }

}
