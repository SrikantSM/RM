/**
 * Specific implementation of Create Assignment API calls
 * Other Objects which require chain of APIs to be called (draft scenarios)
 * may use this implementation as the reference.
 */
 
import { testEnvironment } from "../utils";
import { AxiosInstance } from "axios";
import { assert } from "chai";
import { AbstractBaseService } from "./AbstractBaseService";

export class Assignment extends AbstractBaseService {
    private assignmentServiceClient: AxiosInstance | undefined;

    public async setup(){
        if(!this.assignmentServiceClient){
            this.assignmentServiceClient = await testEnvironment.getAssignmentServiceClient();
        } 
    };

    public async runAPIs(payload: {resourceId: string, resourceRequestId: string, start: string, end: string, duration: string}){
        if(this.assignmentServiceClient){
            //1. Simulate new assignment
            console.log('Simulating Assignment creation for Resource ' + payload.resourceId + ' & Resource Request ' + payload.resourceRequestId);
            let response = await this.assignmentServiceClient.post('/SimulateAsgBasedOnTotalHours', payload);
            assert.equal(response.status, 200, 'Could not Simluate Assignment creation for payload {' + JSON.stringify(payload) + "}");
            //2. Create Draft from the simulation
            delete response.data["@context"];
            const payloadForDraftCreation = response.data;
            console.log('Creating Assignment Draft for Resource ' + payload.resourceId + ' & Resrouce Request ' + payload.resourceRequestId);
            const draftCreateResponse = await this.assignmentServiceClient.post('/Assignments', payloadForDraftCreation);
            assert.equal(draftCreateResponse.status, 201, 'Assignment Draft could not be created.');
            //3. Activate Draft 
            const payloadForDraftActivation = {};
            console.log('Activating Assignment Draft ' + draftCreateResponse.data.ID);
            const draftActivationActionResponseResMgr = await this.assignmentServiceClient.post('/Assignments(ID=' + draftCreateResponse.data.ID + ',IsActiveEntity=false)/AssignmentService.draftActivate', payloadForDraftActivation);
            assert.equal(draftActivationActionResponseResMgr.status, 200, 'assignment Draft ' + draftCreateResponse.data.ID + ' could not be activated');
        } else {
            console.error('Do not forget to call the setup first asynchronously!')
        }
      }
}