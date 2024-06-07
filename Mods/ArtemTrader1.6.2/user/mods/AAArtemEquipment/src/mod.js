"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
//MCv008_withblacklist
//Config file
const modConfig = require("../config.json");
//Blacklist file
const blacklist = require("../blacklist.json");
//Item template file
const itemTemplate = require("../templates/item_template.json");
const articleTemplate = require("../templates/article_template.json");
class AddItems {
    db;
    mydb;
    logger;
    jsonUtil;
    postDBLoad(container) {
        this.logger = container.resolve("WinstonLogger");
        this.jsonUtil = container.resolve("JsonUtil");
        const databaseServer = container.resolve("DatabaseServer");
        const databaseImporter = container.resolve("ImporterUtil");
        const modLoader = container.resolve("PreAkiModLoader");
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
        //Get the server database and our custom database
        this.db = databaseServer.getTables();
        this.mydb = databaseImporter.loadRecursive(`${modLoader.getModPath(modFolderName)}database/`);
        this.logger.info("Loading: " + modFullName);
        //Start by checking the items and clothing jsons for errors
        //NOT IMPLEMENTED YET
        //this.checkJSON(this.mydb.mmART_items);
        //this.checkJSON(this.mydb.mmART_clothes);
        //Blacklist Function
        const configServer = container.resolve("ConfigServer");
        const serverScavcaseConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.SCAVCASE);
        const itemFilterService = container.resolve("ItemFilterService");
        const itemBlacklist = itemFilterService.getBlacklistedItems();
        itemBlacklist.push(...blacklist.addtoconfigsitem.blacklist);
        const newBlacklist2 = serverScavcaseConfig.rewardItemBlacklist.concat(blacklist.addtoconfigsscavcase.rewardItemBlacklist);
        serverScavcaseConfig.rewardItemBlacklist = newBlacklist2;
        ///this.logger.info(serverScavcaseConfig.rewardItemBlacklist);
        //Items
        for (const [mmARTID, mmARTItem] of Object.entries(this.mydb.mmART_items)) {
            if (mmARTItem.enable) {
                const sptID = mmARTItem.sptID;
                //Items + Handbook
                if ("clone" in mmARTItem) {
                    this.cloneItem(mmARTItem.clone, mmARTID, sptID);
                    this.copyToFilters(mmARTItem.clone, mmARTID, sptID, mmARTItem.enableCloneCompats, mmARTItem.enableCloneConflicts);
                }
                else
                    this.createItem(mmARTID, sptID);
                //Locales (Languages)
                this.addLocales(mmARTID, sptID, mmARTItem);
                //Trades
                //this.addTrades(mmARTID, mmARTItem, traders, currencies);
            }
        }
        this.logger.debug(modFolderName + " items and handbook finished");
        //Item Filters
        for (const [mmARTID, mmARTItem] of Object.entries(this.mydb.mmART_items)) {
            const sptID = mmARTItem.sptID;
            if (this.mydb.mmART_items[mmARTID].enable)
                this.addToFilters(mmARTID, sptID);
        }
        this.logger.debug(modFolderName + " item filters finished");
        //Clothing
        for (const [mmARTID, mmARTArticle] of Object.entries(this.mydb.mmART_clothes)) {
            const sptID = mmARTArticle.sptID;
            //Articles + Handbook
            if ("clone" in mmARTArticle) {
                this.cloneClothing(mmARTArticle.clone, mmARTID, sptID);
            }
            else {
                //Doesn't do anything yet...
                this.createClothing(mmARTID, sptID);
            }
            //Locales (Languages)
            this.addLocales(mmARTID, sptID, undefined, mmARTArticle);
            //Trades
            //this.addTrades(mmARTID, mmARTItem, traders, currencies);
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
        }
        this.logger.debug(modFolderName + " mastery finished");
    }
    cloneItem(itemToClone, mmARTID, sptID) {
        //Clone an item by its ID from the SPT items.json
        //Get a clone of the original item from the database
        let mmARTItemOut = this.jsonUtil.clone(this.db.templates.items[itemToClone]);
        //Change the necessary item attributes using the info in our database file mmART_items.json
        mmARTItemOut._id = sptID;
        mmARTItemOut = this.compareAndReplace(mmARTItemOut, this.mydb.mmART_items[mmARTID]["item"]);
        //Add the new item to the database
        this.db.templates.items[sptID] = mmARTItemOut;
        this.logger.debug("Item \"" + mmARTID + "\" created as a clone of " + itemToClone + " and added to database.");
        //Create the handbook entry for the items
        const handbookEntry = {
            "Id": sptID,
            "ParentId": this.mydb.mmART_items[mmARTID]["handbook"]["ParentId"],
            "Price": this.mydb.mmART_items[mmARTID]["handbook"]["Price"]
        };
        //Add the handbook entry to the database
        this.db.templates.handbook.Items.push(handbookEntry);
        this.logger.debug("Item \"" + mmARTID + "\" added to handbook with price " + handbookEntry.Price);
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
    copyToFilters(itemClone, mmARTID, sptID, enableCompats = true, enableConflicts = true) {
        //Find the original item in all compatible and conflict filters and add the clone to those filters as well
        //Will skip one or both depending on the enable parameters found in mmART_items.json (default is true)
        //Get a list of all our custom items so we can skip over them:
        const sptIDs = [];
        for (const mmARTItem of Object.values(this.mydb.mmART_items))
            sptIDs.push(mmARTItem.sptID);
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
    addToFilters(mmARTID, sptID) {
        //Add a new item to compatibility & conflict filters of pre-existing items
        //Add additional compatible and conflicting items to new item filters (manually adding more than the ones that were cloned)
        const mmARTNewItem = this.mydb.mmART_items[mmARTID];
        this.logger.debug("addToFilters: " + mmARTID);
        //Manually add items into an mmART item's filters
        if ("addToThisItemsFilters" in mmARTNewItem) {
            const mmARTItemFilters = this.getFilters(sptID)[0];
            let mmARTConflictingItems = this.getFilters(sptID)[1];
            for (const modSlotName in mmARTNewItem.addToThisItemsFilters) {
                if (modSlotName === "conflicts")
                    mmARTConflictingItems = mmARTConflictingItems.concat(mmARTNewItem.addToThisItemsFilters.conflicts);
                else {
                    for (const filter in mmARTItemFilters) {
                        if (modSlotName === mmARTItemFilters[filter]._name) {
                            const slotFilter = mmARTItemFilters[filter]._props.filters[0].Filter;
                            const newFilter = slotFilter.concat(mmARTNewItem.addToThisItemsFilters[modSlotName]);
                            mmARTItemFilters[filter]._props.filters[0].Filter = newFilter;
                        }
                    }
                }
            }
        }
        //Manually add mmART items to pre-existing item filters.
        if ("addToExistingItemFilters" in mmARTNewItem) {
            for (const modSlotName in mmARTNewItem.addToExistingItemFilters) {
                if (modSlotName === "conflicts") {
                    for (const conflictingItem of mmARTNewItem.addToExistingItemFilters[modSlotName]) {
                        const conflictingItems = this.getFilters(conflictingItem)[1];
                        conflictingItems.push(sptID);
                    }
                }
                else {
                    for (const compatibleItem of mmARTNewItem.addToExistingItemFilters[modSlotName]) {
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
    cloneClothing(articleToClone, mmARTID, sptID) {
        if (this.mydb.mmART_clothes[mmARTID].enable || !("enable" in this.mydb.mmART_clothes[mmARTID])) {
            //Get a clone of the original item from the database
            let mmARTClothingOut = this.jsonUtil.clone(this.db.templates.customization[articleToClone]);
            //Change the necessary clothing item attributes using the info in our database file mmART_clothes.json
            mmARTClothingOut._id = sptID;
            mmARTClothingOut._name = sptID;
            mmARTClothingOut = this.compareAndReplace(mmARTClothingOut, this.mydb.mmART_clothes[mmARTID]["customization"]);
            //Add the new item to the database
            this.db.templates.customization[sptID] = mmARTClothingOut;
            this.logger.debug("Clothing item \"" + mmARTID + "\" created as a clone of " + articleToClone + " and added to database.");
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
    private addTrades(mmARTID: string, mmARTItem: ImmARTItem, traders: object, currencies: object): void
    {

        for (const [tradeID, trade] of Object.entries(mmARTItem.trades))
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
    addLocales(mmARTID, sptID, mmARTItem, mmARTArticle) {
        const name = sptID + " Name";
        const shortname = sptID + " ShortName";
        const description = sptID + " Description";
        const isItem = typeof mmARTItem !== "undefined";
        const mmARTEntry = isItem ? mmARTItem : mmARTArticle;
        for (const localeID in this.db.locales.global) //For each possible locale/language in SPT's database
         {
            let localeEntry;
            if (mmARTEntry.locales) {
                if (localeID in mmARTEntry.locales) //If the language is entered in mmART_items, use that
                 {
                    localeEntry = {
                        "Name": mmARTEntry.locales[localeID].Name,
                        "ShortName": mmARTEntry.locales[localeID].ShortName,
                        "Description": mmARTEntry.locales[localeID].Description
                    };
                }
                else //Otherwise use english as the default
                 {
                    localeEntry = {
                        "Name": mmARTEntry.locales.en.Name,
                        "ShortName": mmARTEntry.locales.en.ShortName,
                        "Description": mmARTEntry.locales.en.Description
                    };
                }
                //If you are using the old locales
                if (modConfig.oldLocales)
                    this.db.locales.global[localeID].templates[mmARTID] = localeEntry;
                //Normal
                else {
                    this.db.locales.global[localeID][name] = localeEntry.Name;
                    this.db.locales.global[localeID][shortname] = localeEntry.ShortName;
                    this.db.locales.global[localeID][description] = localeEntry.Description;
                }
            }
            else {
                if (isItem)
                    this.logger.warning("WARNING: Missing locale entry for item: " + mmARTID);
                else
                    this.logger.debug("No locale entries for item/clothing: " + mmARTID);
            }
            //Also add the necessary preset locale entries if they exist
            if (isItem && mmARTItem.presets) {
                for (const preset in mmARTItem.presets) {
                    if (modConfig.oldLocales)
                        this.db.locales.global[localeID].preset[preset] = {
                            "Name": mmARTItem.presets[preset]
                        };
                    else {
                        this.db.locales.global[localeID][preset] = mmARTItem.presets[preset];
                    }
                }
            }
        }
    }
}
module.exports = { mod: new AddItems() };
//# sourceMappingURL=mod.js.map