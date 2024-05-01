import { DependencyContainer, Lifecycle } from "tsyringe";

import { MPTConfig } from "../utils/MPTConfig";

import { ProfileCallbacksOverride } from "../overrides/callbacks/ProfileCallbacks";
import { LocationCallbacksOverride } from "../overrides/callbacks/LocationCallbacks";
import { HttpRouterOverride } from "../overrides/routers/HttpRouter";
import { TradeHelperOverride } from "../overrides/helpers/TradeHelper";
import { LauncherBackgroundOverride } from "../overrides/other/LauncherBackground";
import { LocalesOverride } from "../overrides/other/Locales";
import { Overrider } from "../overrides/Overrider";

import { MPTMatchService } from "../services/MPTMatchService";

import { MPTClientController } from "../controllers/MPTClientController";
import { MPTLocationController } from "../controllers/MPTLocationController";
import { MPTRaidController } from "../controllers/MPTRaidController";
import { MPTSendItemController } from "../controllers/MPTSendItemController";
import { MPTUpdateController } from "../controllers/MPTUpdateController";

import { MPTClientCallbacks } from "../callbacks/MPTClientCallbacks";
import { MPTLocationCallbacks } from "../callbacks/MPTLocationCallbacks";
import { MPTRaidCallbacks } from "../callbacks/MPTRaidCallbacks";
import { MPTSendItemCallbacks } from "../callbacks/MPTSendItemCallbacks";
import { MPTUpdateCallbacks } from "../callbacks/MPTUpdateCallbacks";

import { MPTClientStaticRouter } from "../routers/static/MPTClientStaticRouter";
import { MPTLocationStaticRouter } from "../routers/static/MPTLocationStaticRouter";
import { MPTRaidStaticRouter } from "../routers/static/MPTRaidStaticRouter";
import { MPTSendItemStaticRouter } from "../routers/static/MPTSendItemStaticRouter";
import { MPTUpdateStaticRouter } from "../routers/static/MPTUpdateStaticRouter";

import { MPTItemEventRouter } from "../routers/item_events/MPTItemEventRouter";

import { MPT } from "../MPT";

export class Container {
    public static register(container: DependencyContainer): void {
        this.registerUtils(container);

        this.registerOverrides(container);

        this.registerServices(container);

        this.registerControllers(container);

        this.registerCallbacks(container);

        this.registerRouters(container);

        this.registerListTypes(container);

        container.register<MPT>("MPT", MPT, { lifecycle: Lifecycle.Singleton });
    }

    private static registerListTypes(container: DependencyContainer): void {
        container.registerType("Overrides", "ProfileCallbacksOverride");
        container.registerType("Overrides", "LocationCallbacksOverride");
        container.registerType("Overrides", "HttpRouterOverride");
        container.registerType("Overrides", "TradeHelperOverride");
        container.registerType("Overrides", "LauncherBackgroundOverride");
        container.registerType("Overrides", "LocalesOverride");

        container.registerType("StaticRoutes", "MPTClientStaticRouter");
        container.registerType("StaticRoutes", "MPTLocationStaticRouter");
        container.registerType("StaticRoutes", "MPTRaidStaticRouter");
        container.registerType("StaticRoutes", "MPTSendItemStaticRouter");
        container.registerType("StaticRoutes", "MPTUpdateStaticRouter");

        container.registerType("IERouters", "MPTItemEventRouter");
    }

    private static registerUtils(container: DependencyContainer): void {
        container.register<MPTConfig>("MPTConfig", MPTConfig, { lifecycle: Lifecycle.Singleton });
    }

    private static registerOverrides(container: DependencyContainer): void {
        container.register<ProfileCallbacksOverride>("ProfileCallbacksOverride", ProfileCallbacksOverride, { lifecycle: Lifecycle.Singleton });
        container.register<LocationCallbacksOverride>("LocationCallbacksOverride", LocationCallbacksOverride, { lifecycle: Lifecycle.Singleton });
        container.register<HttpRouterOverride>("HttpRouterOverride", HttpRouterOverride, { lifecycle: Lifecycle.Singleton });
        container.register<TradeHelperOverride>("TradeHelperOverride", TradeHelperOverride, { lifecycle: Lifecycle.Singleton });
        container.register<LauncherBackgroundOverride>("LauncherBackgroundOverride", LauncherBackgroundOverride, { lifecycle: Lifecycle.Singleton });
        container.register<LocalesOverride>("LocalesOverride", LocalesOverride, { lifecycle: Lifecycle.Singleton });
        container.register<Overrider>("Overrider", Overrider, { lifecycle: Lifecycle.Singleton });
    }

    private static registerServices(container: DependencyContainer): void {
        container.register<MPTMatchService>("MPTMatchService", MPTMatchService, { lifecycle: Lifecycle.Singleton });
    }

    private static registerControllers(container: DependencyContainer): void {
        container.register<MPTClientController>("MPTClientController", { useClass: MPTClientController });
        container.register<MPTLocationController>("MPTLocationController", { useClass: MPTLocationController });
        container.register<MPTRaidController>("MPTRaidController", { useClass: MPTRaidController });
        container.register<MPTSendItemController>("MPTSendItemController", { useClass: MPTSendItemController });
        container.register<MPTUpdateController>("MPTUpdateController", { useClass: MPTUpdateController });
    }

    private static registerCallbacks(container: DependencyContainer): void {
        container.register<MPTClientCallbacks>("MPTClientCallbacks", { useClass: MPTClientCallbacks });
        container.register<MPTLocationCallbacks>("MPTLocationCallbacks", { useClass: MPTLocationCallbacks });
        container.register<MPTRaidCallbacks>("MPTRaidCallbacks", { useClass: MPTRaidCallbacks });
        container.register<MPTSendItemCallbacks>("MPTSendItemCallbacks", { useClass: MPTSendItemCallbacks });
        container.register<MPTUpdateCallbacks>("MPTUpdateCallbacks", { useClass: MPTUpdateCallbacks });
    }

    private static registerRouters(container: DependencyContainer): void {
        container.register<MPTClientStaticRouter>("MPTClientStaticRouter", { useClass: MPTClientStaticRouter });
        container.register<MPTLocationStaticRouter>("MPTLocationStaticRouter", { useClass: MPTLocationStaticRouter });
        container.register<MPTRaidStaticRouter>("MPTRaidStaticRouter", { useClass: MPTRaidStaticRouter });
        container.register<MPTSendItemStaticRouter>("MPTSendItemStaticRouter", { useClass: MPTSendItemStaticRouter });
        container.register<MPTUpdateStaticRouter>("MPTUpdateStaticRouter", { useClass: MPTUpdateStaticRouter });

        container.register<MPTItemEventRouter>("MPTItemEventRouter", { useClass: MPTItemEventRouter });
    }
}
