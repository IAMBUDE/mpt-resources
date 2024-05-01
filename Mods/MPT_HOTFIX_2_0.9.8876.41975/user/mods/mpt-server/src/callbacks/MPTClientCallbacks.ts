import { inject, injectable } from "tsyringe";

import { HttpResponseUtil } from "@spt-aki/utils/HttpResponseUtil";

import { IMPTRaidServerIdRequestData } from "../models/mpt/routes/raid/IMPTRaidServerIdRequestData";
import { MPTClientController } from "../controllers/MPTClientController";

@injectable()
export class MPTClientCallbacks {
    constructor(
        @inject("HttpResponseUtil") protected httpResponseUtil: HttpResponseUtil,
        @inject("MPTClientController") protected mptClientController: MPTClientController
    ) {
        // empty
    }

    /** Handle /mpt/client/config */
    public handleClientConfig(url: string, info: IMPTRaidServerIdRequestData, sessionID: string): string {
        return this.httpResponseUtil.noBody(this.mptClientController.handleClientConfig());
    }
}
