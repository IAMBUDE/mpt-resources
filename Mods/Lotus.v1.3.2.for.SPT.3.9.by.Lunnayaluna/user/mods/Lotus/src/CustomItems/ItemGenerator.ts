import { HandbookIDs, ItemGenIDs, BaseClasses } from "../Refs/Enums"
import { NewItemFromCloneDetails } from "@spt/models/spt/mod/NewItemDetails"

export class ItemGenerator {
	constructor() {}

	public createLotusKeycard(newItem, utils, tables) {
		const LotusKeycard: NewItemFromCloneDetails = {
			itemTplToClone: ItemGenIDs.Keycard,
			overrideProperties: {
				Prefab: {
					path: "assets/content/items/spec/item_keycard_lab/item_keycard_lab_white_sanitar.bundle",
					rcid: "",
				},
				Height: 1,
				Width: 1,
				BackgroundColor: "violet",
				MaximumNumberOfUsage: 0,
			},
			parentId: BaseClasses.INFO,
			newId: "LotusKeycard",
			fleaPriceRoubles: 29999999,
			handbookPriceRoubles: 24999999,
			handbookParentId: HandbookIDs.ElectronicKeys,

			locales: {
				en: {
					name: "Lotus' Custom Labs Access Card",
					shortName: "LotusCC",
					description:
						"A custom access keycard for the Terragroup Lab, a place filled with treasure and danger. This card has been modified by Lotus and does not have any limited uses unlike the normal access cards. Whoever owns this keycard will not have to worry about buying or finding normal access cards ever again.",
				},
			},
		}

		newItem.createItemFromClone(LotusKeycard)
		utils.addToCases(tables, "5d235bb686f77443f4331278", "LotusKeycard")
		utils.addToCases(tables, "619cbf9e0a7c3a1a2731940a", "LotusKeycard")
	}
}
