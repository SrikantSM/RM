package com.sap.c4p.rm.consultantprofile.myprojectexperienceservice.validations;

import java.util.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.services.ServiceException;
import com.sap.cds.services.messages.Messages;

import com.sap.c4p.rm.consultantprofile.config.LoggingMarker;
import com.sap.c4p.rm.consultantprofile.gen.MessageKeys;
import com.sap.c4p.rm.consultantprofile.utils.NullUtils;
import com.sap.c4p.rm.consultantprofile.utils.commonvalidations.CommonValidator;

import com.sap.resourcemanagement.config.ProjectRolesView;
import com.sap.resourcemanagement.config.ProjectRolesView_;

import myprojectexperienceservice.MyProjectExperienceHeader_;
import myprojectexperienceservice.Roles;

/**
 * Class to validate the roles are being Assigned to
 * {@link myprojectexperienceservice.MyProjectExperienceHeader}
 */
@Component
public class MyProjectExperienceHeaderRoleValidator {
    private static final Logger LOGGER = LoggerFactory.getLogger(MyProjectExperienceHeaderRoleValidator.class);
    private static final Marker ROLE_ASSIGNMENT_MARKER = LoggingMarker.ROLE_ASSIGNMENT_MARKER.getMarker();

    private final CommonValidator commonValidator;
    private final Messages messages;

    /**
     * initialize {@link MyProjectExperienceHeaderRoleValidator} instance and accept
     * the instance of {@link CommonValidator} to be used
     *
     * @param commonValidator will be used to invoke common validation methods
     */
    @Autowired
    public MyProjectExperienceHeaderRoleValidator(final CommonValidator commonValidator, final Messages messages) {
        this.commonValidator = commonValidator;
        this.messages = messages;
    }

    /**
     * method to validate {@link Roles}
     *
     * @param roles: represents the list of assigned roles
     */
    public void validateMyProjectExperienceHeaderRoles(List<Roles> roles) {
        try {
            for (Roles role : roles) {
                if (!checkNullForRoleAssigned(role)) {
                    checkRoleAssignedForXSS(role);
                    checkForeignKeyValueForAssignedRole(role);
                }
            }
            checkDuplicateRoleAssignment(roles);
        } catch (ServiceException serviceException) {
            throw new ServiceException(serviceException);
        }
    }

    public void checkRoleAssignedForXSS(Roles role) {
        if (!commonValidator.validateFreeTextforScripting(role.getRoleId())) {
            prepareErrorMessage(role, MessageKeys.INPUT_ROLE_IS_INVALID,
                    "The role entered under the roles has scripting tags");
        }
    }

    /**
     * method to check if given inputs are null or empty
     *
     * @param role: represents a assigned to role
     */
    private boolean checkNullForRoleAssigned(Roles role) {
        if (NullUtils.isNullOrEmpty(role.getRoleId()) || role.getRoleId().matches("^\\s*$")) {
            prepareErrorMessage(role, MessageKeys.INPUT_ROLE_CAN_NOT_EMPTY,
                    "The role entered under the roles is null or empty");
            return true;
        } else
            return false;
    }

    /**
     * method to check if given input value exists in related DB artifact
     *
     * @param role: represents a assigned to role
     */
    private void checkForeignKeyValueForAssignedRole(Roles role) {
        if (!commonValidator.checkInputValueExistingDB(ProjectRolesView_.CDS_NAME, ProjectRolesView.ID,
                role.getRoleId())) {
            prepareErrorMessage(role, MessageKeys.ROLE_DOES_NOT_EXISTS,
                    "The role entered under the roles is not in DB");
        }
    }

    /**
     * method to check if Duplicate is being assigned to
     * {@link myprojectexperienceservice.MyProjectExperienceHeader}
     *
     * @param roles: represents the list of assigned roles
     */
    private void checkDuplicateRoleAssignment(List<Roles> roles) {
        Set<String> uniqueAssignedRoles = new HashSet<>();
        List<String> duplicateRoles = new ArrayList<>();
        List<String> roleId = new ArrayList<>();
        roles.forEach(role -> {
            if (!uniqueAssignedRoles.add(role.getRoleId())) {
                roleId.add(role.getId());
                duplicateRoles.add(role.getRoleId());
            }
        });
        checkDuplicateRoleID(duplicateRoles, roleId);
    }

    private void checkDuplicateRoleID(List<String> duplicateRoles, List<String> roleId) {
        if (!(NullUtils.isNullOrEmpty(duplicateRoles))) {
            prepareErrorMessage(roleId.get(0), MessageKeys.DUPLICATE_ROLE_CAN_NOT_BE_ASSIGNED,
                    "The role entered has already been added under the roles");
        }
    }

    /**
     * method to check if given input value of role and employee as ID is valid
     *
     * @param role: Represents {@link Roles} payload
     */
    public boolean checkInputFieldLength(final Roles role) {
        final String roleID = role.getRoleId();
        if (commonValidator.checkInputGuidFieldLength(roleID)) {
            this.prepareErrorMessage(role, MessageKeys.ROLE_DOES_NOT_EXISTS);
            return false;
        }
        return true;
    }

    public void prepareErrorMessage(final Roles role, final String messageKey) {
        prepareErrorMessage(role.getId(), messageKey, messageKey);
    }

    private void prepareErrorMessage(final Roles role, final String messageKey, final String loggerMsg) {
        prepareErrorMessage(role.getId(), messageKey, loggerMsg);
    }

    private void prepareErrorMessage(final String roleId, final String messageKey, final String loggerMsg) {
        messages.error(messageKey).target("in", MyProjectExperienceHeader_.class, projExp -> projExp
                .roles(header -> header.ID().eq(roleId).and(header.IsActiveEntity().eq(Boolean.FALSE))).role_ID());
        LOGGER.info(ROLE_ASSIGNMENT_MARKER, loggerMsg);
    }

}
