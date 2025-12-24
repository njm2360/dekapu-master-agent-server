import type { WorldInfo } from "./world"

export interface GroupRole {
    id: string,
    name: string,
    description: string,
    permissions: string[]
}

export interface GroupInstance {
    instanceId: string,
    location: string,
    memberCount: number,
    world: WorldInfo,
}

export enum GroupAccessType {
    PUBLIC = "public",
    PLUS = "plus",
    MEMBER = "members",
}
