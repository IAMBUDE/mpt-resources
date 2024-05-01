import { inject, injectable } from "tsyringe";

import { INullResponseData } from "@spt-aki/models/eft/httpResponse/INullResponseData";
import { RouteAction, StaticRouter } from "@spt-aki/di/Router";

import { IMPTRaidJoinRequestData } from "../../models/mpt/routes/raid/join/IMPTRaidJoinRequestData";
import { IMPTRaidLeaveRequestData } from "../../models/mpt/routes/raid/leave/IMPTRaidLeaveRequestData";
import { IMPTRaidCreateRequestData } from "../../models/mpt/routes/raid/create/IMPTRaidCreateRequestData";
import { IMPTRaidServerIdRequestData } from "../../models/mpt/routes/raid/IMPTRaidServerIdRequestData";
import { MPTRaidCallbacks } from "../../callbacks/MPTRaidCallbacks";

@injectable()
export class MPTRaidStaticRouter extends StaticRouter {
    constructor(
        @inject("MPTRaidCallbacks") protected mptRaidCallbacks: MPTRaidCallbacks
    ) {
        super([
            new RouteAction(
                "/mpt/raid/create",
                (url: string, info: IMPTRaidCreateRequestData, sessionID: string, output: string): string => {
                    return this.mptRaidCallbacks.handleRaidCreate(url, info, sessionID);
                }
            ),
            new RouteAction(
                "/mpt/raid/join",
                (url: string, info: IMPTRaidJoinRequestData, sessionID: string, output: string): string => {
                    return this.mptRaidCallbacks.handleRaidJoin(url, info, sessionID);
                }
            ),
            new RouteAction(
                "/mpt/raid/leave",
                (url: string, info: IMPTRaidLeaveRequestData, sessionID: string, output: string): INullResponseData => {
                    return this.mptRaidCallbacks.handleRaidLeave(url, info, sessionID);
                }
            ),
            new RouteAction(
                "/mpt/raid/gethost",
                (url: string, info: IMPTRaidServerIdRequestData, sessionID: string, output: string): string => {
                    return this.mptRaidCallbacks.handleRaidGethost(url, info, sessionID);
                }
            ),
            new RouteAction(
                "/mpt/raid/spawnpoint",
                (url: string, info: IMPTRaidServerIdRequestData, sessionID: string, output: string): string => {
                    return this.mptRaidCallbacks.handleRaidSpawnpoint(url, info, sessionID);
                }
            )
        ]);
    }
}
