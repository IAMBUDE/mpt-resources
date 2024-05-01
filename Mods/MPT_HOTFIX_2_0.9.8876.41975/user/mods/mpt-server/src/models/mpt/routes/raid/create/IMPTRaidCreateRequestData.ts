import { IGetRaidConfigurationRequestData } from "@spt-aki/models/eft/match/IGetRaidConfigurationRequestData";
import { MPTSide } from "../../../../enums/MPTSide";
import { MPTTime } from "../../../../enums/MPTTime";

export interface IMPTRaidCreateRequestData {
    serverId: string;
    hostUsername: string;
    timestamp: string;
    settings: IGetRaidConfigurationRequestData;
    expectedNumberOfPlayers: number;
    gameVersion: string;
    mptVersion: string;
    side: MPTSide
    time: MPTTime
}
