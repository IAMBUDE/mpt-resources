/* eslint-disable @typescript-eslint/brace-style */
import { DependencyContainer, container } from "tsyringe";

// SPT types
import { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { PreAkiModLoader } from "@spt-aki/loaders/PreAkiModLoader";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { ImageRouter } from "@spt-aki/routers/ImageRouter";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import { ITraderConfig } from "@spt-aki/models/spt/config/ITraderConfig";
import { IRagfairConfig } from "@spt-aki/models/spt/config/IRagfairConfig";
import type {DynamicRouterModService} from "@spt-aki/services/mod/dynamicRouter/DynamicRouterModService";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";
import { RandomUtil } from "@spt-aki/utils/RandomUtil";
import { VFS } from "@spt-aki/utils/VFS";

import { jsonc } from "jsonc";
import fs from "node:fs";
import path from "node:path";

// New trader settings
import { TraderHelper } from "./traderHelpers";
import { FluentAssortConstructor as FluentAssortCreator } from "./fluentTraderAssortCreator";
import { Traders } from "@spt-aki/models/enums/Traders";
import { HashUtil } from "@spt-aki/utils/HashUtil";
import baseJson = require("../db/base.json");
import questJson = require("../db/questassort.json");
import assortJson = require("../db/assort.json");

let realismDetected: boolean;

class Scorpion implements IPreAkiLoadMod, IPostDBLoadMod
{
    private mod: string
    private logger: ILogger
    private traderHelper: TraderHelper
    private fluentAssortCreator: FluentAssortCreator    

    private static vfs = container.resolve<VFS>("VFS");    
    private static config: Config = jsonc.parse(Scorpion.vfs.readFile(path.resolve(__dirname, "../config/config.jsonc")));

    constructor() 
    {
        this.mod = "acidphantasm-scorpion"; // Set name of mod so we can log it to console later
    }
    /**
     * Some work needs to be done prior to SPT code being loaded, registering the profile image + setting trader update time inside the trader config json
     * @param container Dependency container
     */
    public preAkiLoad(container: DependencyContainer): void
    {
        // Get a logger
        this.logger = container.resolve<ILogger>("WinstonLogger");

        // Get SPT code/data we need later
        const dynamicRouterModService = container.resolve<DynamicRouterModService>("DynamicRouterModService");     
        const preAkiModLoader: PreAkiModLoader = container.resolve<PreAkiModLoader>("PreAkiModLoader");   
        const databaseServer: DatabaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const imageRouter: ImageRouter = container.resolve<ImageRouter>("ImageRouter");
        const configServer = container.resolve<ConfigServer>("ConfigServer");
        const hashUtil: HashUtil = container.resolve<HashUtil>("HashUtil");
        const traderConfig: ITraderConfig = configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER);
        const ragfairConfig = configServer.getConfig<IRagfairConfig>(ConfigTypes.RAGFAIR);
        
        // Set config values to local variables for validation & use
        let minRefresh = Scorpion.config.traderRefreshMin;
        let maxRefresh = Scorpion.config.traderRefreshMax;
        const addToFlea = Scorpion.config.addTraderToFlea;
        if (minRefresh >= maxRefresh || maxRefresh <= 2)
        {
            minRefresh = 1800;
            maxRefresh = 3600;
            this.logger.error(`[${this.mod}] [Config Issue] Refresh timers have been reset to default.`);
        }
        
        // Create helper class and use it to register our traders image/icon + set its stock refresh time
        this.traderHelper = new TraderHelper();
        this.fluentAssortCreator = new FluentAssortCreator(hashUtil, this.logger);
        this.traderHelper.registerProfileImage(baseJson, this.mod, preAkiModLoader, imageRouter, "scorpion.jpg");
        this.traderHelper.setTraderUpdateTime(traderConfig, baseJson, minRefresh, maxRefresh);

        // Add trader to trader enum
        Traders[baseJson._id] = baseJson._id;

        // Add trader to flea market
        if (addToFlea)
        {
            ragfairConfig.traders[baseJson._id] = true;
        }
        else
        {
            ragfairConfig.traders[baseJson._id] = false;
        }

        dynamicRouterModService.registerDynamicRouter(
            "ScorpionRefreshStock",
            [
                {
                    url: "/client/items/prices/Scorpion",
                    action: (url, info, sessionId, output) => 
                    {
                        const trader = databaseServer.getTables().traders.Scorpion;
                        const assortItems = trader.assort.items;
                        if (!realismDetected)
                        {
                            if (Scorpion.config.randomizeBuyRestriction)
                            {
                                if (Scorpion.config.debugLogging) {this.logger.info(`[${this.mod}] Refreshing Scorpion Stock with Randomized Buy Restrictions.`);}
                                this.randomizeBuyRestriction(assortItems);
                            }
                            if (Scorpion.config.randomizeStockAvailable)
                            {
                                if (Scorpion.config.debugLogging) {this.logger.info(`[${this.mod}] Refreshing Scorpion Stock with Randomized Stock Availability.`);}
                                this.randomizeStockAvailable(assortItems);
                            }
                        }
                        return output;
                    }
                }
            ],
            "aki"
        );
    }
        
    /**
     * Majority of trader-related work occurs after the aki database has been loaded but prior to SPT code being run
     * @param container Dependency container
     */
    public postDBLoad(container: DependencyContainer): void
    {
        const start = performance.now();

        // Resolve SPT classes we'll use
        const databaseServer: DatabaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const jsonUtil: JsonUtil = container.resolve<JsonUtil>("JsonUtil");
        const logger = container.resolve<ILogger>("WinstonLogger");

        //Set local variables for assortJson
        const assortPriceTable = assortJson.barter_scheme;
        const assortItemTable = assortJson.items;
        const assortLoyaltyTable = assortJson.loyal_level_items;

        //Check Mod Compatibility
        this.modDetection();

        //Update Assort
        if (Scorpion.config.priceMultiplier !== 1){this.setPriceMultiplier(assortPriceTable);}
        if (Scorpion.config.randomizeBuyRestriction){this.randomizeBuyRestriction(assortItemTable);}
        if (Scorpion.config.randomizeStockAvailable){this.randomizeStockAvailable(assortItemTable);}
        if (Scorpion.config.unlimitedStock){this.setUnlimitedStock(assortItemTable);}
        if (Scorpion.config.unlimitedBuyRestriction){this.setUnlimitedBuyRestriction(assortItemTable);}
        if (Scorpion.config.removeLoyaltyRestriction){this.disableLoyaltyRestrictions(assortLoyaltyTable);}

        // Set local variable for assort to pass to traderHelper regardless of priceMultiplier config
        const newAssort = assortJson

        // Get a reference to the database tables
        const tables = databaseServer.getTables();

        // Add new trader to the trader dictionary in DatabaseServer       
        // Add quest assort
        // Add trader to locale file, ensures trader text shows properly on screen
        this.traderHelper.addTraderToDb(baseJson, tables, jsonUtil, newAssort);
        tables.traders[baseJson._id].questassort = questJson;
        this.traderHelper.addTraderToLocales(baseJson, tables, baseJson.name, "Scorpion", baseJson.nickname, baseJson.location, "I'm sellin', what are you buyin'?");

        this.logger.debug(`[${this.mod}] loaded... `);

        const timeTaken = performance.now() - start;
        if (Scorpion.config.debugLogging) {logger.log(`[${this.mod}] Trader load took ${timeTaken.toFixed(3)}ms.`, "green");}
    }
    private setRealismDetection(i: boolean)
    {
        realismDetected = i;
        if (realismDetected && Scorpion.config.randomizeBuyRestriction || realismDetected && Scorpion.config.randomizeStockAvailable)
        {
            this.logger.log(`[${this.mod}] SPT-Realism detected, disabling randomizeBuyRestriction and/or randomizeStockAvailable:`, "yellow");
        }
    }
    private setPriceMultiplier (assortPriceTable)
    {
        let priceMultiplier = Scorpion.config.priceMultiplier;
        if (priceMultiplier <= 0) 
        {
            priceMultiplier = 1;
            this.logger.error(`[${this.mod}] priceMultiplier cannot be set to zero.`)
        }
        for (const itemID in assortPriceTable)
        {
            for (const item of assortPriceTable[itemID])
            {
                if (item[0].count <= 15)
                {
                    if (Scorpion.config.debugLogging) {this.logger.log(`[${this.mod}] itemID: [${itemID}] No price change, it's a barter trade.`, "cyan");}
                    continue;
                }
                const count = item[0].count;
                const newPrice = Math.round(count * priceMultiplier);
                item[0].count = newPrice
                if (Scorpion.config.debugLogging) {this.logger.log(`[${this.mod}] itemID: [${itemID}] Price Changed to: [${newPrice}]`, "cyan");}
            }
        } 
    }
    private randomizeBuyRestriction(assortItemTable)
    {
        const randomUtil: RandomUtil = container.resolve<RandomUtil>("RandomUtil");
        if (!realismDetected) // If realism is not detected, continue, else do nothing
        {
            for (const item in assortItemTable)
            {
                if (assortItemTable[item].parentId !== "hideout")
                {
                    continue // Skip setting count, it's a weapon attachment or armour plate
                }
                const itemID = assortItemTable[item]._id;
                const oldRestriction = assortItemTable[item].upd.BuyRestrictionMax;
                const newRestriction = Math.round(randomUtil.randInt((oldRestriction * 0.5), oldRestriction));
                
                assortItemTable[item].upd.BuyRestrictionMax = newRestriction;
    
                if (Scorpion.config.debugLogging) {this.logger.log(`[${this.mod}] Item: [${itemID}] Buy Restriction Changed to: [${newRestriction}]`, "cyan");}
            }
        }
    }
    private randomizeStockAvailable(assortItemTable)
    {
        const randomUtil: RandomUtil = container.resolve<RandomUtil>("RandomUtil");
        if (!realismDetected) // If realism is not detected, continue, else do nothing
        {
            for (const item in assortItemTable)
            {
                if (assortItemTable[item].parentId !== "hideout")
                {
                    continue // Skip setting count, it's a weapon attachment or armour plate
                }
                const outOfStockRoll = randomUtil.getChance100(Scorpion.config.outOfStockChance);
                
                if (outOfStockRoll)
                {
                    const itemID = assortItemTable[item]._id;
                    assortItemTable[item].upd.StackObjectsCount = 0;

                    if (Scorpion.config.debugLogging) {this.logger.log(`[${this.mod}] Item: [${itemID}] Marked out of stock`, "cyan");}
                } 
                else
                {
                    const itemID = assortItemTable[item]._id;
                    const originalStock = assortItemTable[item].upd.StackObjectsCount;
                    const newStock = randomUtil.randInt(2, (originalStock*0.5));
                    assortItemTable[item].upd.StackObjectsCount = newStock;

                    if (Scorpion.config.debugLogging) {this.logger.log(`[${this.mod}] Item: [${itemID}] Stock Count changed to: [${newStock}]`, "cyan");}
                }
            }
        }
    }
    private setUnlimitedStock(assortItemTable)
    {
        for (const item in assortItemTable)
        {
            if (assortItemTable[item].parentId !== "hideout")
            {
                continue // Skip setting count, it's a weapon attachment or armour plate
            }
            assortItemTable[item].upd.StackObjectsCount = 9999999;
            assortItemTable[item].upd.UnlimitedCount = true;
        }
        if (Scorpion.config.debugLogging) {this.logger.log(`[${this.mod}] Item stock counts are now unlimited`, "cyan");}
    }
    private setUnlimitedBuyRestriction(assortItemTable)
    {
        for (const item in assortItemTable)
        {
            if (assortItemTable[item].parentId !== "hideout")
            {
                continue // Skip setting count, it's a weapon attachment or armour plate
            }
            delete assortItemTable[item].upd.BuyRestrictionMax;
            delete assortItemTable[item].upd.BuyRestrictionCurrent;
        }
        if (Scorpion.config.debugLogging) {this.logger.log(`[${this.mod}] Item buy restrictions are now unlimited`, "cyan");}
    }
    private disableLoyaltyRestrictions(assortLoyaltyTable)
    {
        for (const item in assortLoyaltyTable)
        {
            delete assortLoyaltyTable[item];
        }
        if (Scorpion.config.debugLogging) {this.logger.log(`[${this.mod}] All Loyalty Level requirements are removed`, "cyan");}
    }
    private modDetection()
    {
        // Get SPT classes
        const preAkiModLoader: PreAkiModLoader = container.resolve<PreAkiModLoader>("PreAkiModLoader");

        //Mod Compatibility & Base Detection Variable Resolution
        const vcqlCheck = preAkiModLoader.getImportedModsNames().includes("Virtual's Custom Quest Loader");
        const realismCheck = preAkiModLoader.getImportedModsNames().includes("SPT-Realism");
        const vcqlDllPath = path.resolve(__dirname, "../../../../BepInEx/plugins/VCQLQuestZones.dll");
        const heliCrashSamSWAT = path.resolve(__dirname, "../../../../BepInEx/plugins/SamSWAT.HeliCrash/SamSWAT.HeliCrash.dll");
        const heliCrashTyrian = path.resolve(__dirname, "../../../../BepInEx/plugins/SamSWAT.HeliCrash.TyrianReboot/SamSWAT.HeliCrash.TyrianReboot.dll");
        const heliCrashArys = path.resolve(__dirname, "../../../../BepInEx/plugins/SamSWAT.HeliCrash.ArysReloaded/SamSWAT.HeliCrash.ArysReloaded.dll");
        // VCQL Zones DLL is missing
        if (!fs.existsSync(vcqlDllPath))
        {
            this.logger.error(`[${this.mod}] VCQL Zones DLL missing. Custom Trader quests may not work properly.`);
        }
        // Outdated HeliCrash is installed
        if (fs.existsSync(heliCrashSamSWAT) || fs.existsSync(heliCrashTyrian))
        {
            this.logger.error(`[${this.mod}] Outdated HeliCrash Mod Detected. You will experience issues with Custom Trader quest zones.`);
        }
        // Arys HeliCrash is installed
        if (fs.existsSync(heliCrashArys))
        {
            this.logger.warning(`[${this.mod}] HeliCrash Mod Detected. You may experience issues with Custom Trader quest zones.`);
        }
        // VCQL package.json is missing
        if (!vcqlCheck)
        {
            this.logger.error(`[${this.mod}] VCQL not detected. Install VCQL and re-install ${this.mod}.`);
        }
        // If we need to check for Realism
        if (Scorpion.config.randomizeBuyRestriction || Scorpion.config.randomizeStockAvailable)
        {
            this.setRealismDetection(realismCheck);
        }
        else
        {
            this.setRealismDetection(realismCheck);
        }
    }
}

interface Config 
{
    randomizeStockAvailable: boolean,
    outOfStockChance: number,
    randomizeBuyRestriction: boolean,
    priceMultiplier: number,
    unlimitedStock: boolean,
    unlimitedBuyRestriction: boolean,
    removeLoyaltyRestriction: boolean,
    traderRefreshMin: number,
    traderRefreshMax: number,
    addTraderToFlea: boolean,
    debugLogging: boolean,
}

module.exports = { mod: new Scorpion() }