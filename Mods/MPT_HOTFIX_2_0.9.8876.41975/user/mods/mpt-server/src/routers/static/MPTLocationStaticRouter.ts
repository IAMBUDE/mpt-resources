import { inject, injectable } from "tsyringe";

import { IGetRaidConfigurationRequestData } from "@spt-aki/models/eft/match/IGetRaidConfigurationRequestData";
import { RouteAction, StaticRouter } from "@spt-aki/di/Router";

import { MPTLocationCallbacks } from "../../callbacks/MPTLocationCallbacks";

@injectable()
export class MPTLocationStaticRouter extends StaticRouter {
    constructor(
        @inject("MPTLocationCallbacks") protected mptLocationCallbacks: MPTLocationCallbacks
    ) {
        super([
            new RouteAction(
                "/mpt/location/raids",
                (url: string, info: IGetRaidConfigurationRequestData, sessionID: string, output: string): string => {
                    return this.mptLocationCallbacks.handleGetRaids(url, info, sessionID);
                }
            )
        ]);
    }
}
