import { inject, injectable } from "tsyringe";

import { IGetRaidConfigurationRequestData } from "@spt-aki/models/eft/match/IGetRaidConfigurationRequestData";

import { IMPTRaidsResponse } from "../models/mpt/routes/location/IMPTRaidsResponse";
import { MPTMatchService } from "../services/MPTMatchService";

@injectable()
export class MPTLocationController {
    constructor(
        @inject("MPTMatchService") protected mptMatchService: MPTMatchService
    ) {
        // empty
    }

    /**
     * Handle /mpt/location/raids
     * @param request 
     * @returns 
     */
    public handleGetRaids(request: IGetRaidConfigurationRequestData): IMPTRaidsResponse {
        const matches: IMPTRaidsResponse = [];

        for (const [ matchId, match ] of this.mptMatchService.getAllMatches()) {
            matches.push({
                serverId: matchId,
                hostUsername: match.hostUsername,
                playerCount: match.players.size,
                status: match.status,
                location: match.raidConfig.location,
                side: match.side,
                time: match.time
            });
        }

        return matches;
    }
}
