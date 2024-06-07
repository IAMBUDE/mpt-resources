import { DependencyContainer } from "tsyringe";

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
import { ITraderAssort, ITraderBase } from "@spt-aki/models/eft/common/tables/ITrader";
import { IRagfairConfig } from "@spt-aki/models/spt/config/IRagfairConfig";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";

// New trader settings
import * as baseJson from "../db/base.json";
import * as questAssort from "../db/questassort.json"
import { TraderHelper } from "./traderHelpers";
import { FluentAssortConstructor } from "./fluentTraderAssortCreator";
import { Money } from "@spt-aki/models/enums/Money";
import { Traders } from "@spt-aki/models/enums/Traders";
import { HashUtil } from "@spt-aki/utils/HashUtil";
import { IDatabaseTables } from "@spt-aki/models/spt/server/IDatabaseTables";
import { ICustomizationItem } from "@spt-aki/models/eft/common/tables/ICustomizationItem";
import * as assortJson from "../db/assort.json";


// Pants Items
import * as artem_pants_1 from "../db/Clothing/Pants/Artem_Pants1/artem_pants.json";
import * as artem_pants_1_suit from "../db/Clothing/Pants/Artem_Pants1/artem_pants_suit.json";
import * as artem_pants_1_locale from "../db/Clothing/Pants/Artem_Pants1/artem_pants_locale.json";

import * as artem_pants_2 from "../db/Clothing/Pants/Artem_Pants2/artem_pants2.json";
import * as artem_pants_2_suit from "../db/Clothing/Pants/Artem_Pants2/artem_pants2_suit.json";
import * as artem_pants_2_locale from "../db/Clothing/Pants/Artem_Pants2/artem_pants2_locale.json";

import * as artem_pants_3 from "../db/Clothing/Pants/Artem_Pants3/artem_pants3.json";
import * as artem_pants_3_suit from "../db/Clothing/Pants/Artem_Pants3/artem_pants3_suit.json";
import * as artem_pants_3_locale from "../db/Clothing/Pants/Artem_Pants3/artem_pants3_locale.json";

import * as artem_pants_4 from "../db/Clothing/Pants/Artem_Pants4/artem_pants4.json";
import * as artem_pants_4_suit from "../db/Clothing/Pants/Artem_Pants4/artem_pants4_suit.json";
import * as artem_pants_4_locale from "../db/Clothing/Pants/Artem_Pants4/artem_pants4_locale.json";

import * as artem_pants_5 from "../db/Clothing/Pants/Artem_Pants5/artem_pants5.json";
import * as artem_pants_5_suit from "../db/Clothing/Pants/Artem_Pants5/artem_pants5_suit.json";
import * as artem_pants_5_locale from "../db/Clothing/Pants/Artem_Pants5/artem_pants5_locale.json";


// Top Items
import * as test_top from "../db/Clothing/Tops/Test_Shirt/test_top.json";
import * as test_top_suit from "../db/Clothing/Tops/Test_Shirt/test_top_suit.json";
import * as test_top_hands from "../db/Clothing/Tops/Test_Shirt/test_top_hands.json";
import * as test_top_locale from "../db/Clothing/Tops/Test_Shirt/test_top_locale.json";

import * as artem_top1 from "../db/Clothing/Tops/Artem_Shit1/artem_top_1.json";
import * as artem_top1_suit from "../db/Clothing/Tops/Artem_Shit1/test_top1_suit.json";
import * as artem_top1_hands from "../db/Clothing/Tops/Artem_Shit1/artem_top1_hands.json";
import * as artem_top1_locale from "../db/Clothing/Tops/Artem_Shit1/artem_top1_locale.json";

import * as artem_top2 from "../db/Clothing/Tops/Artem_Shit2/artem_top_2.json";
import * as artem_top2_suit from "../db/Clothing/Tops/Artem_Shit2/test_top2_suit.json";
import * as artem_top2_hands from "../db/Clothing/Tops/Artem_Shit2/artem_top2_hands.json";
import * as artem_top2_locale from "../db/Clothing/Tops/Artem_Shit2/artem_top2_locale.json";

