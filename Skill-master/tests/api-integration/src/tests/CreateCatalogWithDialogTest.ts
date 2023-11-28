import { AxiosInstance } from 'axios';
import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';
import { Catalog, CatalogRepository } from 'test-commons';
import { BaseApiTest, testEnvironment } from '../utils';
import {
  correctCreateCatalogWithDialogParameters, createCatalogWithDialogParametersWithNullCatalogText, createCatalogWithDialogParametersWithNullDescription,
} from './data';

@suite
export class CreateCatalogWithDialogTest extends BaseApiTest {
  private static serviceClient: AxiosInstance;

  private static catalogRepository: CatalogRepository;

  private static createdCatalogs: Catalog[] = [];

  static async before() {
    CreateCatalogWithDialogTest.serviceClient = await testEnvironment.getServiceClient();
    CreateCatalogWithDialogTest.catalogRepository = await testEnvironment.getCatalogRepository();
  }

  async before() {
    this.setCorrelationId(CreateCatalogWithDialogTest.serviceClient);
  }

  async after() {
    super.after();
    await CreateCatalogWithDialogTest.catalogRepository.deleteMany(CreateCatalogWithDialogTest.createdCatalogs);
  }

  @test
  async 'POST to Catalogs/CatalogsService.createCatalogWithDialog with correct data'() {
    const createResponse = await CreateCatalogWithDialogTest.serviceClient.post('/CatalogService/Catalogs/CatalogService.createCatalogWithDialog', correctCreateCatalogWithDialogParameters);
    CreateCatalogWithDialogTest.createdCatalogs.push({ ID: createResponse.data.ID } as Catalog);

    this.response = await CreateCatalogWithDialogTest.serviceClient.get(`/CatalogService/Catalogs(ID=${createResponse.data.ID},IsActiveEntity=false)`);

    assert.equal(createResponse.status, 200, 'Expected status code of catalog creation to be 200 (OK).');
    assert.equal(this.response.status, 200, 'Expected status code of catalog reading to be 200 (OK).');
  }

  @test
  async 'POST to Catalogs/CatalogsService.createCatalogWithDialog with a null name'() {
    this.response = await CreateCatalogWithDialogTest.serviceClient.post('/CatalogService/Catalogs/CatalogService.createCatalogWithDialog', createCatalogWithDialogParametersWithNullCatalogText);
    assert.equal(this.response.status, 400, 'Expected status code of catalog creation to be 400 (BAD REQUEST).');
  }

  @test
  async 'POST to Catalogs/CatalogsService.createCatalogWithDialog with a null description'() {
    this.response = await CreateCatalogWithDialogTest.serviceClient.post('/CatalogService/Catalogs/CatalogService.createCatalogWithDialog', createCatalogWithDialogParametersWithNullDescription);
    assert.equal(this.response.status, 400, 'Expected status code of catalog creation to be 400 (BAD REQUEST).');
  }
}
