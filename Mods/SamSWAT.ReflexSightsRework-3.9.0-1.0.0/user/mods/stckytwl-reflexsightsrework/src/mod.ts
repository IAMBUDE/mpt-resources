import { DependencyContainer } from "tsyringe";
import { IPostSptLoadMod } from "@spt/models/external/IPostSptLoadMod";
import { ILogger } from "@spt/models/spt/utils/ILogger";

class ReflexSightRework implements IPostSptLoadMod 
{
    public postSptLoad(container: DependencyContainer): void
    {
        // get the logger from the server container
        const logger = container.resolve<ILogger>("WinstonLogger");

        logger.info("Loading: ReflexSightRework bundles...");
    }
}

module.exports = {mod: new ReflexSightRework()}