package com.sap.c4p.rm.consultantprofile.handlers;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.Result;
import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.cds.CdsUpdateEventContext;
import com.sap.cds.services.cds.CqnService;
import com.sap.cds.services.draft.*;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.*;
import com.sap.cds.services.messages.Messages;

import com.sap.c4p.rm.consultantprofile.projectroleservice.pojo.RoleLifecycleStatusCode;
import com.sap.c4p.rm.consultantprofile.projectroleservice.processor.ProjectRoleDataProcessor;
import com.sap.c4p.rm.consultantprofile.projectroleservice.validations.ProjectRoleValidator;
import com.sap.c4p.rm.consultantprofile.repositories.ProjectRolesRepository;
import com.sap.c4p.rm.consultantprofile.repositories.ProjectRolesTextRepository;
import com.sap.c4p.rm.consultantprofile.utils.NullUtils;
import com.sap.c4p.rm.consultantprofile.utils.ProjectRoleEventHandlerUtility;

import projectroleservice.*;

@Component
@ServiceName(ProjectRoleService_.CDS_NAME)
public class ProjectRoleServiceEventHandler implements EventHandler {
    private final ProjectRoleValidator validator;
    private final ProjectRoleDataProcessor processor;
    private final ProjectRoleEventHandlerUtility eventHandlerUtility;
    private final ProjectRolesTextRepository projectRolesTextRepository;
    private final Messages messages;
    private final ProjectRolesRepository projectRolesRepository;
    private static final String DELETED_TEXT_PARENTS = "DELETED_TEXT_PARENTS";

    @Autowired
    public ProjectRoleServiceEventHandler(final ProjectRoleValidator validator,
            final ProjectRoleDataProcessor processor, final ProjectRoleEventHandlerUtility eventHandlerUtility,
            final ProjectRolesTextRepository projectRolesTextRepository, final Messages messages,
            final ProjectRolesRepository projectRolesRepository) {
        this.validator = validator;
        this.processor = processor;
        this.eventHandlerUtility = eventHandlerUtility;
        this.projectRolesTextRepository = projectRolesTextRepository;
        this.messages = messages;
        this.projectRolesRepository = projectRolesRepository;
    }

    @Before(event = { CqnService.EVENT_CREATE }, entity = Roles_.CDS_NAME)
    public void beforeProjectRoleCreate(final Roles role) {
        validator.projectRoleNameEmptinessCheck(role);
        validator.projectRoleCodeEmptinessCheck(role);
        validator.projectRoleCodeUniquenessCheck(role);
        validator.projectRoleDescriptionXSSCheck(role);
        validator.projectRoleNameXSSCheck(role);
        validator.projectRoleTextCountCheck(role);
        if (role.getRoleLifecycleStatusCode() == null) {
            role.setRoleLifecycleStatusCode(RoleLifecycleStatusCode.UNRESTRICTED.getCode());
        }
        messages.throwIfError();
    }

    @Before(event = { CqnService.EVENT_UPDATE }, entity = Roles_.CDS_NAME)
    public void beforeProjectRoleUpdate(final CdsUpdateEventContext context, final Roles role) {
        validator.projectRoleNameEmptinessCheck(role);
        validator.projectRoleCodeEmptinessCheck(role);
        validator.projectRoleDescriptionXSSCheck(role);
        validator.projectRoleNameXSSCheck(role);
        validator.projectRoleTextCountCheck(role);
        String originalRoleCode = getRoleCode(context, role, true);
        String updatedRoleCode = role.getCode();
        // Only if role code is changed check for its uniqueness
        if (!(originalRoleCode.equals(updatedRoleCode))) {
            validator.projectRoleCodeUniquenessCheck(role);
        }
        if (role.getRoleLifecycleStatusCode() == null) {
            role.setRoleLifecycleStatusCode(RoleLifecycleStatusCode.UNRESTRICTED.getCode());
        }
        messages.throwIfError();
    }

    /**
     * This method is called when a {@link Roles} is restricted. It validates the
     * request and sets the role life cycle status accordingly.
     **/
    @On(event = RestrictContext.CDS_NAME, entity = Roles_.CDS_NAME)
    public void onRestrict(final RestrictContext context) {
        processor.restrictRole(context);
    }

    /**
     * This method is called when a {@link Roles} is unrestricted. It validates the
     * request and sets the role life cycle status accordingly.
     **/
    @On(event = RemoveRestrictionContext.CDS_NAME, entity = Roles_.CDS_NAME)
    public void onActivate(final RemoveRestrictionContext context) {
        processor.removeRestrictionRole(context);
    }

    /**
     * This method is called when a new {@link Roles} should be created via the
     * NewAction bound to the "Create" button on the Fiori Elements List Report. The
     * NewAction is a custom action bound to the collection it is supposed to
     * create, returning the created Roles draft.
     *
     * @param context {@link CreateRoleWithDialogContext}
     */
    @On(event = CreateRoleWithDialogContext.CDS_NAME, entity = Roles_.CDS_NAME)
    public void onCreateRoleWithDialogAction(final CreateRoleWithDialogContext context) {
        processor.createRoleWithDialog(context);
    }

    /**
     * @param context {@link DraftNewEventContext} to be passed on to
     *                {@link ProjectRoleEventHandlerUtility#enhanceRoleResult(Result, List)}
     * @param roles   {@link List} of {@link Roles} to be passed on to
     *                {@link ProjectRoleEventHandlerUtility#enhanceRoleResult(Result, List)}
     *
     *                Updates name and description of the {@link Roles} that was
     *                created.
     */
    @After(event = DraftService.EVENT_DRAFT_NEW, entity = Roles_.CDS_NAME)
    public void afterDraftNew(final DraftNewEventContext context, final List<Roles> roles) {
        final List<Roles> changedRoles = processor.updateTextsFromRoles(context, roles);
        eventHandlerUtility.enhanceRoleResult(context.getResult(), changedRoles);
    }

