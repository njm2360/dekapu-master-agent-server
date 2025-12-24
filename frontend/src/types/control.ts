import type { InstanceInfo } from "./instance";

export interface OscConfig {
    inPort: number,
    outIp: string,
    outPort: number
}

export interface LaunchOptions {
    instance?: InstanceInfo,
    profile?: number,
    noVr?: boolean,
    fps?: number,
    midi?: string,
    osc?: OscConfig,
    affinity?: string,
    processPriority?: number,
    mainThreadPriority?: number
    watchWorlds?: boolean,
    watchAvatars?: boolean,
    debugGui?: boolean,
    sdkLogLevels?: boolean,
    udonDebugLogging?: boolean,
    extraArgs?: string,
}

export interface Client {
    id: string,
    hostName: string,
    description?: string,
    ipAddress: string,
    macAddress: string
}
