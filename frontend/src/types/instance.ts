import type { GroupAccessType } from "./group";
import type { WorldInfo } from "./world";

export enum InstanceType {
    PUBLIC = "public",
    HIDDEN = "hidden",
    FRIENDS = "friends",
    PRIVATE = "private",
    GROUP = "group",
}

export enum Region {
    JP = "jp",
    USE = "use",
    USW = "us",
    EU = "eu",
}

export interface ContentSettings {
    drones?: boolean;
    emoji?: boolean;
    pedestals?: boolean;
    prints?: boolean;
    stickers?: boolean;
    props?: boolean;
}

export interface CreateInstanceConfig {
    worldId: string;
    type: InstanceType;
    region?: Region;
    ownerId?: string;
    roleIds?: string[];
    groupAccessType?: GroupAccessType;
    queueEnabled?: boolean;
    displayName?: string;
    contentSettings?: ContentSettings;
}

export interface InstanceInfo {
    id: string;                         // インスタンスID(wrld+instance)
    displayName?: string;               // 表示名
    name: string;                       // インスタンス番号
    location: string;                   // ロケーション
    type: InstanceType;                 // インスタンスの種類
    groupAccessType?: GroupAccessType;  // グループインスタンスの種類
    instanceId: string;                 // インスタンスID(wrld+instance)
    secureName: string;                 // 短縮名(APIではsecureName)
    userCount: number;                  // 現在のユーザー数
    queueEnabled: boolean;              // キュー有効
    queueSize: number;                  // キューの人数
    region: Region;                     // リージョン
    tags: string[];                     // タグ
    closedAt?: string;                  // datetime → ISO string
    world: WorldInfo;                   // ワールド情報
    worldId: string;                    // ワールドID
    ownerId?: string;                   // オーナーID
}
