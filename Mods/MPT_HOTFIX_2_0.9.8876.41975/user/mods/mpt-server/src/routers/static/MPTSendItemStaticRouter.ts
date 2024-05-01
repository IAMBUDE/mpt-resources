import { inject, injectable } from "tsyringe";

import { RouteAction, StaticRouter } from "@spt-aki/di/Router";

import { IMPTSenditemAvailablereceiversRequestData } from "../../models/mpt/routes/senditem/availablereceivers/IMPTSenditemAvailablereceiversRequestData";
import { MPTSendItemCallbacks } from "../../callbacks/MPTSendItemCallbacks";

@injectable()
export class MPTSendItemStaticRouter extends StaticRouter {
    constructor(
        @inject("MPTSendItemCallbacks") protected mptSendItemCallbacks: MPTSendItemCallbacks
    ) {
        super([
            new RouteAction(
                "/mpt/senditem/availablereceivers",
                (url: string, info: IMPTSenditemAvailablereceiversRequestData, sessionID: string, output: string): string => {
                    return this.mptSendItemCallbacks.handleAvailableReceivers(url, info, sessionID);
                }
            )
        ]);
    }
}
