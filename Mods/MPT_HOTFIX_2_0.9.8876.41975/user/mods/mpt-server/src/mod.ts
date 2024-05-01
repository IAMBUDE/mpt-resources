import { DependencyContainer } from "tsyringe";

import { IPreAkiLoadModAsync } from "@spt-aki/models/external/IPreAkiLoadModAsync";

import { Container } from "./di/Container";
import { MPT } from "./MPT";

class Mod implements IPreAkiLoadModAsync {
    public async preAkiLoadAsync(container: DependencyContainer): Promise<void> {
        Container.register(container);

        await container.resolve<MPT>("MPT").preAkiLoad(container);
    }
}

module.exports = { mod: new Mod() };
