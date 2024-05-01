import {MPTMatchStatus} from "../../../enums/MPTMatchStatus"

export interface IMPTUpdateSetStatusRequestData {
    serverId: string;
    status: MPTMatchStatus;
}
