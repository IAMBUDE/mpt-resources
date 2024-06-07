"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
// New trader settings
const baseJson = __importStar(require("../db/base.json"));
const questAssort = __importStar(require("../db/questassort.json"));
const traderHelpers_1 = require("./traderHelpers");
const fluentTraderAssortCreator_1 = require("./fluentTraderAssortCreator");
const Money_1 = require("C:/snapshot/project/obj/models/enums/Money");
const Traders_1 = require("C:/snapshot/project/obj/models/enums/Traders");
const assortJson = __importStar(require("../db/assort.json"));
// Pants Items
const artem_pants_1 = __importStar(require("../db/Clothing/Pants/Artem_Pants1/artem_pants.json"));
const artem_pants_1_suit = __importStar(require("../db/Clothing/Pants/Artem_Pants1/artem_pants_suit.json"));
const artem_pants_1_locale = __importStar(require("../db/Clothing/Pants/Artem_Pants1/artem_pants_locale.json"));
const artem_pants_2 = __importStar(require("../db/Clothing/Pants/Artem_Pants2/artem_pants2.json"));
const artem_pants_2_suit = __importStar(require("../db/Clothing/Pants/Artem_Pants2/artem_pants2_suit.json"));
const artem_pants_2_locale = __importStar(require("../db/Clothing/Pants/Artem_Pants2/artem_pants2_locale.json"));
const artem_pants_3 = __importStar(require("../db/Clothing/Pants/Artem_Pants3/artem_pants3.json"));
const artem_pants_3_suit = __importStar(require("../db/Clothing/Pants/Artem_Pants3/artem_pants3_suit.json"));
const artem_pants_3_locale = __importStar(require("../db/Clothing/Pants/Artem_Pants3/artem_pants3_locale.json"));
const artem_pants_4 = __importStar(require("../db/Clothing/Pants/Artem_Pants4/artem_pants4.json"));
const artem_pants_4_suit = __importStar(require("../db/Clothing/Pants/Artem_Pants4/artem_pants4_suit.json"));
const artem_pants_4_locale = __importStar(require("../db/Clothing/Pants/Artem_Pants4/artem_pants4_locale.json"));
const artem_pants_5 = __importStar(require("../db/Clothing/Pants/Artem_Pants5/artem_pants5.json"));
const artem_pants_5_suit = __importStar(require("../db/Clothing/Pants/Artem_Pants5/artem_pants5_suit.json"));
const artem_pants_5_locale = __importStar(require("../db/Clothing/Pants/Artem_Pants5/artem_pants5_locale.json"));
// Top Items
const test_top = __importStar(require("../db/Clothing/Tops/Test_Shirt/test_top.json"));
const test_top_suit = __importStar(require("../db/Clothing/Tops/Test_Shirt/test_top_suit.json"));
const test_top_hands = __importStar(require("../db/Clothing/Tops/Test_Shirt/test_top_hands.json"));
const test_top_locale = __importStar(require("../db/Clothing/Tops/Test_Shirt/test_top_locale.json"));
const artem_top1 = __importStar(require("../db/Clothing/Tops/Artem_Shit1/artem_top_1.json"));
const artem_top1_suit = __importStar(require("../db/Clothing/Tops/Artem_Shit1/test_top1_suit.json"));
const artem_top1_hands = __importStar(require("../db/Clothing/Tops/Artem_Shit1/artem_top1_hands.json"));
const artem_top1_locale = __importStar(require("../db/Clothing/Tops/Artem_Shit1/artem_top1_locale.json"));
const artem_top2 = __importStar(require("../db/Clothing/Tops/Artem_Shit2/artem_top_2.json"));
const artem_top2_suit = __importStar(require("../db/Clothing/Tops/Artem_Shit2/test_top2_suit.json"));
const artem_top2_hands = __importStar(require("../db/Clothing/Tops/Artem_Shit2/artem_top2_hands.json"));
const artem_top2_locale = __importStar(require("../db/Clothing/Tops/Artem_Shit2/artem_top2_locale.json"));
const artem_top3 = __importStar(require("../db/Clothing/Tops/Artem_Shit3/artem_top_3.json"));
const artem_top3_suit = __importStar(require("../db/Clothing/Tops/Artem_Shit3/artem_top3_suit.json"));
const artem_top3_hands = __importStar(require("../db/Clothing/Tops/Artem_Shit3/artem_top3_hands.json"));
const artem_top3_locale = __importStar(require("../db/Clothing/Tops/Artem_Shit3/artem_top3_locale.json"));
const artem_top4 = __importStar(require("../db/Clothing/Tops/Artem_Shit4/artem_top_4.json"));
const artem_top4_suit = __importStar(require("../db/Clothing/Tops/Artem_Shit4/artem_top4_suit.json"));
const artem_top4_hands = __importStar(require("../db/Clothing/Tops/Artem_Shit4/artem_top4_hands.json"));
const artem_top4_locale = __importStar(require("../db/Clothing/Tops/Artem_Shit4/artem_top4_locale.json"));
const artem_top5 = __importStar(require("../db/Clothing/Tops/Artem_Shit5/artem_top_5.json"));
const artem_top5_suit = __importStar(require("../db/Clothing/Tops/Artem_Shit5/artem_top5_suit.json"));
const artem_top5_hands = __importStar(require("../db/Clothing/Tops/Artem_Shit5/artem_top5_hands.json"));
const artem_top5_locale = __importStar(require("../db/Clothing/Tops/Artem_Shit5/artem_top5_locale.json"));
const artem_top6 = __importStar(require("../db/Clothing/Tops/Artem_Shit6/artem_top_6.json"));
const artem_top6_suit = __importStar(require("../db/Clothing/Tops/Artem_Shit6/artem_top6_suit.json"));
const artem_top6_hands = __importStar(require("../db/Clothing/Tops/Artem_Shit6/artem_top6_hands.json"));
const artem_top6_locale = __importStar(require("../db/Clothing/Tops/Artem_Shit6/artem_top6_locale.json"));
const artem_top7 = __importStar(require("../db/Clothing/Tops/Artem_Shit7/artem_top_7.json"));
const artem_top7_suit = __importStar(require("../db/Clothing/Tops/Artem_Shit7/artem_top7_suit.json"));
const artem_top7_hands = __importStar(require("../db/Clothing/Tops/Artem_Shit7/artem_top7_hands.json"));
const artem_top7_locale = __importStar(require("../db/Clothing/Tops/Artem_Shit7/artem_top7_locale.json"));
const artem_top8 = __importStar(require("../db/Clothing/Tops/Artem_Shit8/artem_top_8.json"));
const artem_top8_suit = __importStar(require("../db/Clothing/Tops/Artem_Shit8/artem_top8_suit.json"));
const artem_top8_hands = __importStar(require("../db/Clothing/Tops/Artem_Shit8/artem_top8_hands.json"));
const artem_top8_locale = __importStar(require("../db/Clothing/Tops/Artem_Shit8/artem_top8_locale.json"));
const artem_top9 = __importStar(require("../db/Clothing/Tops/Artem_Shit9/artem_top_9.json"));
const artem_top9_suit = __importStar(require("../db/Clothing/Tops/Artem_Shit9/artem_top9_suit.json"));
const artem_top9_hands = __importStar(require("../db/Clothing/Tops/Artem_Shit9/artem_top9_hands.json"));
const artem_top9_locale = __importStar(require("../db/Clothing/Tops/Artem_Shit9/artem_top9_locale.json"));
const tradersuits = require("../db/Clothing/suits.json");
class ArtemTrader {
    mod;
    logger;
    traderHelper;
    fluentTraderAssortHeper;
    constructor() {
        this.mod = "AAAArtemTrader"; // Set name of mod so we can log it to console later
    }
    /**
     * Some work needs to be done prior to SPT code being loaded, registering the profile image + setting trader update time inside the trader config json
     * @param container Dependency container
     */
    preAkiLoad(container) {
        // Get a logger
        this.logger = container.resolve("WinstonLogger");
        this.logger.debug(`[${this.mod}] preAki Loading... `);
        // Get SPT code/data we need later
        const preAkiModLoader = container.resolve("PreAkiModLoader");
        const imageRouter = container.resolve("ImageRouter");
        const hashUtil = container.resolve("HashUtil");
        const configServer = container.resolve("ConfigServer");
        const traderConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.TRADER);
        const ragfairConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.RAGFAIR);
        // Create helper class and use it to register our traders image/icon + set its stock refresh time
        this.traderHelper = new traderHelpers_1.TraderHelper();
        this.fluentTraderAssortHeper = new fluentTraderAssortCreator_1.FluentAssortConstructor(hashUtil, this.logger);
        this.traderHelper.registerProfileImage(baseJson, this.mod, preAkiModLoader, imageRouter, "Artem.jpg");
        this.traderHelper.setTraderUpdateTime(traderConfig, baseJson, 3600, 4000);
        // Add trader to trader enum
        Traders_1.Traders[baseJson._id] = baseJson._id;
        // Add trader to flea market
        ragfairConfig.traders[baseJson._id] = true;
        this.logger.debug(`[${this.mod}] preAki Loaded`);
    }
    /**
     * Majority of trader-related work occurs after the aki database has been loaded but prior to SPT code being run
     * @param container Dependency container
     */
    postDBLoad(container) {
        this.logger.debug(`[${this.mod}] postDb Loading... `);
        // Resolve SPT classes we'll use
        const databaseServer = container.resolve("DatabaseServer");
        const configServer = container.resolve("ConfigServer");
        const jsonUtil = container.resolve("JsonUtil");
        // Get a reference to the database tables
        const tables = databaseServer.getTables();
        // Add new trader to the trader dictionary in DatabaseServer - has no assorts (items) yet
        this.traderHelper.addTraderToDb(baseJson, tables, jsonUtil);
        this.addTraderToDb(baseJson, tables, jsonUtil);
        tables.traders[baseJson._id].questassort = questAssort;
        // Adds Artem Pants1 Clothing
        tables.templates.customization[artem_pants_1._id] = artem_pants_1;
        tables.templates.customization[artem_pants_1_suit._id] = artem_pants_1_suit;
        this.addClothingItemToLocales(tables, artem_pants_1_suit._id, artem_pants_1_locale.Name, artem_pants_1_locale.ShortName, artem_pants_1_locale.Description);
        // Adds Artem Pants2 Clothing
        tables.templates.customization[artem_pants_2._id] = artem_pants_2;
        tables.templates.customization[artem_pants_2_suit._id] = artem_pants_2_suit;
        this.addClothingItemToLocales(tables, artem_pants_2_suit._id, artem_pants_2_locale.Name, artem_pants_2_locale.ShortName, artem_pants_2_locale.Description);
        // Adds Artem Pants3 Clothing
        tables.templates.customization[artem_pants_3._id] = artem_pants_3;
        tables.templates.customization[artem_pants_3_suit._id] = artem_pants_3_suit;
        this.addClothingItemToLocales(tables, artem_pants_3_suit._id, artem_pants_3_locale.Name, artem_pants_3_locale.ShortName, artem_pants_3_locale.Description);
        // Adds Artem Pants4 Clothing
        tables.templates.customization[artem_pants_4._id] = artem_pants_4;
        tables.templates.customization[artem_pants_4_suit._id] = artem_pants_4_suit;
        this.addClothingItemToLocales(tables, artem_pants_4_suit._id, artem_pants_4_locale.Name, artem_pants_4_locale.ShortName, artem_pants_4_locale.Description);
        // Adds Artem Pants5 Clothing
        tables.templates.customization[artem_pants_5._id] = artem_pants_5;
        tables.templates.customization[artem_pants_5_suit._id] = artem_pants_5_suit;
        this.addClothingItemToLocales(tables, artem_pants_5_suit._id, artem_pants_5_locale.Name, artem_pants_5_locale.ShortName, artem_pants_5_locale.Description);
        // Adds test shirt Clothing
        tables.templates.customization[test_top._id] = test_top;
        tables.templates.customization[test_top_hands._id] = test_top_hands;
        tables.templates.customization[test_top_suit._id] = test_top_suit;
        this.addClothingItemToLocales(tables, test_top_suit._id, test_top_locale.Name, test_top_locale.ShortName, test_top_locale.Description);
        // Adds artem shirt1 Clothing
        tables.templates.customization[artem_top1._id] = artem_top1;
        tables.templates.customization[artem_top1_hands._id] = artem_top1_hands;
        tables.templates.customization[artem_top1_suit._id] = artem_top1_suit;
        this.addClothingItemToLocales(tables, artem_top1_suit._id, artem_top1_locale.Name, artem_top1_locale.ShortName, artem_top1_locale.Description);
        // Adds artem shirt2 Clothing
        tables.templates.customization[artem_top2._id] = artem_top2;
        tables.templates.customization[artem_top2_hands._id] = artem_top2_hands;
        tables.templates.customization[artem_top2_suit._id] = artem_top2_suit;
        this.addClothingItemToLocales(tables, artem_top2_suit._id, artem_top2_locale.Name, artem_top2_locale.ShortName, artem_top2_locale.Description);
        // Adds artem shirt3 Clothing
        tables.templates.customization[artem_top3._id] = artem_top3;
        tables.templates.customization[artem_top3_hands._id] = artem_top3_hands;
        tables.templates.customization[artem_top3_suit._id] = artem_top3_suit;
        this.addClothingItemToLocales(tables, artem_top3_suit._id, artem_top3_locale.Name, artem_top3_locale.ShortName, artem_top3_locale.Description);
        // Adds artem shirt4 Clothing
        tables.templates.customization[artem_top4._id] = artem_top4;
        tables.templates.customization[artem_top4_hands._id] = artem_top4_hands;
        tables.templates.customization[artem_top4_suit._id] = artem_top4_suit;
        this.addClothingItemToLocales(tables, artem_top4_suit._id, artem_top4_locale.Name, artem_top4_locale.ShortName, artem_top4_locale.Description);
        // Adds artem shirt5 Clothing
        tables.templates.customization[artem_top5._id] = artem_top5;
        tables.templates.customization[artem_top5_hands._id] = artem_top5_hands;
        tables.templates.customization[artem_top5_suit._id] = artem_top5_suit;
        this.addClothingItemToLocales(tables, artem_top5_suit._id, artem_top5_locale.Name, artem_top5_locale.ShortName, artem_top5_locale.Description);
        // Adds artem shirt6 Clothing
        tables.templates.customization[artem_top6._id] = artem_top6;
        tables.templates.customization[artem_top6_hands._id] = artem_top6_hands;
        tables.templates.customization[artem_top6_suit._id] = artem_top6_suit;
        this.addClothingItemToLocales(tables, artem_top6_suit._id, artem_top6_locale.Name, artem_top6_locale.ShortName, artem_top6_locale.Description);
        // Adds artem shirt7 Clothing
        tables.templates.customization[artem_top7._id] = artem_top7;
        tables.templates.customization[artem_top7_hands._id] = artem_top7_hands;
        tables.templates.customization[artem_top7_suit._id] = artem_top7_suit;
        this.addClothingItemToLocales(tables, artem_top7_suit._id, artem_top7_locale.Name, artem_top7_locale.ShortName, artem_top7_locale.Description);
        // Adds artem shirt8 Clothing
        tables.templates.customization[artem_top8._id] = artem_top8;
        tables.templates.customization[artem_top8_hands._id] = artem_top8_hands;
        tables.templates.customization[artem_top8_suit._id] = artem_top8_suit;
        this.addClothingItemToLocales(tables, artem_top8_suit._id, artem_top8_locale.Name, artem_top8_locale.ShortName, artem_top8_locale.Description);
        // Adds artem shirt9 Clothing
        tables.templates.customization[artem_top9._id] = artem_top9;
        tables.templates.customization[artem_top9_hands._id] = artem_top9_hands;
        tables.templates.customization[artem_top9_suit._id] = artem_top9_suit;
        this.addClothingItemToLocales(tables, artem_top9_suit._id, artem_top9_locale.Name, artem_top9_locale.ShortName, artem_top9_locale.Description);
        tables.traders["ArtemTrader"].suits = tradersuits;
        //adds Five seven loyalty 2
        this.fluentTraderAssortHeper.createComplexAssortItem(tables.globals.ItemPresets["5d51290186f77419093e7c24"]._items)
            .addStackCount(2580)
            .addBuyRestriction(6)
            .addMoneyCost(Money_1.Money.ROUBLES, 19432)
            .addLoyaltyLevel(2)
            .export(tables.traders[baseJson._id]);
        // Add trader to locale file, ensures trader text shows properly on screen
        // WARNING: adds the same text to ALL locales (e.g. chinese/french/english)
        this.traderHelper.addTraderToLocales(baseJson, tables, baseJson.name, "Artem", baseJson.nickname, baseJson.location, "[REDACTED]");
        this.logger.debug(`[${this.mod}] postDb Loaded`);
    }
    addTraderToDb(traderDetailsToAdd, tables, jsonUtil) {
        // Add trader to trader table, key is the traders id
        tables.traders[traderDetailsToAdd._id] = {
            assort: jsonUtil.deserialize(jsonUtil.serialize(assortJson)), // assorts are the 'offers' trader sells, can be a single item (e.g. carton of milk) or multiple items as a collection (e.g. a gun)
            base: jsonUtil.deserialize(jsonUtil.serialize(traderDetailsToAdd)),
            questassort: {
                started: {},
                success: {},
                fail: {}
            } // Empty object as trader has no assorts unlocked by quests
        };
    }
    addClothingItemToLocales(tables, ClothingTpl, name, shortName, Description) {
        // For each language, add locale for the new trader
        const locales = Object.values(tables.locales.global);
        for (const locale of locales) {
            locale[`${ClothingTpl} Name`] = name;
            locale[`${ClothingTpl} ShortName`] = shortName;
            locale[`${ClothingTpl} Description`] = Description;
        }
    }
}
module.exports = { mod: new ArtemTrader() };
//# sourceMappingURL=mod.js.map