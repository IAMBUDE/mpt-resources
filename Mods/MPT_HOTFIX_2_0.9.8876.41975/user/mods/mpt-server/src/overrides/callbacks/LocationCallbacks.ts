import { DependencyContainer, inject, injectable } from "tsyringe";

import { LocationCallbacks } from "@spt-aki/callbacks/LocationCallbacks";
import { LocationController } from "@spt-aki/controllers/LocationController";
import { IGetLocationRequestData } from "@spt-aki/models/eft/location/IGetLocationRequestData";
import { HttpResponseUtil } from "@spt-aki/utils/HttpResponseUtil";
import { MPTMatchService } from "../../services/MPTMatchService";

import { Override } from "../../di/Override";

@injectable()
export class LocationCallbacksOverride extends Override {
    constructor(
        @inject("LocationController") protected locationController: LocationController,
        @inject("HttpResponseUtil") protected httpResponseUtil: HttpResponseUtil,
        @inject("MPTMatchService") protected mptMatchService: MPTMatchService
    ) {
        super();
    }

    public execute(container: DependencyContainer): void {
        container.afterResolution("LocationCallbacks", (_t, result: LocationCallbacks) => {
            result.getLocation = (url: string, info: IGetLocationRequestData, sessionId: string) => {
                const matchId = this.mptMatchService.getMatchIdByProfile(sessionId);

                if (matchId === undefined) {
                    // player isn't in a MPT match, generate new loot
                    return this.httpResponseUtil.getBody(this.locationController.get(sessionId, info));
                }

                // player is in a MPT match, use match location loot
                const match = this.mptMatchService.getMatch(matchId);
                return this.httpResponseUtil.getBody(match.locationData);
            }
        });
    }
}
