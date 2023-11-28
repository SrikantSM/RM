package com.sap.c4p.rm.consultantprofile.projectroleservice.processor;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sap.cds.ql.Insert;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.cqn.CqnInsert;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.services.EventContext;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.draft.DraftService;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.consultantprofile.gen.MessageKeys;
import com.sap.c4p.rm.consultantprofile.projectroleservice.pojo.RoleLifecycleStatusCode;
import com.sap.c4p.rm.consultantprofile.utils.HttpStatus;
import com.sap.c4p.rm.consultantprofile.utils.ProjectRoleEventHandlerUtility;

import com.sap.resourcemanagement.config.DefaultLanguages;
import com.sap.resourcemanagement.config.DefaultLanguages_;

import projectroleservice.*;

@Service
public class ProjectRoleDataProcessor {
    private final PersistenceService persistenceService;
    private final ProjectRoleEventHandlerUtility eventHandlerUtility;

    @Autowired
    public ProjectRoleDataProcessor(final PersistenceService persistenceService,
            ProjectRoleEventHandlerUtility eventHandlerUtility) {
        this.persistenceService = persistenceService;
        this.eventHandlerUtility = eventHandlerUtility;
    }

    /**
     * This method is called when a {@link Roles} is restricted. It validates the
     * request and sets the roleLifecycle status accordingly.
     **/
    public void restrictRole(final RestrictContext context) {
        CqnSelect select = context.getCqn();
        Roles role = ((DraftService) context.getService()).run(select).single(Roles.class);
        // Check if role is draft
        if (Boolean.FALSE.equals(role.getIsActiveEntity())) {
            throw new ServiceException(HttpStatus.CONFLICT, MessageKeys.ROLE_IN_DRAFT_NO_RESTRICT);
        }
        // Check if role is already restricted
        if (role.getRoleLifecycleStatusCode().equals(RoleLifecycleStatusCode.RESTRICTED.getCode())) {
            throw new ServiceException(HttpStatus.CONFLICT, MessageKeys.ROLE_ALREADY_RESTRICTED);
        }
        // call update method by passing RESTRICTED role lifecycle status
        updateRoleLifecycleStatusCode(role, RoleLifecycleStatusCode.RESTRICTED);
        context.getMessages().success(MessageKeys.ROLE_RESTRICTED);
        context.setResult(role);
    }

    /**
     * This method is called when a {@link Roles} is unrestricted. It validates the
     * request and sets the roleLifecycle status accordingly.
     **/
    public void removeRestrictionRole(final RemoveRestrictionContext context) {
        CqnSelect select = context.getCqn();
        Roles role = ((DraftService) context.getService()).run(select).single(Roles.class);
        // Check if role is draft
        if (Boolean.FALSE.equals(role.getIsActiveEntity())) {
            throw new ServiceException(HttpStatus.CONFLICT, MessageKeys.ROLE_IN_DRAFT_NO_REMOVE_RESTRICTION);
        }
        // Check if role is unrestricted
        if (role.getRoleLifecycleStatusCode().equals(RoleLifecycleStatusCode.UNRESTRICTED.getCode())) {
            throw new ServiceException(HttpStatus.CONFLICT, MessageKeys.ROLE_NOT_RESTRICTED);
        }
        // call update method by passing UNRESTRICTED role lifecycle status
        updateRoleLifecycleStatusCode(role, RoleLifecycleStatusCode.UNRESTRICTED);
        context.getMessages().success(MessageKeys.ROLE_UNRESTRICTED);
        context.setResult(role);
    }

    /**
     * This method is called when a {@link Roles} is Create. NewAction bound to the
     * "Create" button on the Fiori Elements List Report. The NewAction is a custom
     * action bound to the collection it is supposed to create, returning the
     * created Roles draft.
     **/
    public void createRoleWithDialog(final CreateRoleWithDialogContext context) {
        // Get default language from central service
        CqnSelect defaultLanguageSelect = Select.from(DefaultLanguages_.class).where(l -> l.rank().eq(0));
        // If default language is not available then throw exception
        DefaultLanguages defaultLanguage = this.persistenceService.run(defaultLanguageSelect)
                .first(DefaultLanguages.class)
                .orElseThrow(() -> new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.NO_DEFAULT_LANGUAGE));

        // Assign the value from create dialog
        final Roles newRole = Roles.create();
        newRole.setTexts(new ArrayList<>());

        // Text table data flow
        final RolesTexts newRoleText = RolesTexts.create();
        newRoleText.setName(context.getName());
        newRoleText.setLocale(defaultLanguage.getLanguageCode());
        newRoleText.setDescription(context.getDescription());