import * as artem_top3 from "../db/Clothing/Tops/Artem_Shit3/artem_top_3.json";
import * as artem_top3_suit from "../db/Clothing/Tops/Artem_Shit3/artem_top3_suit.json";
import * as artem_top3_hands from "../db/Clothing/Tops/Artem_Shit3/artem_top3_hands.json";
import * as artem_top3_locale from "../db/Clothing/Tops/Artem_Shit3/artem_top3_locale.json";

import * as artem_top4 from "../db/Clothing/Tops/Artem_Shit4/artem_top_4.json";
import * as artem_top4_suit from "../db/Clothing/Tops/Artem_Shit4/artem_top4_suit.json";
import * as artem_top4_hands from "../db/Clothing/Tops/Artem_Shit4/artem_top4_hands.json";
import * as artem_top4_locale from "../db/Clothing/Tops/Artem_Shit4/artem_top4_locale.json";

import * as artem_top5 from "../db/Clothing/Tops/Artem_Shit5/artem_top_5.json";
import * as artem_top5_suit from "../db/Clothing/Tops/Artem_Shit5/artem_top5_suit.json";
import * as artem_top5_hands from "../db/Clothing/Tops/Artem_Shit5/artem_top5_hands.json";
import * as artem_top5_locale from "../db/Clothing/Tops/Artem_Shit5/artem_top5_locale.json";

import * as artem_top6 from "../db/Clothing/Tops/Artem_Shit6/artem_top_6.json";
import * as artem_top6_suit from "../db/Clothing/Tops/Artem_Shit6/artem_top6_suit.json";
import * as artem_top6_hands from "../db/Clothing/Tops/Artem_Shit6/artem_top6_hands.json";
import * as artem_top6_locale from "../db/Clothing/Tops/Artem_Shit6/artem_top6_locale.json";

import * as artem_top7 from "../db/Clothing/Tops/Artem_Shit7/artem_top_7.json";
import * as artem_top7_suit from "../db/Clothing/Tops/Artem_Shit7/artem_top7_suit.json";
import * as artem_top7_hands from "../db/Clothing/Tops/Artem_Shit7/artem_top7_hands.json";
import * as artem_top7_locale from "../db/Clothing/Tops/Artem_Shit7/artem_top7_locale.json";

import * as artem_top8 from "../db/Clothing/Tops/Artem_Shit8/artem_top_8.json";
import * as artem_top8_suit from "../db/Clothing/Tops/Artem_Shit8/artem_top8_suit.json";
import * as artem_top8_hands from "../db/Clothing/Tops/Artem_Shit8/artem_top8_hands.json";
import * as artem_top8_locale from "../db/Clothing/Tops/Artem_Shit8/artem_top8_locale.json";

import * as artem_top9 from "../db/Clothing/Tops/Artem_Shit9/artem_top_9.json";
import * as artem_top9_suit from "../db/Clothing/Tops/Artem_Shit9/artem_top9_suit.json";
import * as artem_top9_hands from "../db/Clothing/Tops/Artem_Shit9/artem_top9_hands.json";
import * as artem_top9_locale from "../db/Clothing/Tops/Artem_Shit9/artem_top9_locale.json";

const tradersuits = require("../db/Clothing/suits.json");



class ArtemTrader implements IPreAkiLoadMod, IPostDBLoadMod
{
    private mod: string
    private logger: ILogger
    private traderHelper: TraderHelper
    private fluentTraderAssortHeper: FluentAssortConstructor

    constructor() {
        this.mod = "AAAArtemTrader"; // Set name of mod so we can log it to console later
    }

