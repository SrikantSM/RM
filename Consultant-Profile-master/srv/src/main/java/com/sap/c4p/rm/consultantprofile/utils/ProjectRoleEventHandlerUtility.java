package com.sap.c4p.rm.consultantprofile.utils;

import java.util.*;
import java.util.stream.Stream;

import org.springframework.stereotype.Component;

import com.sap.cds.Result;
import com.sap.cds.ql.cqn.CqnAnalyzer;
import com.sap.cds.ql.cqn.CqnStatement;
import com.sap.cds.reflect.CdsModel;
import com.sap.cds.services.EventContext;

import projectroleservice.Roles;

@Component
public class ProjectRoleEventHandlerUtility {

    /**
     * Adds the key attribute information contained in a {@link CqnStatement} to an
     * entity instance
     *
     * @param cdsModel     {@link CdsModel} from the {@link EventContext}
     * @param cqnStatement {@link CqnStatement} from the {@link EventContext}
     * @param entityData   {@link Map} representing the data of an entity
     */
    public void addKeyAttributesToEntity(final CdsModel cdsModel, final CqnStatement cqnStatement,
            final Map<String, Object> entityData) {
        CqnAnalyzer.create(cdsModel).analyze(cqnStatement.ref()).targetKeys().entrySet().stream()
                .filter(entry -> entry.getValue() != null)
                .forEach(entry -> entityData.put(entry.getKey(), entry.getValue()));
    }

    /**
     * Removes all duplicates (by ID) from a {@link Stream} of {@link Roles}
     *
     * @param roles {@link Stream} of {@link Roles} with their ID set
     * @return Filtered {@link Stream} containing each role ID at maximum one time
     */
    public Stream<Roles> removeDuplicateRole(Stream<Roles> roles) {
        Set<String> roleIdSet = new HashSet<>();
        return roles.filter(s -> s != null && roleIdSet.add(s.getId()));
    }

    /**
     * For some (draft) action results, FE needs the new Role entity. Sometimes,
     * however, we modify that Role's name, description and
     * commaSeparatedAlternativeLabels after CAP's generic handlers. We need to
     * change the List in the Result of the context afterwards
     *
     * @param result       The Result of the EventContext for the (draft) action
     * @param changedRoles List containing roles that were changed
     */
    public void enhanceRoleResult(Result result, List<Roles> changedRoles) {
        result.listOf(Roles.class).forEach(role -> {
            for (Roles changedRole : changedRoles) {
                if (changedRole.getId().equals(role.getId())) {
                    role.setName(changedRole.getName());
                    role.setDescription(changedRole.getDescription());
                }
            }
        });
    }
}
