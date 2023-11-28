import { OneMDSDeltaTokenInfo } from "test-commons";

let oneMDSDeltaTokenInfos: OneMDSDeltaTokenInfo[] = [];

let costCenterToken: OneMDSDeltaTokenInfo = {
    entityName: 'sap.odm.finance.CostCenter',
    deltaToken: 'CostCenterDeltaToken',
}
	
oneMDSDeltaTokenInfos.push(costCenterToken);

export { oneMDSDeltaTokenInfos };
