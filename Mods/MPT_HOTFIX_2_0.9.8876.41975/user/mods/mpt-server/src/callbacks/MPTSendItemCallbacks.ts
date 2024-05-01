import { inject, injectable } from "tsyringe";

import { IPmcData } from "@spt-aki/models/eft/common/IPmcData";
import { IItemEventRouterResponse } from "@spt-aki/models/eft/itemEvent/IItemEventRouterResponse";
import { HttpResponseUtil } from "@spt-aki/utils/HttpResponseUtil";

import { IMPTSendItemRequestData } from "../models/mpt/routes/senditem/IMPTSendItemRequestData";
import { IMPTSenditemAvailablereceiversRequestData } from "../models/mpt/routes/senditem/availablereceivers/IMPTSenditemAvailablereceiversRequestData";
import { MPTSendItemController } from "../controllers/MPTSendItemController";

@injectable()
export class MPTSendItemCallbacks {
    constructor(
        @inject("HttpResponseUtil") protected httpResponseUtil: HttpResponseUtil,
        @inject("MPTSendItemController") protected mptSendItemController: MPTSendItemController
    ) {
        // empty
    }

    public handleSendItem(pmcData: IPmcData, body: IMPTSendItemRequestData, sessionID: string): IItemEventRouterResponse {
        return this.mptSendItemController.sendItem(pmcData, body, sessionID);
    }

    /** Handle /mpt/senditem/availablereceivers */
    public handleAvailableReceivers(url: string, info: IMPTSenditemAvailablereceiversRequestData, sessionID: string): string {
        return this.httpResponseUtil.noBody(this.mptSendItemController.handleAvailableReceivers(sessionID));
    }
}