    /**
     * Some work needs to be done prior to SPT code being loaded, registering the profile image + setting trader update time inside the trader config json
     * @param container Dependency container
     */
    public preAkiLoad(container: DependencyContainer): void
    {
        // Get a logger
        this.logger = container.resolve<ILogger>("WinstonLogger");
        this.logger.debug(`[${this.mod}] preAki Loading... `);

        // Get SPT code/data we need later
        const preAkiModLoader: PreAkiModLoader = container.resolve<PreAkiModLoader>("PreAkiModLoader");
        const imageRouter: ImageRouter = container.resolve<ImageRouter>("ImageRouter");
        const hashUtil: HashUtil = container.resolve<HashUtil>("HashUtil");
        const configServer = container.resolve<ConfigServer>("ConfigServer");
        const traderConfig: ITraderConfig = configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER);
        const ragfairConfig = configServer.getConfig<IRagfairConfig>(ConfigTypes.RAGFAIR);

        // Create helper class and use it to register our traders image/icon + set its stock refresh time
        this.traderHelper = new TraderHelper();
        this.fluentTraderAssortHeper = new FluentAssortConstructor(hashUtil, this.logger);
        this.traderHelper.registerProfileImage(baseJson, this.mod, preAkiModLoader, imageRouter, "Artem.jpg");
        this.traderHelper.setTraderUpdateTime(traderConfig, baseJson, 3600, 4000);

        // Add trader to trader enum
        Traders[baseJson._id] = baseJson._id;

        // Add trader to flea market
        ragfairConfig.traders[baseJson._id] = true;

