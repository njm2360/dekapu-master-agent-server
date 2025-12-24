export enum ReleaseStatus {
    PUBLIC = "public",
    PRIVATE = "private",
    HIDDEN = "hidden",
    ALL = "all",
}

export interface WorldInfo {
    id: string;                     // ワールドID
    name: string;                   // ワールド名
    description: string;            // ワールド説明
    authorId: string;               // 作者のユーザーID
    authorName: string;             // 作者のユーザー名
    capacity: number;               // 最大収容人数
    recommendedCapacity: number;    // 推奨収容人数
    tags: string[];                 // タグ
    createdAt: string;              // 作成日時 (ISO 8601)
    updatedAt: string;              // 更新日時 (ISO 8601)
    labsPublicationDate: string;    // Labs公開日時
    publicationDate: string;        // 公開日時
    thumbnailImageUrl?: string;     // サムネイルURL
    releaseStatus: ReleaseStatus;   // リリース状態
    organization: string;           // 組織
    version: number;                // バージョン
    visits: number;                 // 訪問数
    popularity: number;             // 人気度
    favorites: number;              // お気に入り数
    heat: number;                   // 活発度
}
