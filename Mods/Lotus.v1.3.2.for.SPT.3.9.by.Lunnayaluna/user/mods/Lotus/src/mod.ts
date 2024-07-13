import { DependencyContainer } from "tsyringe"

import { IPreSptLoadMod } from "@spt/models/external/IPreSptLoadMod"
import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod"
import { ILogger } from "@spt/models/spt/utils/ILogger"
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor"
import { ConfigTypes } from "@spt/models/enums/ConfigTypes"
import { ITraderConfig } from "@spt/models/spt/config/ITraderConfig"
import { IRagfairConfig } from "@spt/models/spt/config/IRagfairConfig"
import { Traders } from "@spt/models/enums/Traders"
import { ItemGenerator } from "./CustomItems/ItemGenerator"
import { References } from "./Refs/References"
import { TraderData } from "./Trader/Lotus"
import { TraderUtils, Utils } from "./Refs/Utils"

import * as baseJson from "../db/base.json"
import * as questAssort from "../db/questassort.json"

class Lotus implements IPreSptLoadMod, IPostDBLoadMod {
	mod: string
	logger: ILogger
	private ref: References = new References()
	private utils: Utils = new Utils()

	constructor() {
		this.mod = "Lotus"
	}

	public preSptLoad(container: DependencyContainer): void {
		this.ref.preSptLoad(container)

		const ragfair: IRagfairConfig = this.ref.configServer.getConfig<IRagfairConfig>(ConfigTypes.RAGFAIR)
		const traderConfig: ITraderConfig = this.ref.configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER)
		const traderUtils = new TraderUtils()
		const traderData = new TraderData(traderConfig, this.ref, traderUtils, this.ref.jsonUtil)

		traderData.registerProfileImage()
		traderData.setupTraderUpdateTime()

		Traders[baseJson._id] = baseJson._id
		ragfair.traders[baseJson._id] = true
	}

	public postDBLoad(container: DependencyContainer): void {
		this.ref.postDBLoad(container)

		const traderConfig: ITraderConfig = this.ref.configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER)
		const ragfair: IRagfairConfig = this.ref.configServer.getConfig<IRagfairConfig>(ConfigTypes.RAGFAIR)
		const locations = this.ref.tables.locations
		const itemGenerator = new ItemGenerator()
		const traderUtils = new TraderUtils()
		const traderData = new TraderData(traderConfig, this.ref, traderUtils, this.ref.jsonUtil)

		traderData.pushTrader()
		this.ref.tables.traders[baseJson._id].questassort = questAssort
		traderData.addTraderToLocales(
			this.ref.tables,
			baseJson.name,
			"Lotus",
			baseJson.nickname,
			baseJson.location,
			"A businesswoman who travels around conflict zones around the world."
		)

		itemGenerator.createLotusKeycard(this.ref.customItem, this.utils, this.ref.tables)
		ragfair.dynamic.blacklist.custom.push(...["LotusKeycard"])
		locations["laboratory"].base.AccessKeys.push(...["LotusKeycard"])

		this.ref.logger.log("Lotus arrived in Tarkov.", LogTextColor.GREEN)
		this.ref.logger.log("Thanks for using my trader!", LogTextColor.GREEN)
	}
}

module.exports = { mod: new Lotus() }
