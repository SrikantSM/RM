package com.sap.c4p.rm.cloudfoundry.service.jobscheduler.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class JobSchedulerRuns {
    private long total;
    private List<JobSchedulerRun> results;
    @JsonProperty("pagination_enabled")
    private boolean paginationEnabled;
    @JsonProperty("restricted_results")
    private boolean restrictedResults;
    @JsonProperty("prev_url")
    private String prevURL;
    @JsonProperty("next_url")
    private String nextURL;
}
