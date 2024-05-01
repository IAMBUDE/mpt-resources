import { inject, injectable } from "tsyringe";

import { IItemEventRouterResponse } from "@spt-aki/models/eft/itemEvent/IItemEventRouterResponse";
import { IPmcData } from "@spt-aki/models/eft/common/IPmcData";
import { HandledRoute, ItemEventRouterDefinition } from "@spt-aki/di/Router";

import { MPTSendItemCallbacks } from "../../callbacks/MPTSendItemCallbacks";

@injectable()
export class MPTItemEventRouter extends ItemEventRouterDefinition {
    constructor(
        @inject("MPTSendItemCallbacks") protected mptSendItemCallbacks: MPTSendItemCallbacks
    ) {
        super();
    }

    public override getHandledRoutes(): HandledRoute[] {
        return [
            new HandledRoute("SendToPlayer", false)
        ];
    }

    public handleItemEvent(url: string, pmcData: IPmcData, body: any, sessionID: string): IItemEventRouterResponse {
        switch (url) {
            case "SendToPlayer":
                return this.mptSendItemCallbacks.handleSendItem(pmcData, body, sessionID);
        }
    }
}
