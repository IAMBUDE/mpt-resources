import { inject, injectable } from "tsyringe";

import { IMPTConfigClient } from "../models/mpt/config/IMPTConfigClient";

import { MPTConfig } from "../utils/MPTConfig";

@injectable()
export class MPTClientController {
    constructor(
        @inject("MPTConfig") protected mptConfig: MPTConfig
    ) {
        // empty
    }

    /**
     * Handle /mpt/client/config
     */
    public handleClientConfig(): IMPTConfigClient {
        return this.mptConfig.getConfig().client;
    }
}
