import { inject, injectable } from "tsyringe";

import { INullResponseData } from "@spt-aki/models/eft/httpResponse/INullResponseData";
import { HttpResponseUtil } from "@spt-aki/utils/HttpResponseUtil";

import { IMPTRaidCreateRequestData } from "../models/mpt/routes/raid/create/IMPTRaidCreateRequestData";
import { IMPTRaidJoinRequestData } from "../models/mpt/routes/raid/join/IMPTRaidJoinRequestData";
import { IMPTRaidLeaveRequestData } from "../models/mpt/routes/raid/leave/IMPTRaidLeaveRequestData";
import { IMPTRaidServerIdRequestData } from "../models/mpt/routes/raid/IMPTRaidServerIdRequestData";
import { MPTRaidController } from "../controllers/MPTRaidController";

@injectable()
export class MPTRaidCallbacks {
    constructor(
        @inject("HttpResponseUtil") protected httpResponseUtil: HttpResponseUtil,
        @inject("MPTRaidController") protected mptRaidController: MPTRaidController
    ) {
        // empty
    }

    /** Handle /mpt/raid/create */
    public handleRaidCreate(url: string, info: IMPTRaidCreateRequestData, sessionID: string): string {
        return this.httpResponseUtil.noBody(this.mptRaidController.handleRaidCreate(info));
    }

    /** Handle /mpt/raid/join */
    public handleRaidJoin(url: string, info: IMPTRaidJoinRequestData, sessionID: string): string {
        return this.httpResponseUtil.noBody(this.mptRaidController.handleRaidJoin(info));
    }

    /** Handle /mpt/raid/leave */
    public handleRaidLeave(url: string, info: IMPTRaidLeaveRequestData, sessionID: string): INullResponseData {
        this.mptRaidController.handleRaidLeave(info);

        return this.httpResponseUtil.nullResponse();
    }

    /** Handle /mpt/raid/gethost */
    public handleRaidGethost(url: string, info: IMPTRaidServerIdRequestData, sessionID: string): string {
        return this.httpResponseUtil.noBody(this.mptRaidController.handleRaidGethost(info));
    }

    /** Handle /mpt/raid/spawnpoint */
    public handleRaidSpawnpoint(url: string, info: IMPTRaidServerIdRequestData, sessionID: string): string {
        return this.httpResponseUtil.noBody(this.mptRaidController.handleRaidSpawnpoint(info));
    }
}