    /**
     * @param context {@link DraftEditEventContext} to be passed on to
     *                {@link ProjectRoleEventHandlerUtility#enhanceRoleResult(Result, List)}
     * @param roles   {@link List} of {@link Roles} to be passed on to
     *                {@link ProjectRoleEventHandlerUtility#enhanceRoleResult(Result, List)}
     */
    @After(event = DraftService.EVENT_DRAFT_EDIT, entity = Roles_.CDS_NAME)
    public void afterDraftEdit(final DraftEditEventContext context, final List<Roles> roles) {
        final List<Roles> changedRoles = processor.updateTextsFromRoles(context, roles);
        eventHandlerUtility.enhanceRoleResult(context.getResult(), changedRoles);
    }

    /**
     * @param context {@link DraftSaveEventContext} to be passed on to
     *                {@link ProjectRoleEventHandlerUtility#enhanceRoleResult(Result, List)}
     * @param roles   {@link List} of {@link Roles} to be passed on to
     *                {@link ProjectRoleEventHandlerUtility#enhanceRoleResult(Result, List)}
     */
    @After(event = DraftService.EVENT_DRAFT_SAVE, entity = Roles_.CDS_NAME)
    public void afterDraftSave(final DraftSaveEventContext context, final List<Roles> roles) {
        final List<Roles> changedRoles = processor.updateTextsFromRoles(context, roles);
        eventHandlerUtility.enhanceRoleResult(context.getResult(), changedRoles);
    }

    /**
     * Registers
     * {@link ProjectRoleDataProcessor#updateRoleTextsAtDatabase(DraftService, List)}
     * be executed after the transaction.
     *
     * @param context {@link DraftPatchEventContext} to be passed on to be used
     * @param texts   {@link List} of {@link RolesTexts} to be used to get their
     *                parent Role and update its name and description via
     *                {@link ProjectRoleDataProcessor#updateRoleTextsAtDatabase(DraftService, List)}
     */
    @After(event = DraftService.EVENT_DRAFT_PATCH, entity = RolesTexts_.CDS_NAME)
    public void afterDraftPatch(final DraftPatchEventContext context, final List<RolesTexts> texts) {
        texts.forEach(text -> eventHandlerUtility.addKeyAttributesToEntity(context.getModel(), context.getCqn(), text));

        final DraftService service = context.getService();

        Stream<Roles> expandedRolesStream = texts.stream().flatMap(text -> {
            final CqnSelect select = Select.from(Roles_.class)
                    .where(s -> s.texts().ID_texts().eq(text.getIDTexts())
                            .and(s.texts().IsActiveEntity().eq(text.getIsActiveEntity())))
                    .columns(Roles_::_all, s -> s.texts().expand());

            return service.run(select).streamOf(Roles.class);
        });
        processor.updateRoleTextsAtDatabase(service,
                eventHandlerUtility.removeDuplicateRole(expandedRolesStream).collect(Collectors.toList()));
    }

    /**
     * Called before the transaction of draft delete on Role texts and parent
     * details of deleted texts are stored in the context
     *
     * @param context {@link DraftCancelEventContext} to be passed on to be used
     */
    @Before(event = DraftService.EVENT_DRAFT_CANCEL, entity = RolesTexts_.CDS_NAME)
    public void beforeDraftCancel(final DraftCancelEventContext context) {
        RolesTexts text = RolesTexts.create();
        this.eventHandlerUtility.addKeyAttributesToEntity(context.getModel(), context.getCqn(), text);
        context.put(DELETED_TEXT_PARENTS, this.projectRolesRepository.getRolesByRoleText(text));
    }

    /**
     * Called whenever a role text draft is deleted and update its name and
     * description via
     * {@link ProjectRoleDataProcessor#updateRoleTextsAtDatabase(DraftService, List)}
     *
     * @param context {@link DraftPatchCancelContext} to be passed on to be used
     */
    @After(event = DraftService.EVENT_DRAFT_CANCEL, entity = RolesTexts_.CDS_NAME)
    public void afterDraftCancel(final DraftCancelEventContext context) {
        List<Roles> expandedRoles = this.projectRolesRepository
                .getExpandedRoles((List<Roles>) context.get(DELETED_TEXT_PARENTS));
        if (!NullUtils.isNullOrEmpty(expandedRoles))
            processor.updateRoleTextsAtDatabase(context.getService(), expandedRoles);
    }

    /**
     * Workaround for
     * https://github.tools.sap/Cloud4RM/ExternalCollaboration/issues/767
     *
     * Remove once the issue is fixed
     *
     * @param draftSaveEventContext {@link DraftSaveEventContext}
     */
    @Before(event = DraftService.EVENT_DRAFT_SAVE, entity = Roles_.CDS_NAME)
    public void beforeDraftSave(final DraftSaveEventContext draftSaveEventContext) {
        final Roles roles = Roles.create();
        this.eventHandlerUtility.addKeyAttributesToEntity(draftSaveEventContext.getModel(),
                draftSaveEventContext.getCqn(), roles);

        this.projectRolesTextRepository.deleteActiveTexts(roles);
    }

    private String getRoleCode(final CdsUpdateEventContext context, final Roles role, boolean isActiveEntity) {
        CqnSelect sql = Select.from(Roles_.CDS_NAME).columns(Roles.CODE)
                .where(b -> b.get(Roles.ID).eq(role.getId()).and(b.get(Roles.IS_ACTIVE_ENTITY).eq(isActiveEntity)));

        return context.getService().run(sql).single(Roles.class).getCode();
    }

}
