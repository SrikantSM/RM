package com.sap.c4p.rm.consultantprofile.projectroleservice.validations;

import projectroleservice.Roles;

public interface ProjectRoleValidator {
    void projectRoleCodeEmptinessCheck(Roles role);

    void projectRoleCodeUniquenessCheck(Roles role);

    void projectRoleNameEmptinessCheck(Roles role);

    void projectRoleDescriptionXSSCheck(Roles role);

    void projectRoleNameXSSCheck(Roles role);

    void projectRoleTextCountCheck(Roles role);
}
