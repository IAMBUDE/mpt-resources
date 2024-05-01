import { inject, injectable } from "tsyringe";

import { IMPTUpdatePingRequestData } from "../models/mpt/routes/update/IMPTUpdatePingRequestData";
import { IMPTUpdateSpawnpointRequestData } from "../models/mpt/routes/update/IMPTUpdateSpawnpointRequestData";
import { IMPTUpdatePlayerspawnRequestData } from "../models/mpt/routes/update/IMPTUpdatePlayerspawnRequestData";
import { IMPTUpdateSethostRequestData } from "../models/mpt/routes/update/IMPTUpdateSethostRequestData";
import { IMPTUpdateSetStatusRequestData } from "../models/mpt/routes/update/IMPTUpdateSetStatusRequestData";
import { MPTMatchService } from "../services/MPTMatchService";

@injectable()
export class MPTUpdateController {
    constructor(
        @inject("MPTMatchService") protected mptMatchService: MPTMatchService
    ) {
        // empty
    }

    /**
     * Handle /mpt/update/ping
     * @param request 
     */
    public handlePing(request: IMPTUpdatePingRequestData): void {
        this.mptMatchService.resetTimeout(request.serverId);
    }

    /**
     * Handle /mpt/update/spawnpoint
     * @param request 
     */
    public handleSpawnpoint(request: IMPTUpdateSpawnpointRequestData): void {
        this.mptMatchService.setMatchSpawnPoint(request.serverId, request.name);
    }

    /**
     * Handle /mpt/update/playerspawn
     * @param request 
     */
    public handlePlayerspawn(request: IMPTUpdatePlayerspawnRequestData): void {
        this.mptMatchService.setPlayerGroup(request.serverId, request.profileId, request.groupId);
    }

    /**
     * Handle /mpt/update/sethost
     * @param request 
     */
    public handleSethost(request: IMPTUpdateSethostRequestData): void {
        this.mptMatchService.setMatchHost(request.serverId, request.ip, request.port);
    }

    /**
     * Handle /mpt/update/setstatus
     * @param request 
     */
    public handleSetStatus(request: IMPTUpdateSetStatusRequestData): void {
        this.mptMatchService.setMatchStatus(request.serverId, request.status);
    }
}
