import { inject, injectable } from "tsyringe";

import { IGetRaidConfigurationRequestData } from "@spt-aki/models/eft/match/IGetRaidConfigurationRequestData";
import { HttpResponseUtil } from "@spt-aki/utils/HttpResponseUtil";

import { MPTLocationController } from "../controllers/MPTLocationController";

@injectable()
export class MPTLocationCallbacks {
    constructor(
        @inject("HttpResponseUtil") protected httpResponseUtil: HttpResponseUtil,
        @inject("MPTLocationController") protected mptLocationController: MPTLocationController
    ) {
        // empty
    }

    /** Handle /mpt/location/raids */
    public handleGetRaids(url: string, info: IGetRaidConfigurationRequestData, sessionID: string): string {
        return this.httpResponseUtil.noBody(this.mptLocationController.handleGetRaids(info));
    }
}
