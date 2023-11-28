package com.sap.c4p.rm.consultantprofile.myprojectexperienceservice.pojo;

import java.time.LocalDate;
import java.util.Objects;

import com.sap.c4p.rm.consultantprofile.utils.NullUtils;

public class ExternalWorkExperienceWithMandatoryValues {
    private String projectName;
    private String rolePlayed;
    private String companyName;
    private LocalDate startDate;
    private LocalDate endDate;

    public ExternalWorkExperienceWithMandatoryValues(String projectName, String rolePlayed, String companyName,
            LocalDate startDate, LocalDate endDate) {
        this.projectName = projectName;
        this.rolePlayed = rolePlayed;
        this.companyName = companyName;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getRolePlayed() {
        return rolePlayed;
    }

    public void setRolePlayed(String rolePlayed) {
        this.rolePlayed = rolePlayed;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    @Override
    public boolean equals(Object o) {
        if (!NullUtils.isNullOrEmpty(o) && o instanceof ExternalWorkExperienceWithMandatoryValues) {
            ExternalWorkExperienceWithMandatoryValues e = (ExternalWorkExperienceWithMandatoryValues) o;
            String eCompanyName;
            String eRolePlayed;
            String eProjectName;
            LocalDate eStartDate;
            LocalDate eEndDate;
            return (eProjectName = e.getProjectName()) != null && eProjectName.equals(this.projectName)
                    && (eRolePlayed = e.getRolePlayed()) != null && eRolePlayed.equals(this.rolePlayed)
                    && (eCompanyName = e.getCompanyName()) != null && eCompanyName.equals(this.companyName)
                    && (eStartDate = e.getStartDate()) != null && eStartDate.equals(this.startDate)
                    && (eEndDate = e.getEndDate()) != null && eEndDate.equals(this.endDate);
        }

        return false;
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.projectName, this.companyName, this.rolePlayed, this.startDate, this.endDate);
    }
}
