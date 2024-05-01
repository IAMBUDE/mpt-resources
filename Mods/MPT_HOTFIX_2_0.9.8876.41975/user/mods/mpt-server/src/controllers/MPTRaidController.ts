import { inject, injectable } from "tsyringe";

import { IMPTRaidCreateRequestData } from "../models/mpt/routes/raid/create/IMPTRaidCreateRequestData";
import { IMPTRaidJoinRequestData } from "../models/mpt/routes/raid/join/IMPTRaidJoinRequestData";
import { IMPTRaidLeaveRequestData } from "../models/mpt/routes/raid/leave/IMPTRaidLeaveRequestData";
import { IMPTRaidServerIdRequestData } from "../models/mpt/routes/raid/IMPTRaidServerIdRequestData";
import { IMPTRaidCreateResponse } from "../models/mpt/routes/raid/create/IMPTRaidCreateResponse";
import { IMPTRaidJoinResponse } from "../models/mpt/routes/raid/join/IMPTRaidJoinResponse";
import { IMPTRaidGethostResponse } from "../models/mpt/routes/raid/gethost/IMPTRaidGethostResponse";
import { IMPTRaidSpawnpointResponse } from "../models/mpt/routes/raid/spawnpoint/IMPTRaidSpawnpointResponse";
import { MPTMatchEndSessionMessage } from "../models/enums/MPTMatchEndSessionMessages";
import { MPTMatchService } from "../services/MPTMatchService";

@injectable()
export class MPTRaidController {
    constructor(
        @inject("MPTMatchService") protected mptMatchService: MPTMatchService
    ) {
        // empty
    }

    /**
     * Handle /mpt/raid/create
     * @param request 
     */
    public handleRaidCreate(request: IMPTRaidCreateRequestData): IMPTRaidCreateResponse {
        return {
            success: this.mptMatchService.createMatch(request)
        };
    }

    /**
     * Handle /mpt/raid/join
     * @param request 
     */
    public handleRaidJoin(request: IMPTRaidJoinRequestData): IMPTRaidJoinResponse {
        this.mptMatchService.addPlayerToMatch(request.serverId, request.profileId, { groupId: null, isDead: false });

        const match = this.mptMatchService.getMatch(request.serverId);

        return {
            serverId: request.serverId,
            timestamp: match.timestamp,
            expectedNumberOfPlayers: match.expectedNumberOfPlayers,
            gameVersion: match.gameVersion,
            mptVersion: match.mptVersion
        };
    }

    /**
     * Handle /mpt/raid/leave
     * @param request 
     */
    public handleRaidLeave(request: IMPTRaidLeaveRequestData): void {
        if (request.serverId === request.profileId) {
            this.mptMatchService.endMatch(request.serverId, MPTMatchEndSessionMessage.HOST_SHUTDOWN_MESSAGE);
            return;
        }

        this.mptMatchService.removePlayerFromMatch(request.serverId, request.profileId);
    }

    /**
     * Handle /mpt/raid/gethost
     * @param request 
     */
    public handleRaidGethost(request: IMPTRaidServerIdRequestData): IMPTRaidGethostResponse {
        const match = this.mptMatchService.getMatch(request.serverId);
        if (!match) {
            return;
        }

        return {
            ip: match.ip,
            port: match.port
        };
    }

    /**
     * Handle /mpt/raid/spawnpoint
     * @param request 
     */
    public handleRaidSpawnpoint(request: IMPTRaidServerIdRequestData): IMPTRaidSpawnpointResponse {
        const match = this.mptMatchService.getMatch(request.serverId);
        if (!match) {
            return;
        }

        return {
            spawnpoint: match.spawnPoint
        };
    }
}
