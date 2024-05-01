import { inject, injectable } from "tsyringe";

import { INullResponseData } from "@spt-aki/models/eft/httpResponse/INullResponseData";
import { HttpResponseUtil } from "@spt-aki/utils/HttpResponseUtil";

import { IMPTUpdatePingRequestData } from "../models/mpt/routes/update/IMPTUpdatePingRequestData";
import { IMPTUpdatePlayerspawnRequestData } from "../models/mpt/routes/update/IMPTUpdatePlayerspawnRequestData";
import { IMPTUpdateSethostRequestData } from "../models/mpt/routes/update/IMPTUpdateSethostRequestData";
import { IMPTUpdateSpawnpointRequestData } from "../models/mpt/routes/update/IMPTUpdateSpawnpointRequestData";
import { IMPTUpdateSetStatusRequestData } from "../models/mpt/routes/update/IMPTUpdateSetStatusRequestData";
import { MPTUpdateController } from "../controllers/MPTUpdateController";

@injectable()
export class MPTUpdateCallbacks {
    constructor(
        @inject("HttpResponseUtil") protected httpResponseUtil: HttpResponseUtil,
        @inject("MPTUpdateController") protected mptUpdateController: MPTUpdateController
    ) {
        // empty
    }

    /** Handle /mpt/update/ping */
    public handlePing(url: string, info: IMPTUpdatePingRequestData, sessionID: string): INullResponseData {
        this.mptUpdateController.handlePing(info);

        return this.httpResponseUtil.nullResponse();
    }

    /** Handle /mpt/update/spawnpoint */
    public handleSpawnpoint(url: string, info: IMPTUpdateSpawnpointRequestData, sessionID: string): INullResponseData {
        this.mptUpdateController.handleSpawnpoint(info);

        return this.httpResponseUtil.nullResponse();
    }

    /** Handle /mpt/update/playerspawn */
    public handlePlayerspawn(url: string, info: IMPTUpdatePlayerspawnRequestData, sessionID: string): INullResponseData {
        this.mptUpdateController.handlePlayerspawn(info)

        return this.httpResponseUtil.nullResponse();
    }

    /** Handle /mpt/update/sethost */
    public handleSethost(url: string, info: IMPTUpdateSethostRequestData, sessionID: string): INullResponseData {
        this.mptUpdateController.handleSethost(info)

        return this.httpResponseUtil.nullResponse();
    }

    /** Handle /mpt/update/setstatus */
    public handleSetStatus(url: string, info: IMPTUpdateSetStatusRequestData, sessionID: string): INullResponseData {
        this.mptUpdateController.handleSetStatus(info)

        return this.httpResponseUtil.nullResponse();
    }
}
