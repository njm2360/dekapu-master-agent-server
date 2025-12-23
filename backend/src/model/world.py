from enum import Enum
from pydantic import Field
from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class ReleaseStatus(Enum):
    PUBLIC = "public"
    PRIVATE = "private"
    HIDDEN = "hidden"
    ALL = "all"


class WorldInfo(BaseModel):
    id: str  # ワールドID
    name: str  # ワールド名
    description: str  # ワールド説明
    author_id: str = Field(..., alias="authorId")  # 作者のユーザーID
    author_name: str = Field(..., alias="authorName")  # 作者のユーザー名
    capacity: int  # 最大収容人数
    recommended_capacity: int = Field(..., alias="recommendedCapacity")  # 推奨収容人数
    tags: list[str]  # タグ
    created_at: datetime  # 作成日時
    updated_at: datetime  # 更新日時
    labs_publication_date: datetime = Field(
        ..., alias="labsPublicationDate"
    )  # Labs公開日時
    publication_date: datetime = Field(..., alias="publicationDate")  # 公開日時
    thumbnail_image_url: Optional[str] = Field(
        None, alias="thumbnailImageUrl"
    )  # サムネイルURL
    release_status: ReleaseStatus = Field(..., alias="releaseStatus")  # リリース状態
    organization: str  # 組織
    version: int  # バージョン
    visits: int  # 訪問数
    popularity: int  # 人気度
    favorites: int  # お気に入り数
    heat: int  # 活発度
