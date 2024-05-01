import path from "node:path";
import { DependencyContainer, inject, injectable } from "tsyringe";

import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { ImporterUtil } from "@spt-aki/utils/ImporterUtil";
import { ILocaleBase } from "@spt-aki/models/spt/server/ILocaleBase";

import { Override } from "../../di/Override";
import { MPTConfig } from "../../utils/MPTConfig";

@injectable()
export class LocalesOverride extends Override {
    constructor(
        @inject("DatabaseServer") protected databaseServer: DatabaseServer,
        @inject("ImporterUtil") protected importerUtil: ImporterUtil,
        @inject("MPTConfig") protected mptConfig: MPTConfig
    ) {
        super();
    }

    public async execute(container: DependencyContainer): Promise<void> {
        const database = this.databaseServer.getTables();
        const databasePath = path.join(this.mptConfig.getModPath(), "assets/database/");

        const locales = await this.importerUtil.loadAsync<ILocaleBase>(path.join(databasePath, "locales/"), databasePath);
        database.locales = {...database.locales, ...locales};
    }
}
