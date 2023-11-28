import { suite, timeout, test } from 'mocha-typescript';
import { assert } from 'chai';
import { v4 as uuid } from 'uuid';
import {
    allProjectRoles,
    allProjectRolesTexts,
    projectRoleWithDescription1,
    projectRoleWithDescription4,
    projectRoleWithDescription4De,
    projectRoleWithDescription4En,
} from '../../data/db/config';
import {
    correctRoleText,
    evilRoleTextName,
    roleTextWithEmptyName,
    roleTextWithNonExistingLanguage,
    roleTextWithNullLanguage,
    roleTextWithNullName,
} from '../../data/service/projectRoleService';
import { ProjectRoleText } from '../../serviceEntities/projectRoleService';
import { TEST_TIMEOUT } from '../../utils/serviceRepository/Service-Repository';
import { ProjectRoleServiceRepository } from '../../utils/serviceRepository/ProjectRoleService-Repository';

@suite('ProjectRoleService/Roles_Texts')
export class ProjectRoleServiceRoleTextTest extends ProjectRoleServiceRepository {
    public constructor() {
        super('Roles_texts');
    }

    @timeout(TEST_TIMEOUT)
    static async before() {
        await this.prepare();
        await this.projectRoleRepository.insertMany(allProjectRoles);
        await this.projectRoleTextRepository.insertMany(allProjectRolesTexts);
    }

