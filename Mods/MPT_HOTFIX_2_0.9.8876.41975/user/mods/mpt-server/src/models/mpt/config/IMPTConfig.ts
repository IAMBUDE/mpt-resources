import { IMPTConfigClient } from "./IMPTConfigClient"
import { IMPTConfigServer } from "./IMPTConfigServer"

export interface IMPTConfig {
    client: IMPTConfigClient;
    server: IMPTConfigServer;
}
