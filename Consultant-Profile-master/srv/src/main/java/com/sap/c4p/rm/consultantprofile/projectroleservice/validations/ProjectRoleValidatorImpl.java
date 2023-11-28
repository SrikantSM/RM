package com.sap.c4p.rm.consultantprofile.projectroleservice.validations;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.messages.Messages;
import com.sap.cds.services.persistence.PersistenceService;

import com.sap.c4p.rm.consultantprofile.gen.MessageKeys;
import com.sap.c4p.rm.consultantprofile.utils.HttpStatus;
import com.sap.c4p.rm.consultantprofile.utils.commonvalidations.CommonValidator;

import com.sap.resourcemanagement.config.*;

import projectroleservice.Roles;
import projectroleservice.RolesTexts;
import projectroleservice.Roles_;
import sap.common.Languages;
import sap.common.Languages_;

@Service
public class ProjectRoleValidatorImpl implements ProjectRoleValidator {
    private final PersistenceService persistenceService;

    /**
     * instance to invoke common validation methods
     */
    private final CommonValidator commonValidator;
    private final Messages messages;

    @Autowired
    public ProjectRoleValidatorImpl(final PersistenceService persistenceService, final CommonValidator commonValidator,
            final Messages messages) {
        this.persistenceService = persistenceService;
        this.commonValidator = commonValidator;
        this.messages = messages;
    }

    @Override
    public void projectRoleNameEmptinessCheck(Roles role) {
        List<RolesTexts> locale = role.getTexts();

        for (RolesTexts index : locale) {
            String roleTextName = index.getName();
            if ((roleTextName == null || roleTextName.isEmpty() || roleTextName.matches("^\\s*$"))) {
                messages.error(MessageKeys.ROLENAME_EMPTY)
                        .target("in", projectroleservice.Roles_.class,
                                projRole -> projRole.texts(projTextRole -> projTextRole.ID_texts()
                                        .eq(index.getIDTexts()).and(projTextRole.IsActiveEntity().eq(Boolean.FALSE)))
                                        .name());
            }
        }
    }

    @Override
    public void projectRoleCodeEmptinessCheck(Roles role) {
        String roleCode = role.getCode();
        if (roleCode == null || roleCode.isEmpty() || roleCode.matches("^\\s*$")
                || !(roleCode.matches("^[\\w\\s]+$"))) {
            messages.error(MessageKeys.ROLECODE_EMPTY).target("in", projectroleservice.Roles_.class, Roles_::code);
        }
    }

    @Override
    public void projectRoleCodeUniquenessCheck(Roles role) {
        String roleCode = role.getCode();
        final CqnSelect query = Select.from(ProjectRoles_.CDS_NAME).where(b -> b.get(ProjectRoles.CODE).eq(roleCode));
        final long count = persistenceService.run(query).rowCount();
        // If the count is greater than zero, the role code is already present
        if (count > 0) {
            messages.error(MessageKeys.ROLECODE_EXISTS).target("in", projectroleservice.Roles_.class, Roles_::code);
        }
    }

    @Override
    public void projectRoleDescriptionXSSCheck(Roles role) {
        boolean flag = false;
        List<RolesTexts> langLocale = role.getTexts();
        for (RolesTexts index : langLocale) {
            String description = index.getDescription();
            if (!commonValidator.validateFreeTextforScripting(description)) {
                messages.error(MessageKeys.INPUT_ROLE_DESCRIPTION_IS_INVALID)
                        .target("in", projectroleservice.Roles_.class,
                                projRole -> projRole.texts(projTextRole -> projTextRole.ID_texts()
                                        .eq(index.getIDTexts()).and(projTextRole.IsActiveEntity().eq(Boolean.FALSE)))
                                        .description());
                flag = true;
            }
        }
        if (!flag && !commonValidator.validateFreeTextforScripting(role.getDescription())) {
            messages.error(MessageKeys.INPUT_ROLE_DESCRIPTION_IS_INVALID).target("in", projectroleservice.Roles_.class,
                    Roles_::ID);
        }
    }

