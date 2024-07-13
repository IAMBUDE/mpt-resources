import { DependencyContainer } from "tsyringe"
import { ILogger } from "@spt/models/spt/utils/ILogger"
import { StaticRouterModService } from "@spt/services/mod/staticRouter/StaticRouterModService"
import { ProfileHelper } from "@spt/helpers/ProfileHelper"
import { DatabaseServer } from "@spt/servers/DatabaseServer"
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables"
import { ConfigServer } from "@spt/servers/ConfigServer"
import { JsonUtil } from "@spt/utils/JsonUtil"
import { VFS } from "@spt/utils/VFS"
import { ImporterUtil } from "@spt/utils/ImporterUtil"
import { PreSptModLoader } from "@spt/loaders/PreSptModLoader"
import { ImageRouter } from "@spt/routers/ImageRouter"
import { OnUpdateModService } from "@spt/services/mod/onUpdate/OnUpdateModService"
import { RagfairPriceService } from "@spt/services/RagfairPriceService"
import { CustomItemService } from "@spt/services/mod/CustomItemService"
import { SaveServer } from "@spt/servers/SaveServer"
import { ItemHelper } from "@spt/helpers/ItemHelper"
import { BotHelper } from "@spt/helpers/BotHelper"
import { RandomUtil } from "@spt/utils/RandomUtil"

export class References {
	public container: DependencyContainer
	public preSptModLoader: PreSptModLoader
	public configServer: ConfigServer
	public saveServer: SaveServer
	public itemHelper: ItemHelper
	public logger: ILogger
	public staticRouter: StaticRouterModService
	public onUpdateModService: OnUpdateModService

	public database: DatabaseServer
	public customItem: CustomItemService
	public imageRouter: ImageRouter
	public jsonUtil: JsonUtil
	public profileHelper: ProfileHelper
	public ragfairPriceService: RagfairPriceService
	public importerUtil: ImporterUtil
	public vfs: VFS
	public tables: IDatabaseTables
	public botHelper: BotHelper
	public randomUtil: RandomUtil

	public preSptLoad(container: DependencyContainer): void {
		this.container = container
		this.preSptModLoader = container.resolve<PreSptModLoader>("PreSptModLoader")
		this.imageRouter = container.resolve<ImageRouter>("ImageRouter")
		this.configServer = container.resolve<ConfigServer>("ConfigServer")
		this.saveServer = container.resolve<SaveServer>("SaveServer")
		this.itemHelper = container.resolve<ItemHelper>("ItemHelper")
		this.logger = container.resolve<ILogger>("WinstonLogger")
		this.staticRouter = container.resolve<StaticRouterModService>("StaticRouterModService")
		this.onUpdateModService = container.resolve<OnUpdateModService>("OnUpdateModService")
		this.randomUtil = container.resolve<RandomUtil>("RandomUtil")
	}

	public postDBLoad(container: DependencyContainer): void {
		this.container = container
		this.database = container.resolve<DatabaseServer>("DatabaseServer")
		this.tables = container.resolve<DatabaseServer>("DatabaseServer").getTables()
		this.customItem = container.resolve<CustomItemService>("CustomItemService")
		this.jsonUtil = container.resolve<JsonUtil>("JsonUtil")
		this.profileHelper = container.resolve<ProfileHelper>("ProfileHelper")
		this.ragfairPriceService = container.resolve<RagfairPriceService>("RagfairPriceService")
		this.importerUtil = container.resolve<ImporterUtil>("ImporterUtil")
		this.vfs = container.resolve<VFS>("VFS")
		this.botHelper = container.resolve<BotHelper>("BotHelper")
		this.randomUtil = container.resolve<RandomUtil>("RandomUtil")
		this.itemHelper = container.resolve<ItemHelper>("ItemHelper")
	}
}
