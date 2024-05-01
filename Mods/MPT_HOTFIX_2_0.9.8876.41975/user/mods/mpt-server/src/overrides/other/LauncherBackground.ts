import path from "node:path";
import { DependencyContainer, inject, injectable } from "tsyringe";

import { ImageRouter } from "@spt-aki/routers/ImageRouter";

import { Override } from "../../di/Override";
import { MPTConfig } from "../../utils/MPTConfig";

@injectable()
export class LauncherBackgroundOverride extends Override {
    constructor(
        @inject("ImageRouter") protected imageRouter: ImageRouter,
        @inject("MPTConfig") protected mptConfig: MPTConfig
    ) {
        super();
    }

    public execute(container: DependencyContainer): void {
        this.imageRouter.addRoute("/files/launcher/bg", path.join(this.mptConfig.getModPath(), "db/launcher_bg.png"));
    }
}
