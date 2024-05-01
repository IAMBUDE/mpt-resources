import { MPTMatchStatus } from "../../../../models/enums/MPTMatchStatus";
import { MPTSide } from "../../../../models/enums/MPTSide";
import { MPTTime } from "../../../../models/enums/MPTTime";

export interface IMPTRaidResponse {
    serverId: string;
    hostUsername: string;
    playerCount: number;
    status: MPTMatchStatus
    location: string
    side: MPTSide
    time: MPTTime
}

export type IMPTRaidsResponse = IMPTRaidResponse[];
