import { inject, injectable } from "tsyringe";

import { RouteAction, StaticRouter } from "@spt-aki/di/Router";

import { IMPTRaidServerIdRequestData } from "../../models/mpt/routes/raid/IMPTRaidServerIdRequestData";
import { MPTClientCallbacks } from "../../callbacks/MPTClientCallbacks";

@injectable()
export class MPTClientStaticRouter extends StaticRouter {
    constructor(
        @inject("MPTClientCallbacks") protected mptClientCallbacks: MPTClientCallbacks
    ) {
        super([
            new RouteAction(
                "/mpt/client/config",
                (url: string, info: IMPTRaidServerIdRequestData, sessionID: string, output: string): string => {
                    return this.mptClientCallbacks.handleClientConfig(url, info, sessionID);
                }
            )
        ]);
    }
}