        newRole.getTexts().add(newRoleText);

        newRole.setCode(context.getCode());
        newRole.setName(context.getName());
        newRole.setDescription(context.getDescription());

        Roles draftRole = this.createDraft((DraftService) context.getService(), newRole);

        context.setResult(draftRole);
    }

    /**
     * Updates the texts {@link Roles} from a Role object providing ID and
     * IsActiveEntity. This method selects the {@link List} of {@link Roles} expands
     * to compute the field and writes it to the database.
     *
     * @param context {@link EventContext} from
     * @param roles   {@link List} of {@link Roles} providing ID and IsActiveEntity
     */
    public List<Roles> updateTextsFromRoles(final EventContext context, List<Roles> roles) {
        final DraftService service = (DraftService) context.getService();
        final List<Roles> expandedRoles = this.expandRolesTexts(service, roles);
        List<Roles> changedRoleList = eventHandlerUtility.removeDuplicateRole(expandedRoles.stream())
                .collect(Collectors.toList());
        return this.updateRoleTextsAtDatabase(service, changedRoleList);
    }

    /**
     * Updates the name and description of a {@link Roles} from a {@link List} of
     * {@link Roles} expanded on their {@link RolesTexts} and writes it to the
     * corresponding service, The modified List is also returned
     *
     * @param service       {@link DraftService} to be written to
     * @param expandedRoles {@link List} of {@link Roles} expanded on their
     *                      {@link RolesTexts}
     */
    public List<Roles> updateRoleTextsAtDatabase(DraftService service, List<Roles> expandedRoles) {
        CqnSelect defaultLanguageSelect = Select.from(DefaultLanguages_.class).where(l -> l.rank().eq(0));
        DefaultLanguages defaultLanguage = this.persistenceService.run(defaultLanguageSelect)
                .first(DefaultLanguages.class)
                .orElseThrow(() -> new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.NO_DEFAULT_LANGUAGE));

        expandedRoles.forEach(role -> {
            Optional<RolesTexts> defaultText = role.getTexts().stream()
                    .filter(s -> defaultLanguage.getLanguageCode().equals(s.getLocale())).findFirst();

            defaultText.ifPresent(text -> {
                Roles roleForUpdate = Roles.create();
                roleForUpdate.setName(text.getName());
                roleForUpdate.setDescription(text.getDescription());

                if (Boolean.TRUE.equals(role.getIsActiveEntity())) {
                    CqnUpdate update = Update.entity(Roles_.class).where(s -> s.ID().eq(role.getId()))
                            .data(roleForUpdate);
                    this.persistenceService.run(update);
                } else {
                    CqnUpdate update = Update.entity(Roles_.class)
                            .where(s -> s.ID().eq(role.getId()).and(s.IsActiveEntity().eq(Boolean.FALSE)))
                            .data(roleForUpdate);
                    service.patchDraft(update);
                }

                role.setName(text.getName());
                role.setDescription(text.getDescription());
            });
        });
        return expandedRoles;
    }

    protected List<Roles> expandRolesTexts(DraftService service, List<Roles> roles) {
        Stream<Roles> rolesStream = roles.stream().map(role -> {
            final CqnSelect select = Select.from(Roles_.class)
                    .where(s -> s.ID().eq(role.getId()).and(s.IsActiveEntity().eq(role.getIsActiveEntity())))
                    .columns(Roles_::_all, s -> s.texts().expand());
            return service.run(select).first(Roles.class).orElse(null);
        });

        return rolesStream.collect(Collectors.toList());
    }

    /**
     * Sets the lifecycle status of a given {@link Roles}
     */
    private void updateRoleLifecycleStatusCode(final Roles role,
            final RoleLifecycleStatusCode newRoleLifecycleStatusCode) {
        // set RoleLifecycleStatusCode to new RoleLifecycleStatusCode
        role.setRoleLifecycleStatusCode(newRoleLifecycleStatusCode.getCode());
        // Update the role with new RoleLifecycleStatusCode
        CqnUpdate update = Update.entity(Roles_.class).where(s -> s.get(Roles.ID).eq(role.getId()))
                .data(Roles.ROLE_LIFECYCLE_STATUS_CODE, role.getRoleLifecycleStatusCode());
        this.persistenceService.run(update);
    }

    // Create draft for the class Role from text table
    private Roles createDraft(DraftService draftService, Roles role) {
        final CqnInsert roleInsert = Insert.into(Roles_.class).entry(role);
        return draftService.newDraft(roleInsert).single(Roles.class);
    }

}