        this.logger.debug(`[${this.mod}] preAki Loaded`);
    }
    
    /**
     * Majority of trader-related work occurs after the aki database has been loaded but prior to SPT code being run
     * @param container Dependency container
     */
    public postDBLoad(container: DependencyContainer): void
    {
        this.logger.debug(`[${this.mod}] postDb Loading... `);

        // Resolve SPT classes we'll use
        const databaseServer: DatabaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const configServer: ConfigServer = container.resolve<ConfigServer>("ConfigServer");
        const jsonUtil: JsonUtil = container.resolve<JsonUtil>("JsonUtil");

        // Get a reference to the database tables
        const tables = databaseServer.getTables();

        // Add new trader to the trader dictionary in DatabaseServer - has no assorts (items) yet
        this.traderHelper.addTraderToDb(baseJson, tables, jsonUtil);
        this.addTraderToDb(baseJson, tables, jsonUtil);
        tables.traders[baseJson._id].questassort = questAssort;


        // Adds Artem Pants1 Clothing
        tables.templates.customization[artem_pants_1._id] = artem_pants_1 as ICustomizationItem
        tables.templates.customization[artem_pants_1_suit._id] = artem_pants_1_suit as ICustomizationItem
        this.addClothingItemToLocales(tables, artem_pants_1_suit._id, artem_pants_1_locale.Name, artem_pants_1_locale.ShortName, artem_pants_1_locale.Description);

        // Adds Artem Pants2 Clothing
        tables.templates.customization[artem_pants_2._id] = artem_pants_2 as ICustomizationItem
        tables.templates.customization[artem_pants_2_suit._id] = artem_pants_2_suit as ICustomizationItem
        this.addClothingItemToLocales(tables, artem_pants_2_suit._id, artem_pants_2_locale.Name, artem_pants_2_locale.ShortName, artem_pants_2_locale.Description);

        // Adds Artem Pants3 Clothing
        tables.templates.customization[artem_pants_3._id] = artem_pants_3 as ICustomizationItem
        tables.templates.customization[artem_pants_3_suit._id] = artem_pants_3_suit as ICustomizationItem
        this.addClothingItemToLocales(tables, artem_pants_3_suit._id, artem_pants_3_locale.Name, artem_pants_3_locale.ShortName, artem_pants_3_locale.Description);

        // Adds Artem Pants4 Clothing
        tables.templates.customization[artem_pants_4._id] = artem_pants_4 as ICustomizationItem
        tables.templates.customization[artem_pants_4_suit._id] = artem_pants_4_suit as ICustomizationItem
        this.addClothingItemToLocales(tables, artem_pants_4_suit._id, artem_pants_4_locale.Name, artem_pants_4_locale.ShortName, artem_pants_4_locale.Description);

        // Adds Artem Pants5 Clothing
        tables.templates.customization[artem_pants_5._id] = artem_pants_5 as ICustomizationItem
        tables.templates.customization[artem_pants_5_suit._id] = artem_pants_5_suit as ICustomizationItem
        this.addClothingItemToLocales(tables, artem_pants_5_suit._id, artem_pants_5_locale.Name, artem_pants_5_locale.ShortName, artem_pants_5_locale.Description);

        // Adds test shirt Clothing
        tables.templates.customization[test_top._id] = test_top as ICustomizationItem
        tables.templates.customization[test_top_hands._id] = test_top_hands as ICustomizationItem
        tables.templates.customization[test_top_suit._id] = test_top_suit as ICustomizationItem
        this.addClothingItemToLocales(tables, test_top_suit._id, test_top_locale.Name, test_top_locale.ShortName, test_top_locale.Description);

        // Adds artem shirt1 Clothing
        tables.templates.customization[artem_top1._id] = artem_top1 as ICustomizationItem
        tables.templates.customization[artem_top1_hands._id] = artem_top1_hands as ICustomizationItem
        tables.templates.customization[artem_top1_suit._id] = artem_top1_suit as ICustomizationItem
        this.addClothingItemToLocales(tables, artem_top1_suit._id, artem_top1_locale.Name, artem_top1_locale.ShortName, artem_top1_locale.Description);

        // Adds artem shirt2 Clothing
        tables.templates.customization[artem_top2._id] = artem_top2 as ICustomizationItem
        tables.templates.customization[artem_top2_hands._id] = artem_top2_hands as ICustomizationItem
        tables.templates.customization[artem_top2_suit._id] = artem_top2_suit as ICustomizationItem
        this.addClothingItemToLocales(tables, artem_top2_suit._id, artem_top2_locale.Name, artem_top2_locale.ShortName, artem_top2_locale.Description);

        // Adds artem shirt3 Clothing
        tables.templates.customization[artem_top3._id] = artem_top3 as ICustomizationItem
        tables.templates.customization[artem_top3_hands._id] = artem_top3_hands as ICustomizationItem
        tables.templates.customization[artem_top3_suit._id] = artem_top3_suit as ICustomizationItem
        this.addClothingItemToLocales(tables, artem_top3_suit._id, artem_top3_locale.Name, artem_top3_locale.ShortName, artem_top3_locale.Description);

        // Adds artem shirt4 Clothing
        tables.templates.customization[artem_top4._id] = artem_top4 as ICustomizationItem
        tables.templates.customization[artem_top4_hands._id] = artem_top4_hands as ICustomizationItem
        tables.templates.customization[artem_top4_suit._id] = artem_top4_suit as ICustomizationItem
        this.addClothingItemToLocales(tables, artem_top4_suit._id, artem_top4_locale.Name, artem_top4_locale.ShortName, artem_top4_locale.Description);

        // Adds artem shirt5 Clothing
        tables.templates.customization[artem_top5._id] = artem_top5 as ICustomizationItem
        tables.templates.customization[artem_top5_hands._id] = artem_top5_hands as ICustomizationItem
        tables.templates.customization[artem_top5_suit._id] = artem_top5_suit as ICustomizationItem
        this.addClothingItemToLocales(tables, artem_top5_suit._id, artem_top5_locale.Name, artem_top5_locale.ShortName, artem_top5_locale.Description);

        // Adds artem shirt6 Clothing
        tables.templates.customization[artem_top6._id] = artem_top6 as ICustomizationItem
        tables.templates.customization[artem_top6_hands._id] = artem_top6_hands as ICustomizationItem
        tables.templates.customization[artem_top6_suit._id] = artem_top6_suit as ICustomizationItem
        this.addClothingItemToLocales(tables, artem_top6_suit._id, artem_top6_locale.Name, artem_top6_locale.ShortName, artem_top6_locale.Description);

        // Adds artem shirt7 Clothing
        tables.templates.customization[artem_top7._id] = artem_top7 as ICustomizationItem
        tables.templates.customization[artem_top7_hands._id] = artem_top7_hands as ICustomizationItem
        tables.templates.customization[artem_top7_suit._id] = artem_top7_suit as ICustomizationItem
        this.addClothingItemToLocales(tables, artem_top7_suit._id, artem_top7_locale.Name, artem_top7_locale.ShortName, artem_top7_locale.Description);

        // Adds artem shirt8 Clothing
        tables.templates.customization[artem_top8._id] = artem_top8 as ICustomizationItem
        tables.templates.customization[artem_top8_hands._id] = artem_top8_hands as ICustomizationItem
        tables.templates.customization[artem_top8_suit._id] = artem_top8_suit as ICustomizationItem
        this.addClothingItemToLocales(tables, artem_top8_suit._id, artem_top8_locale.Name, artem_top8_locale.ShortName, artem_top8_locale.Description);

        // Adds artem shirt9 Clothing
        tables.templates.customization[artem_top9._id] = artem_top9 as ICustomizationItem
        tables.templates.customization[artem_top9_hands._id] = artem_top9_hands as ICustomizationItem
        tables.templates.customization[artem_top9_suit._id] = artem_top9_suit as ICustomizationItem
        this.addClothingItemToLocales(tables, artem_top9_suit._id, artem_top9_locale.Name, artem_top9_locale.ShortName, artem_top9_locale.Description);

        tables.traders["ArtemTrader"].suits = tradersuits;  

        //adds Five seven loyalty 2
        this.fluentTraderAssortHeper.createComplexAssortItem(tables.globals.ItemPresets["5d51290186f77419093e7c24"]._items)
                                    .addStackCount(2580)
                                    .addBuyRestriction(6)
                                    .addMoneyCost(Money.ROUBLES, 19432)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);


        // Add trader to locale file, ensures trader text shows properly on screen
        // WARNING: adds the same text to ALL locales (e.g. chinese/french/english)
        this.traderHelper.addTraderToLocales(baseJson, tables, baseJson.name, "Artem", baseJson.nickname, baseJson.location, "[REDACTED]");

        this.logger.debug(`[${this.mod}] postDb Loaded`);
    }

    private  addTraderToDb(traderDetailsToAdd: any, tables: IDatabaseTables, jsonUtil: JsonUtil): void
    {
        // Add trader to trader table, key is the traders id
        tables.traders[traderDetailsToAdd._id] = {
            assort: jsonUtil.deserialize(jsonUtil.serialize(assortJson)) as ITraderAssort, // assorts are the 'offers' trader sells, can be a single item (e.g. carton of milk) or multiple items as a collection (e.g. a gun)
            base: jsonUtil.deserialize(jsonUtil.serialize(traderDetailsToAdd)) as ITraderBase,
            questassort: {
                started: {},
                success: {},
                fail: {}
            } // Empty object as trader has no assorts unlocked by quests
        };
    }

    private addClothingItemToLocales(tables: IDatabaseTables, ClothingTpl: string, name: string, shortName: string, Description: string) {
        // For each language, add locale for the new trader
        const locales = Object.values(tables.locales.global) as Record<string, string>[];
        for (const locale of locales) {
            locale[`${ClothingTpl} Name`] = name;
            locale[`${ClothingTpl} ShortName`] = shortName;
            locale[`${ClothingTpl} Description`] = Description;
        }
    }

}

module.exports = { mod: new ArtemTrader() }