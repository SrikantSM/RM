package com.sap.c4p.rm.consultantprofile.utils;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

import com.sap.resourcemanagement.config.DefaultLanguages;

import projectroleservice.Roles;
import projectroleservice.RolesTexts;

public final class TestHelper {
    public static final String LANGUAGE_CODE_EN = "en";
    public static final String LANGUAGE_CODE_DE = "de";

    public static final String CONCEPT_TYPE_VALUE = "KnowledgeRoleCompetence";
    public static final String ROLE_TYPE_VALUE = "role/competence";
    public static final String EMPTY_VALUE = "";
    public static final String UNRESTRICTED = "unrestricted";

    public static final String ROLE_ID = "sId#";
    public static final String ROLE_CODE = "sCodes#";
    public static final String ROLE_NAME = "sName#";
    public static final String ROLE_DESCRIPTION = "sDescription#";
    public static final String ROLE_TEXT_ID = "tId#";
    public static final String ROLE_TEXT_NAME = "tName#";
    public static final String ROLE_TEXT_DESCRIPTION = "tDescription#";
    public static final String ROLE_TEXT_ID_TEXTS = "tIdTexts#";

    public static <T> List<T> createTestEntities(int numberOfTestEntities,
            Function<Integer, T> entityCreationFunction) {
        List<T> entities = new ArrayList<>();
        for (int i = 0; i < numberOfTestEntities; i++) {
            entities.add(entityCreationFunction.apply(i));
        }
        return entities;
    }

    public static <T> T createTestEntities(Function<Integer, T> entityCreationFunction) {
        return createTestEntities(1, entityCreationFunction).get(0);
    }

    public static DefaultLanguages createDefaultLanguage(String languageCode) {
        return TestHelper.createTestEntities(i -> {
            DefaultLanguages defaultLanguages = DefaultLanguages.create();
            defaultLanguages.setLanguageCode(languageCode);
            defaultLanguages.setRank(0);
            return defaultLanguages;
        });
    }

    public static Roles createRole() {
        return TestHelper.createTestEntities(i -> {
            final Roles role = Roles.create();
            role.setName(TestHelper.ROLE_ID + i);
            role.setDescription(TestHelper.ROLE_DESCRIPTION + i);
            role.setId(TestHelper.ROLE_ID + i);
            role.setCode(TestHelper.ROLE_CODE + i);
            return role;
        });
    }

    public static Roles createRoleWithTexts() {
        return TestHelper.createTestEntities(i -> {
            Roles expectedRoleToCreate = Roles.create();
            expectedRoleToCreate.setName(TestHelper.ROLE_NAME + i);
            expectedRoleToCreate.setDescription(TestHelper.ROLE_DESCRIPTION + i);
            final List<RolesTexts> expectedTexts = TestHelper.createTestEntities(1, j -> {
                RolesTexts expectedText = RolesTexts.create();
                expectedText.setName(TestHelper.ROLE_NAME + j);
                expectedText.setDescription(TestHelper.ROLE_DESCRIPTION + j);
                expectedText.setLocale(TestHelper.LANGUAGE_CODE_EN);
                expectedText.remove(Roles.IS_ACTIVE_ENTITY);
                expectedText.remove(RolesTexts.IS_ACTIVE_ENTITY);
                return expectedText;
            });
            expectedRoleToCreate.setTexts(expectedTexts);
            return expectedRoleToCreate;
        });
    }

}
