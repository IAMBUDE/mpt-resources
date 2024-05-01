import path from "node:path";
import { inject, injectable } from "tsyringe";

import { PreAkiModLoader } from "@spt-aki/loaders/PreAkiModLoader";
import { VFS } from "@spt-aki/utils/VFS";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";

import { IMPTConfig } from "../models/mpt/config/IMPTConfig";

import packageJson from "../../package.json";

@injectable()
export class MPTConfig {
    protected modAuthor: string;
    protected modName: string;
    protected modPath: string;
    protected mptConfig: IMPTConfig;

    constructor(
        @inject("PreAkiModLoader") protected preAkiModLoader: PreAkiModLoader,
        @inject("VFS") protected vfs: VFS,
        @inject("JsonUtil") protected jsonUtil: JsonUtil
    ) {
        this.modAuthor = packageJson.author.replace(/\W/g, "").toLowerCase();
        this.modName = packageJson.name.replace(/\W/g, "").toLowerCase();
        this.modPath = this.preAkiModLoader.getModPath(this.getModFolderName());

        this.mptConfig = this.jsonUtil.deserializeJsonC(this.vfs.readFile(path.join(this.modPath, "assets/configs/mpt.jsonc")));
    }

    public getConfig(): IMPTConfig {
        return this.mptConfig;
    }

    public getModFolderName(): string {
        return `${this.modAuthor}-${this.modName}`;
    }

    public getModPath(): string {
        return this.modPath;
    }
}
