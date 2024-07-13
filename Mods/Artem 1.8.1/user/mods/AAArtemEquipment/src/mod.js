"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Config file
const modConfig = require("../config.json");
//Item template file
const itemTemplate = require("../templates/item_template.json");
const articleTemplate = require("../templates/article_template.json");
class AddItems {
    db;
    mydb;
    logger;
    cloner;
    postDBLoad(container) {
        this.logger = container.resolve("WinstonLogger");
        this.cloner = container.resolve("PrimaryCloner");
        const databaseServer = container.resolve("DatabaseServer");
        const databaseImporter = container.resolve("ImporterUtil");
        const modLoader = container.resolve("PreSptModLoader");
        const tables = container.resolve("DatabaseServer").getTables();
        //#region Constants for Static Loot ID's
        const BARREL_CACHE_CONTAINERS = [
            "5d6d2bb386f774785b07a77a", // LOOTCONTAINER_BARREL_CACHE
            "5d6d2b5486f774785c2ba8ea" // LOOTCONTAINER_GROUND_CACHE
        ];
        const CASH_REGISTER_CONTAINERS = [
            "578f879c24597735401e6bc6"
        ];
        const ELECTRONIC_CONTAINERS = [
            "59139c2186f77411564f8e42"
        ];
        const WEAPON_CRATE_CONTAINERS = [
            "5909d7cf86f77470ee57d75a", // LOOTCONTAINER_WEAPON_BOX_4X4
            "5909d5ef86f77467974efbd8", // LOOTCONTAINER_WEAPON_BOX_5X2
            "5909d89086f77472591234a0", // LOOTCONTAINER_WEAPON_BOX_5X5
            "5909d76c86f77471e53d2adf", // LOOTCONTAINER_WEAPON_BOX_6X3
            "5909d45286f77465a8136dc6", // LOOTCONTAINER_WOODEN_AMMO_BOX
            "578f87ad245977356274f2cc", // LOOTCONTAINER_WOODEN_CRATE
            "6223351bb5d97a7b2c635ca7" // LOOTCONTAINER_AIRDROP_WEAPON_CRATE
        ];
        const TECHNICAL_CONTAINERS = [
            "5909d50c86f774659e6aaebe" // toolbox idk i forgot the name
        ];
        const MEDICAL_CONTAINERS = [
            "5909d4c186f7746ad34e805a", // LOOTCONTAINER_MEDCASE
            "5909d24f86f77466f56e6855", // LOOTCONTAINER_MEDBAG_SMU06
            "61aa1ead84ea0800645777fd" // LOOTCONTAINER_MEDBAG_SMU06_ADV
        ];
        const COMMON_LOOT_CONTAINERS = [
            "578f8778245977358849a9b5", // LOOTCONTAINER_JACKET
            "578f8782245977354405a1e3", // LOOTCONTAINER_SAFE
            "578f87a3245977356274f2cb", // LOOTCONTAINER_DUFFLE_BAG
            "61aa1e9a32a4743c3453d2cf", // LOOTCONTAINER_DUFFLE_BAG_ADV
            "5d07b91b86f7745a077a9432", // LOOTCONTAINER_COMMON_FUND_STASH
            "5909e4b686f7747f5b744fa4", // LOOTCONTAINER_DEAD_SCAV
            "578f87b7245977356274f2cd" // LOOTCONTAINER_DRAWER
        ];
        //#endregion
        //Mod Info
        const modFolderName = "AAArtemEquipment";
        const modFullName = "Artem Equipment";
        //Trader IDs
        const traders = {
            "prapor": "54cb50c76803fa8b248b4571",
            "therapist": "54cb57776803fa99248b456e",
            "skier": "58330581ace78e27b8b10cee",
            "peacekeeper": "5935c25fb3acc3127c3d8cd9",
            "mechanic": "5a7c2eca46aef81a7ca2145d",
            "ragman": "5ac3b934156ae10c4430e83c",
            "jaeger": "5c0647fdd443bc2504c2d371",
            "ArtemTrader": "ArtemTrader"
        };
        //Currency IDs
        const currencies = {
            "roubles": "5449016a4bdc2d6f028b456f",
            "dollars": "5696686a4bdc2da3298b456a",
            "euros": "569668774bdc2da2298b4568"
        };
        //Map Names
        const maps = {
            "customs": "bigmap",
            "factoryDay": "factory4_day",
            "factoryNight": "factory4_night",
            "woods": "woods",
            "reserve": "rezervbase",
            "shoreline": "shoreline",
            "interchange": "interchange",
            "streets": "tarkovstreets",
            "lighthouse": "lighthouse",
            "labs": "laboratory",
            "groundzero": "sandbox",
            "groundzero20": "sandbox_high"
        };
        //Get the server database and our custom database
        this.db = databaseServer.getTables();
        this.mydb = databaseImporter.loadRecursive(`${modLoader.getModPath(modFolderName)}database/`);
        this.logger.info("Loading: " + modFullName);
        //Start by checking the items and clothing jsons for errors
        //NOT IMPLEMENTED YET
        //this.checkJSON(this.mydb.mmART_items);
        //this.checkJSON(this.mydb.mmART_clothes);
        //Items
        for (const [customID, customItem] of Object.entries(this.mydb.mmART_items)) {
            if (customItem.enable) {
                const sptID = customItem.sptID;
                //Items + Handbook
                if ("clone" in customItem) {
                    this.cloneItem(customItem.clone, customID, sptID);
                    this.copyToFilters(customItem.clone, customID, sptID, customItem.enableCloneCompats, customItem.enableCloneConflicts);
                }
                else
                    this.createItem(customID, sptID);
                //Locales (Languages)
                this.addLocales(customID, sptID, customItem);
                //Trades
                //this.addTrades(customID, customItem, traders, currencies);
                //Static Loot
                if ("addToStaticLoot" in customItem) {
                    this.addToStaticLoot(sptID, customItem.addToStaticLoot, maps);
                }
            }
        }
        this.logger.debug(modFolderName + " items and handbook finished");
        //Item Filters
        for (const [customID, customItem] of Object.entries(this.mydb.mmART_items)) {
            const sptID = customItem.sptID;
            if (this.mydb.mmART_items[customID].enable)
                this.addToFilters(customID, sptID);
        }
        this.logger.debug(modFolderName + " item filters finished");
        //Clothing
        for (const [customID, customArticle] of Object.entries(this.mydb.mmART_clothes)) {
            const sptID = customArticle.sptID;
            //Articles + Handbook
            if ("clone" in customArticle) {
                this.cloneClothing(customArticle.clone, customID, sptID);
            }
            else {
                //Doesn't do anything yet...
                this.createClothing(customID, sptID);
            }
            //Locales (Languages)
            this.addLocales(customID, sptID, undefined, customArticle);
            //Trades
            //this.addTrades(customID, customItem, traders, currencies);
        }
        this.logger.debug(modFolderName + " clothing finished");
        //Presets
        for (const preset in this.mydb.globals.ItemPresets)
            this.db.globals.ItemPresets[preset] = this.mydb.globals.ItemPresets[preset];
        this.logger.debug(modFolderName + " presets finished");
        //Traders
        for (const trader in traders) {
            this.addTraderAssort(traders[trader]);
            this.addTraderSuits(traders[trader]);
        }
        this.logger.debug(modFolderName + " traders finished");
        //Stimulator Buffs
        //for (const buff in this.mydb.globals.config.Health.Effects.Stimulator.Buffs) this.db.globals.config.Health.Effects.Stimulator.Buffs[buff] = this.mydb.globals.config.Health.Effects.Stimulator.Buffs[buff];
        //this.logger.debug(modFolderName + " stimulator buffs finished");
        //Mastery
        const dbMastering = this.db.globals.config.Mastering;
        for (const weapon in this.mydb.globals.config.Mastering)
            dbMastering.push(this.mydb.globals.config.Mastering[weapon]);
        for (const weapon in dbMastering) {
            if (dbMastering[weapon].Name == "SR25")
                dbMastering[weapon].Templates.push("0088_ATL_SR25_FDE_8800");
        }
        this.logger.debug(modFolderName + " mastery finished");
        //Maps
        //for (const map of Object.values(maps)){}
        //this.addItemToStaticLoot(tables, "", "6673b1ac5cae0610f1079d76", 1663, COMMON_LOOT_CONTAINERS); //denis' collar
        //this.addItemToStaticLoot(tables, "", "6673b1ac5cae0610f1079d76", 1663, BARREL_CACHE_CONTAINERS); //denis' collar
        // this.addItemToStaticLoot(tables, "", "66326bfd46817c660d015141", 3600, COMMON_LOOT_CONTAINERS); //Nikto Mask
        //this.addItemToStaticLoot(tables, "", "6673b1ac5cae0610f1079d7f", 1603, COMMON_LOOT_CONTAINERS); //Zryachiy Mask white
        //this.addItemToStaticLoot(tables, "", "668bc5cd834c88e06b08b6a4", 1603, COMMON_LOOT_CONTAINERS); //Zryachiy Mask Green
        //this.addItemToStaticLoot(tables, "", "66326bfd46817c660d01513f", 3600, COMMON_LOOT_CONTAINERS); //Ghost Mask
        //this.addItemToStaticLoot(tables, "", "6673b1ac5cae0610f1079d74", 2500, COMMON_LOOT_CONTAINERS); //ARTEM_VEILTAN
        //this.addItemToStaticLoot(tables, "", "6673b1ac5cae0610f1079d73", 2500, COMMON_LOOT_CONTAINERS); //ARTEM_VEILBLACK
        //this.addItemToStaticLoot(tables, "", "6673b1ac5cae0610f1079d75", 2500, COMMON_LOOT_CONTAINERS); //ARTEM_VEILOD
    }
    cloneItem(itemToClone, customID, sptID) {
        //Clone an item by its ID from the SPT items.json
        //Get a clone of the original item from the database
        let customItemOut = this.cloner.clone(this.db.templates.items[itemToClone]);
        //Change the necessary item attributes using the info in our database file mmART_items.json
        customItemOut._id = sptID;
        customItemOut = this.compareAndReplace(customItemOut, this.mydb.mmART_items[customID]["item"]);
        //Add the new item to the database
        this.db.templates.items[sptID] = customItemOut;
        this.logger.debug("Item \"" + customID + "\" created as a clone of " + itemToClone + " and added to database.");
        //Create the handbook entry for the items
        const handbookEntry = {
            "Id": sptID,
            "ParentId": this.mydb.mmART_items[customID]["handbook"]["ParentId"],
            "Price": this.mydb.mmART_items[customID]["handbook"]["Price"]
        };
        //Add the handbook entry to the database
        this.db.templates.handbook.Items.push(handbookEntry);
        this.logger.debug("Item \"" + customID + "\" added to handbook with price " + handbookEntry.Price);
    }
    createItem(itemToCreate, sptID) {
        //Create an item from scratch instead of cloning it
        //Requires properly formatted entry in mmART_items.json with NO "clone" attribute
        //Get the new item object from the json
        const newItem = this.mydb.mmART_items[itemToCreate];
        //Check the structure of the new item in mmART_items
        const [pass, checkedItem] = this.checkItem(newItem);
        if (!pass)
            return;
        //Add the new item to the database
        this.db.templates.items[sptID] = checkedItem;
        this.logger.debug("Item \"" + itemToCreate + "\" created and added to database.");
        //Create the handbook entry for the items
        const handbookEntry = {
            "Id": sptID,
            "ParentId": newItem["handbook"]["ParentId"],
            "Price": newItem["handbook"]["Price"]
        };
        //Add the handbook entry to the database
        this.db.templates.handbook.Items.push(handbookEntry);
        this.logger.debug("Item \"" + itemToCreate + "\" added to handbook with price " + handbookEntry.Price);
    }
    checkItem(itemToCheck) {
        //A very basic top-level check of an item to make sure it has the proper attributes
        //Also convert to ITemplateItem to avoid errors
        let pass = true;
        //First make sure it has the top-level 5 entries needed for an item
        for (const level1 in itemTemplate) {
            if (!(level1 in itemToCheck.item)) {
                this.logger.error("ERROR - Missing attribute: \"" + level1 + "\" in your item entry!");
                pass = false;
            }
        }
        //Then make sure the attributes in _props exist in the item template, warn user if not.
        for (const prop in itemToCheck.item._props) {
            if (!(prop in itemTemplate._props))
                this.logger.warning("WARNING - Attribute: \"" + prop + "\" not found in item template!");
        }
        const itemOUT = {
            "_id": itemToCheck.item._id,
            "_name": itemToCheck.item._name,
            "_parent": itemToCheck.item._parent,
            "_props": itemToCheck.item._props,
            "_type": itemToCheck.item._type,
            "_proto": itemToCheck.item._proto
        };
        return [pass, itemOUT];
    }
    compareAndReplace(originalItem, attributesToChange) {
        //Recursive function to find attributes in the original item/clothing object and change them.
        //This is done so each attribute does not have to be manually changed and can instead be read from properly formatted json
        //Requires the attributes to be in the same nested object format as the item entry in order to work (see mmART_items.json and items.json in SPT install)
        for (const key in attributesToChange) {
            //If you've reached the end of a nested series, try to change the value in original to new
            if ((["boolean", "string", "number"].includes(typeof attributesToChange[key])) || Array.isArray(attributesToChange[key])) {
                if (key in originalItem)
                    originalItem[key] = attributesToChange[key];
                //TO DO: Add check with item template here if someone wants to add new properties to a cloned item.
                else {
                    this.logger.warning("(Item: " + originalItem._id + ") WARNING: Could not find the attribute: \"" + key + "\" in the original item, make sure this is intended!");
                    originalItem[key] = attributesToChange[key];
                }
            }
            //Otherwise keep traveling down the nest
            else
                originalItem[key] = this.compareAndReplace(originalItem[key], attributesToChange[key]);
        }
        return originalItem;
    }
    getFilters(item) {
        //Get the slots, chambers, cartridges, and conflicting items objects and return them.
        const slots = (typeof this.db.templates.items[item]._props.Slots === "undefined") ? [] : this.db.templates.items[item]._props.Slots;
        const chambers = (typeof this.db.templates.items[item]._props.Chambers === "undefined") ? [] : this.db.templates.items[item]._props.Chambers;
        const cartridges = (typeof this.db.templates.items[item]._props.Cartridges === "undefined") ? [] : this.db.templates.items[item]._props.Cartridges;
        const filters = slots.concat(chambers, cartridges);
        const conflictingItems = (typeof this.db.templates.items[item]._props.ConflictingItems === "undefined") ? [] : this.db.templates.items[item]._props.ConflictingItems;
        return [filters, conflictingItems];
    }
    copyToFilters(itemClone, customID, sptID, enableCompats = true, enableConflicts = true) {
        //Find the original item in all compatible and conflict filters and add the clone to those filters as well
        //Will skip one or both depending on the enable parameters found in mmART_items.json (default is true)
        //Get a list of all our custom items so we can skip over them:
        const sptIDs = [];
        for (const customItem of Object.values(this.mydb.mmART_items))
            sptIDs.push(customItem.sptID);
        for (const item in this.db.templates.items) {
            if (item in sptIDs)
                continue;
            const [filters, conflictingItems] = this.getFilters(item);
            if (enableCompats) {
                for (const filter of filters) {
                    for (const id of filter._props.filters[0].Filter) {
                        if (id === itemClone)
                            filter._props.filters[0].Filter.push(sptID);
                    }
                }
            }
            if (enableConflicts)
                for (const conflictID of conflictingItems)
                    if (conflictID === itemClone)
                        conflictingItems.push(sptID);
        }
    }
    addToFilters(customID, sptID) {
        //Add a new item to compatibility & conflict filters of pre-existing items
        //Add additional compatible and conflicting items to new item filters (manually adding more than the ones that were cloned)
        const customNewItem = this.mydb.mmART_items[customID];
        this.logger.debug("addToFilters: " + customID);
        //Manually add items into a custom item's filters
        if ("addToThisItemsFilters" in customNewItem) {
            const customItemFilters = this.getFilters(sptID)[0];
            let customConflictingItems = this.getFilters(sptID)[1];
            for (const modSlotName in customNewItem.addToThisItemsFilters) {
                if (modSlotName === "conflicts")
                    customConflictingItems = customConflictingItems.concat(customNewItem.addToThisItemsFilters.conflicts);
                else {
                    for (const filter in customItemFilters) {
                        if (modSlotName === customItemFilters[filter]._name) {
                            const slotFilter = customItemFilters[filter]._props.filters[0].Filter;
                            const newFilter = slotFilter.concat(customNewItem.addToThisItemsFilters[modSlotName]);
                            customItemFilters[filter]._props.filters[0].Filter = newFilter;
                        }
                    }
                }
            }
        }
        //Manually add custom items to pre-existing item filters.
        if ("addToExistingItemFilters" in customNewItem) {
            for (const modSlotName in customNewItem.addToExistingItemFilters) {
                if (modSlotName === "conflicts") {
                    for (const conflictingItem of customNewItem.addToExistingItemFilters[modSlotName]) {
                        const conflictingItems = this.getFilters(conflictingItem)[1];
                        conflictingItems.push(sptID);
                    }
                }
                else {
                    for (const compatibleItem of customNewItem.addToExistingItemFilters[modSlotName]) {
                        const filters = this.getFilters(compatibleItem)[0];
                        for (const filter of filters) {
                            if (modSlotName === filter._name)
                                filter._props.filters[0].Filter.push(sptID);
                        }
                    }
                }
            }
        }
    }
    cloneClothing(articleToClone, customID, sptID) {
        if (this.mydb.mmART_clothes[customID].enable || !("enable" in this.mydb.mmART_clothes[customID])) {
            //Get a clone of the original item from the database
            let customClothingOut = this.cloner.clone(this.db.templates.customization[articleToClone]);
            //Change the necessary clothing item attributes using the info in our database file mmART_clothes.json
            customClothingOut._id = sptID;
            customClothingOut._name = sptID;
            customClothingOut = this.compareAndReplace(customClothingOut, this.mydb.mmART_clothes[customID]["customization"]);
            //Add the new item to the database
            this.db.templates.customization[sptID] = customClothingOut;
            this.logger.debug("Clothing item \"" + customID + "\" created as a clone of " + articleToClone + " and added to database.");
        }
    }
    createClothing(articleToCreate, sptID) {
        //Create clothing from scratch instead of cloning it
        //Requires properly formatted entry in mmART_clothes.json with NO "clone" attribute
        //Get the new article object from the json
        const newArticle = this.mydb.mmART_clothes[articleToCreate];
        //If the article is enabled in the json
        if (newArticle.enable) {
            //Check the structure of the new article in mmART_clothes
            const [pass, checkedArticle] = this.checkArticle(newArticle);
            if (!pass)
                return;
            //Add the new item to the database
            this.db.templates.customization[sptID] = checkedArticle;
            this.logger.debug("Article " + articleToCreate + " created and added to database.");
        }
    }
    checkArticle(articleToCheck) {
        //A very basic top-level check of an article to make sure it has the proper attributes
        //Also convert to ITemplateItem to avoid errors
        let pass = true;
        //First make sure it has the top-level 5 entries needed for an item
        for (const level1 in articleTemplate) {
            if (!(level1 in articleToCheck.customization)) {
                this.logger.error("ERROR - Missing attribute: \"" + level1 + "\" in your article entry!");
                pass = false;
            }
        }
        //Then make sure the attributes in _props exist in the article template, warn user if not.
        for (const prop in articleToCheck.customization._props) {
            if (!(prop in articleTemplate._props))
                this.logger.warning("WARNING - Attribute: \"" + prop + "\" not found in article template!");
        }
        const articleOUT = {
            "_id": articleToCheck.customization._id,
            "_name": articleToCheck.customization._name,
            "_parent": articleToCheck.customization._parent,
            "_props": articleToCheck.customization._props,
            "_type": articleToCheck.customization._type,
            "_proto": articleToCheck.customization._proto
        };
        return [pass, articleOUT];
    }
    addTraderAssort(trader) {
        //Items
        for (const item in this.mydb.traders[trader].assort.items) {
            //this.logger.debug(item + " added to " + trader);
            this.db.traders[trader].assort.items.push(this.mydb.traders[trader].assort.items[item]);
        }
        //Barter Scheme
        for (const item in this.mydb.traders[trader].assort.barter_scheme) {
            //this.logger.debug(item + " added to " + trader);
            this.db.traders[trader].assort.barter_scheme[item] = this.mydb.traders[trader].assort.barter_scheme[item];
        }
        //Loyalty Levels
        for (const item in this.mydb.traders[trader].assort.loyal_level_items) {
            //this.logger.debug(item + " added to " + trader);
            if (modConfig.lvl1Traders)
                this.db.traders[trader].assort.loyal_level_items[item] = 1;
            else
                this.db.traders[trader].assort.loyal_level_items[item] = this.mydb.traders[trader].assort.loyal_level_items[item];
        }
    }
    addTraderSuits(trader) {
        //Only do anything if a suits.json file is included for trader in this mod
        if (typeof this.mydb.traders[trader].suits !== "undefined") {
            //Enable customization for that trader
            this.db.traders[trader].base.customization_seller = true;
            //Create the suits array if it doesn't already exist in SPT database so we can push to it
            if (typeof this.db.traders[trader].suits === "undefined")
                this.db.traders[trader].suits = [];
            //Push all suits
            for (const suit of this.mydb.traders[trader].suits)
                this.db.traders[trader].suits.push(suit);
        }
    }
    /*
    private addTrades(customID: string, customItem: ICustomItem, traders: object, currencies: object): void
    {

        for (const [tradeID, trade] of Object.entries(customItem.trades))
        {

        }
        
        const items = {
            "_id": "",
            "_tpl": "",
            "parentId": "",
            "slotId": "",
            "upd": {}
        };

        const barter_scheme = {

        };

        const loyal_level_items = {

        }
    }
    */
    addLocales(customID, sptID, customItem, customArticle) {
        const name = sptID + " Name";
        const shortname = sptID + " ShortName";
        const description = sptID + " Description";
        const isItem = typeof customItem !== "undefined";
        const customEntry = isItem ? customItem : customArticle;
        for (const localeID in this.db.locales.global) //For each possible locale/language in SPT's database
         {
            let localeEntry;
            if (customEntry.locales) {
                if (localeID in customEntry.locales) //If the language is entered in mmART_items, use that
                 {
                    localeEntry = {
                        "Name": customEntry.locales[localeID].Name,
                        "ShortName": customEntry.locales[localeID].ShortName,
                        "Description": customEntry.locales[localeID].Description
                    };
                }
                else //Otherwise use english as the default
                 {
                    localeEntry = {
                        "Name": customEntry.locales.en.Name,
                        "ShortName": customEntry.locales.en.ShortName,
                        "Description": customEntry.locales.en.Description
                    };
                }
                this.db.locales.global[localeID][name] = localeEntry.Name;
                this.db.locales.global[localeID][shortname] = localeEntry.ShortName;
                this.db.locales.global[localeID][description] = localeEntry.Description;
            }
            else {
                if (isItem)
                    this.logger.warning("WARNING: Missing locale entry for item: " + customID);
                else
                    this.logger.debug("No locale entries for item/clothing: " + customID);
            }
            //Also add the necessary preset locale entries if they exist
            if (isItem && customItem.presets) {
                for (const preset in customItem.presets) {
                    this.db.locales.global[localeID][preset] = customItem.presets[preset];
                }
            }
        }
    }
    addToStaticLoot(sptID, staticLootProbabilities, maps) {
        //For every map
        for (const map of Object.values(maps)) {
            const mapStaticLoot = this.db.locations[map].staticLoot;
            //Add a probability to spawn custom item in each given container type
            for (const [staticLootContainer, probability] of Object.entries(staticLootProbabilities)) {
                try {
                    mapStaticLoot[staticLootContainer].itemDistribution.push({
                        "tpl": sptID,
                        "relativeProbability": probability
                    });
                }
                catch (error) {
                    this.logger.debug("Could not add " + sptID + " to container " + staticLootContainer + " on map " + map);
                }
            }
        }
    }
}
module.exports = { mod: new AddItems() };
//# sourceMappingURL=mod.js.map