import { ILocationBase } from "@spt-aki/models/eft/common/ILocationBase";
import { IGetRaidConfigurationRequestData } from "@spt-aki/models/eft/match/IGetRaidConfigurationRequestData";

import { MPTMatchStatus } from "../enums/MPTMatchStatus";
import { MPTSide } from "../enums/MPTSide";
import { MPTTime } from "../enums/MPTTime";
import { IMPTPlayer } from "./IMPTPlayer";

export interface IMPTMatch {
    ip: string;
    port: number;
    hostUsername: string;
    timestamp: string;
    expectedNumberOfPlayers: number;
    mptVersion: string;
    gameVersion: string;
    raidConfig: IGetRaidConfigurationRequestData;
    locationData: ILocationBase;
    status: MPTMatchStatus;
    spawnPoint: string;
    timeout: number;
    players: Map<string, IMPTPlayer>;
    side: MPTSide
    time: MPTTime
}