    @Override
    public void projectRoleNameXSSCheck(Roles role) {
        List<RolesTexts> langLocale = role.getTexts();
        boolean flag = false;
        for (RolesTexts index : langLocale) {
            String name = index.getName();
            if (!commonValidator.validateFreeTextforScripting(name)) {
                messages.error(MessageKeys.INPUT_ROLE_NAME_IS_INVALID)
                        .target("in", projectroleservice.Roles_.class,
                                projRole -> projRole.texts(projTextRole -> projTextRole.ID_texts()
                                        .eq(index.getIDTexts()).and(projTextRole.IsActiveEntity().eq(Boolean.FALSE)))
                                        .name());
                flag = true;
            }
        }

        if (!flag && !commonValidator.validateFreeTextforScripting(role.getName())) {
            messages.error(MessageKeys.INPUT_ROLE_NAME_IS_INVALID).target("in", projectroleservice.Roles_.class,
                    Roles_::ID);
        }
    }

    public void checkDefaultText(Optional<RolesTexts> defaultText, Roles role, DefaultLanguages defaultLanguage) {
        if (!defaultText.isPresent()) {
            List<RolesTexts> langLocale = role.getTexts();
            for (RolesTexts index : langLocale) {
                messages.error(MessageKeys.ROLE_NO_DEFAULT_LANGUAGE_TEXT, defaultLanguage.getLanguageCode())
                        .target("in", projectroleservice.Roles_.class,
                                projRole -> projRole.texts(projTextRole -> projTextRole.ID_texts()
                                        .eq(index.getIDTexts()).and(projTextRole.IsActiveEntity().eq(Boolean.FALSE)))
                                        .locale());
            }
        }
    }

    public void checkTextForLocale(final long textsForLocale, Roles role, final String locale) {
        if (textsForLocale != 1) {
            List<RolesTexts> langLocale = role.getTexts();
            for (RolesTexts index : langLocale) {
                messages.error(MessageKeys.WRONG_ROLE_TEXT_COUNT, locale)
                        .target("in", projectroleservice.Roles_.class,
                                projRole -> projRole.texts(projTextRole -> projTextRole.ID_texts()
                                        .eq(index.getIDTexts()).and(projTextRole.IsActiveEntity().eq(Boolean.FALSE)))
                                        .locale());
            }
        }
    }

    public void checkLanguagePresent(Roles role, final String locale) {
        List<RolesTexts> langLocale = role.getTexts();
        for (RolesTexts index : langLocale) {
            if (index.getLocale().equals(locale)) {
                messages.error(MessageKeys.LANGUAGECODE_DOES_NOT_EXISTS, locale)
                        .target("in", projectroleservice.Roles_.class,
                                projRole -> projRole.texts(projTextRole -> projTextRole.ID_texts()
                                        .eq(index.getIDTexts()).and(projTextRole.IsActiveEntity().eq(Boolean.FALSE)))
                                        .locale());
            }
        }
    }

    @Override
    public void projectRoleTextCountCheck(Roles role) {
        CqnSelect defaultLanguageSelect = Select.from(DefaultLanguages_.class).where(l -> l.rank().eq(0));
        DefaultLanguages defaultLanguage = this.persistenceService.run(defaultLanguageSelect)
                .first(DefaultLanguages.class)
                .orElseThrow(() -> new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.NO_DEFAULT_LANGUAGE));

        if (!(role.getTexts().isEmpty())) {
            final Optional<RolesTexts> defaultText = role.getTexts().stream()
                    .filter(s -> defaultLanguage.getLanguageCode().equals(s.getLocale())).findFirst();
            // Validate if there is a text in the default language
            checkDefaultText(defaultText, role, defaultLanguage);
            final Set<String> locales = (role.getTexts().stream().map(RolesTexts::getLocale)).filter(Objects::nonNull)
                    .collect(Collectors.toSet());
            for (final String locale : locales) {
                final long textsForLocale = role.getTexts().stream().filter(s -> locale.equals(s.getLocale())).count();
                // Validate that the role has exactly one text for each used locale
                checkTextForLocale(textsForLocale, role, locale);
                // Validate ForeignKey Value For language assignment
                if (!commonValidator.checkInputValueExistingDB(Languages_.CDS_NAME, Languages.CODE, locale)) {
                    checkLanguagePresent(role, locale);
                }
            }
        } else {
            throw new ServiceException(HttpStatus.BAD_REQUEST, MessageKeys.ROLE_NO_DEFAULT_LANGUAGE_TEXT,
                    defaultLanguage.getLanguageCode());
        }
    }
}