    @timeout(TEST_TIMEOUT)
    static async after() {
        await this.projectRoleRepository.deleteMany(allProjectRoles);
        await this.projectRoleTextRepository.deleteMany(allProjectRolesTexts);
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create Role/texts with correct data'() {
        const projectRoleText = { ...correctRoleText, ID: projectRoleWithDescription1.ID } as ProjectRoleText;
        this.responses.push(await this.enableDraftEdit(projectRoleWithDescription1.ID));
        const response = await this.create(projectRoleText);
        assert.equal(response.status, 201, 'Expected status code of text creation to be 201 (CREATED).');

        const createdTextId = response.data.ID_texts;
        const responseGet = await this.get(`(ID_texts=${createdTextId},IsActiveEntity=false)`);
        assert.equal(responseGet.status, 200, 'Expected status code of text reading to be 200 (OK).');
        this.responses.push(await this.deleteDraft(projectRoleWithDescription1.ID));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create Role/texts with non-existing parent role'() {
        const createdRoleId = uuid();
        const projectRoleText = { ...correctRoleText, ID: createdRoleId } as ProjectRoleText;
        const response = await this.create(projectRoleText);

        assert.equal(response.status, 409, 'Expected status code of text creation to be 409 (CONFLICT).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create Role/texts active parent role'() {
        this.responses.push(await this.activateDraft(projectRoleWithDescription1.ID));
        const projectRoleText = { ...correctRoleText, ID: projectRoleWithDescription1.ID } as ProjectRoleText;
        const response = await this.create(projectRoleText);

        assert.equal(response.status, 409, 'Expected status code of text creation to be 409 (CONFLICT).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create Role/texts with an evil script tag in role name'() {
        const projectRoleText = { ...evilRoleTextName, ID: projectRoleWithDescription1.ID } as ProjectRoleText;
        const response = await this.create(projectRoleText);
        assert.equal(response.status, 400, 'Expected status code of text creation to be 400 (BAD_REQUEST).');

        const createdTextId = evilRoleTextName.ID_texts;
        const responseGet = await this.get(`(ID_texts=${createdTextId},IsActiveEntity=false)`);
        assert.equal(responseGet.status, 404, 'Expected status code of text reading to be 404 (NOT_FOUND).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create Role/texts with an invalid (empty string) name'() {
        const projectRoleText = { ...roleTextWithEmptyName, ID: projectRoleWithDescription1.ID } as ProjectRoleText;
        this.responses.push(await this.enableDraftEdit(projectRoleWithDescription1.ID));
        const response = await this.create(projectRoleText);
        this.responses.push(response);
        assert.equal(response.status, 201, 'Expected status code should be 201 (Created), as we are creating a draft');

        const draftActivateResponse = await this.activateDraft(projectRoleText.ID);
        this.responses.push(draftActivateResponse);
        assert.equal(draftActivateResponse.status, 400, 'Expected status code should be 400 .');
        // Disable draft after negative test
        this.responses.push(await this.deleteDraft(projectRoleWithDescription1.ID));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create Role/texts with an invalid (null) language code'() {
        const projectRoleText = { ...roleTextWithNullLanguage, ID: projectRoleWithDescription1.ID } as ProjectRoleText;
        await this.enableDraftEdit(projectRoleWithDescription1.ID);
        this.responses.push(await this.create(projectRoleText));
        const response = await this.activateDraft(projectRoleText.ID);
        assert.equal(response.status, 400, 'Expected status code should be 400 (Bad Request).');
        // Disable draft after negative test
        this.responses.push(await this.deleteDraft(projectRoleWithDescription1.ID));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create Role/texts with an invalid (non-existing) language code'() {
        const projectRoleText = { ...roleTextWithNonExistingLanguage, ID: projectRoleWithDescription1.ID } as ProjectRoleText;
        await this.enableDraftEdit(projectRoleWithDescription1.ID);
        this.responses.push(await this.create(projectRoleText));
        const response = await this.activateDraft(projectRoleWithDescription1.ID);
        assert.equal(response.status, 400, 'Expected status code should be 400 (Bad Request).');
        // Disable draft after negative test
        this.responses.push(await this.deleteDraft(projectRoleWithDescription1.ID));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Create Role/texts with an invalid (null) name'() {
        const projectRoleText = { ...roleTextWithNullName, ID: projectRoleWithDescription1.ID } as ProjectRoleText;
        this.responses.push(await this.enableDraftEdit(projectRoleWithDescription1.ID));
        const response = await this.create(projectRoleText);
        this.responses.push(response);
        assert.equal(response.status, 201, 'Expected status code should be 201 (Created), as we are creating a draft');

        const draftActivateResponse = await this.activateDraft(projectRoleWithDescription1.ID);
        this.responses.push(draftActivateResponse);
        assert.equal(draftActivateResponse.status, 400, 'Expected status code should be 400.');
        // Disable draft after negative test
        this.responses.push(await this.deleteDraft(projectRoleWithDescription1.ID));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update the name of an existing inactive role text'() {
        const projectRoleText = { ...correctRoleText, ID: projectRoleWithDescription1.ID } as ProjectRoleText;
        this.responses.push(await this.enableDraftEdit(projectRoleWithDescription1.ID));
        this.responses.push(await this.create(projectRoleText));
        const updatePayload = {
            name: 'Update Name',
        };
        const response = await this.update(`(ID_texts=${projectRoleText.ID_texts},IsActiveEntity=false)`, updatePayload);
        this.responses.push(response);
        assert.equal(response.status, 200, 'Expected status code of role text Update request to be 200 (OK).');

        const responseGet = await this.get(`(ID_texts=${projectRoleText.ID_texts},IsActiveEntity=false)`);
        this.responses.push(responseGet);
        assert.equal(responseGet.status, 200, 'Expected status code of role text reading to be 200 (OK).');
        assert.equal(responseGet.data.name, updatePayload.name, 'Expected new name to be persisted in the role text draft.');
        // Disable draft
        this.responses.push(await this.deleteDraft(projectRoleWithDescription1.ID));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Update the role text with evil name of an existing inactive role text'() {
        const projectRoleText = { ...correctRoleText, ID: projectRoleWithDescription1.ID } as ProjectRoleText;

        const updatePayload = {
            name: '<script src="https://evilpage.de/assets/js/evilScript.js"></script>',
        };
        this.responses.push(await this.enableDraftEdit(projectRoleWithDescription1.ID));
        const response = await this.update(`(ID_texts=${projectRoleText.ID_texts},IsActiveEntity=false)`, updatePayload);
        this.responses.push(response);
        assert.equal(response.status, 400, 'Expected status code of role text Update request to be 400 (BAD REQUEST).');
        // Disable draft
        this.responses.push(await this.deleteDraft(projectRoleWithDescription1.ID));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'DELETE non-existing active role text'() {
        const createdTextId = uuid();
        const response = await this.delete(`(ID_texts=${createdTextId},IsActiveEntity=true)`);
        this.responses.push(response);
        assert.equal(response.status, 404, 'Expected status code of role text deletion to be 404 (NOT FOUND).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'DELETE existing inactive role text'() {
        const projectRoleText = { ...correctRoleText, ID: projectRoleWithDescription1.ID } as ProjectRoleText;
        this.responses.push(await this.enableDraftEdit(projectRoleWithDescription1.ID));
        this.responses.push(await this.create(projectRoleText));
        const response = await this.delete(`(ID_texts=${projectRoleText.ID_texts},IsActiveEntity=false)`);
        this.responses.push(response);
        assert.equal(response.status, 204, 'Expected status code of role text deletion to be 204 (OK).');

        const responseInactive = await this.get(`(ID_texts=${projectRoleText.ID_texts},IsActiveEntity=false)`);
        this.responses.push(responseInactive);
        assert.equal(responseInactive.status, 404, 'Expected status code of inactive role text reading to be 404 (NOT FOUND).');

        const responseActive = await this.get(`(ID_texts=${projectRoleText.ID_texts},IsActiveEntity=true)`);
        this.responses.push(responseActive);
        assert.equal(responseActive.status, 404, 'Expected status code of active role text reading to be 404 (NOT FOUND).');

        this.responses.push(await this.deleteDraft(projectRoleWithDescription1.ID));
    }

    @test(timeout(TEST_TIMEOUT))
    async 'DELETE non-existing inactive role text'() {
        const createdTextId = uuid();
        const response = await this.delete(`(ID_texts=${createdTextId},IsActiveEntity=false)`);
        this.responses.push(response);
        assert.equal(response.status, 404, 'Expected status code of alternative label deletion to be 404 (NOT FOUND).');
    }

    @test(timeout(TEST_TIMEOUT))
    async 'Test Locale swapping'() {
        this.responses.push(await this.enableDraftEdit(projectRoleWithDescription4.ID));

        const responseSwapLocaleToGerman = await this.update(`(ID_texts=${projectRoleWithDescription4En.ID_texts},IsActiveEntity=false)`, { locale: projectRoleWithDescription4De.locale });
        this.responses.push(responseSwapLocaleToGerman);

        const responseSwapLocaleToEnglish = await this.update(`(ID_texts=${projectRoleWithDescription4De.ID_texts},IsActiveEntity=false)`, { locale: projectRoleWithDescription4En.locale });
        this.responses.push(responseSwapLocaleToEnglish);

        const responseActive = await this.activateDraft(projectRoleWithDescription4.ID);
        this.responses.push(responseActive);

        assert.equal(responseSwapLocaleToGerman.status, 200, 'Expected status code of role text to be OK(200). which confirms the role has changes to german');
        assert.equal(responseSwapLocaleToEnglish.status, 200, 'Expected status code of role text to be OK(200). which confirms the role has changed to english');
        assert.equal(responseActive.status, 200, 'Expected status code role activation to be OK(200)');
    }
}
