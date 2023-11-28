package com.sap.c4p.rm.consultantprofile.repositories;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import com.sap.cds.ql.Select;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.services.draft.DraftService;

import projectroleservice.ProjectRoleService_;
import projectroleservice.Roles;
import projectroleservice.RolesTexts;
import projectroleservice.Roles_;

@Repository
public class ProjectRolesRepository {

    private final DraftService draftService;

    public ProjectRolesRepository(@Qualifier(ProjectRoleService_.CDS_NAME) DraftService draftService) {
        this.draftService = draftService;
    }

    public List<Roles> getRolesByRoleText(RolesTexts text) {
        final CqnSelect select = Select.from(Roles_.class).where(s -> s.texts().ID_texts().eq(text.getIDTexts())
                .and(s.texts().IsActiveEntity().eq(text.getIsActiveEntity()))).columns(Roles_::_all);
        return draftService.run(select).listOf(Roles.class);
    }

    public List<Roles> getExpandedRoles(List<Roles> roles) {
        Stream<Roles> rolesStream = roles.stream().map(role -> {
            final CqnSelect select = Select.from(Roles_.class)
                    .where(s -> s.ID().eq(role.getId())
                            .and(s.IsActiveEntity()
                                    .eq(role.getIsActiveEntity() == null ? Boolean.TRUE : role.getIsActiveEntity())))
                    .columns(Roles_::_all, s -> s.texts().expand());
            return draftService.run(select).first(Roles.class).orElse(null);
        });
        return rolesStream.filter(Objects::nonNull).collect(Collectors.toList());
    }

}
