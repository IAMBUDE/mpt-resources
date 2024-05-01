import { inject, injectable } from "tsyringe";

import { INullResponseData } from "@spt-aki/models/eft/httpResponse/INullResponseData";
import { RouteAction, StaticRouter } from "@spt-aki/di/Router";

import { IMPTUpdatePingRequestData } from "../../models/mpt/routes/update/IMPTUpdatePingRequestData";
import { IMPTUpdateSpawnpointRequestData } from "../../models/mpt/routes/update/IMPTUpdateSpawnpointRequestData";
import { IMPTUpdatePlayerspawnRequestData } from "../../models/mpt/routes/update/IMPTUpdatePlayerspawnRequestData";
import { IMPTUpdateSethostRequestData } from "../../models/mpt/routes/update/IMPTUpdateSethostRequestData";
import { IMPTUpdateSetStatusRequestData } from "../../models/mpt/routes/update/IMPTUpdateSetStatusRequestData";
import { MPTUpdateCallbacks } from "../../callbacks/MPTUpdateCallbacks";

@injectable()
export class MPTUpdateStaticRouter extends StaticRouter {
    constructor(
        @inject("MPTUpdateCallbacks") protected mptUpdateCallbacks: MPTUpdateCallbacks
    ) {
        super([
            new RouteAction(
                "/mpt/update/ping",
                (url: string, info: IMPTUpdatePingRequestData, sessionID: string, output: string): INullResponseData => {
                    return this.mptUpdateCallbacks.handlePing(url, info, sessionID);
                }
            ),
            new RouteAction(
                "/mpt/update/spawnpoint",
                (url: string, info: IMPTUpdateSpawnpointRequestData, sessionID: string, output: string): INullResponseData => {
                    return this.mptUpdateCallbacks.handleSpawnpoint(url, info, sessionID);
                }
            ),
            new RouteAction(
                "/mpt/update/playerspawn",
                (url: string, info: IMPTUpdatePlayerspawnRequestData, sessionID: string, output: string): INullResponseData => {
                    return this.mptUpdateCallbacks.handlePlayerspawn(url, info, sessionID);
                }
            ),
            new RouteAction(
                "/mpt/update/sethost",
                (url: string, info: IMPTUpdateSethostRequestData, sessionID: string, output: string): INullResponseData => {
                    return this.mptUpdateCallbacks.handleSethost(url, info, sessionID);
                }
            )
            ,
            new RouteAction(
                "/mpt/update/setstatus",
                (url: string, info: IMPTUpdateSetStatusRequestData, sessionID: string, output: string): INullResponseData => {
                    return this.mptUpdateCallbacks.handleSetStatus(url, info, sessionID);
                }
            )
        ]);
    }
}
