from enum import StrEnum
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field

from model.world import WorldInfo
from model.group import GroupAccessType


class InstanceType(StrEnum):
    PUBLIC = "public"
    HIDDEN = "hidden"
    FRIENDS = "friends"
    PRIVATE = "private"
    GROUP = "group"


class Region(StrEnum):
    JP = "jp"
    USE = "use"
    USW = "us"
    EU = "eu"


class InstanceType(StrEnum):
    PUBLIC = "public"
    HIDDEN = "hidden"
    FRIENDS = "friends"
    PRIVATE = "private"
    GROUP = "group"


class ContentSettings(BaseModel):
    drones: Optional[bool] = Field(None)
    emoji: Optional[bool] = Field(None)
    pedestals: Optional[bool] = Field(None)
    prints: Optional[bool] = Field(None)
    stickers: Optional[bool] = Field(None)
    props: Optional[bool] = Field(None)


class CreateInstanceConfig(BaseModel):
    world_id: str = Field(..., alias="worldId")
    type: InstanceType = Field(..., alias="type")
    region: Optional[Region] = Field(None, alias="region")
    owner_id: Optional[str] = Field(None, alias="ownerId")
    role_ids: Optional[list[str]] = Field(None, alias="roleIds")
    group_access_type: Optional[GroupAccessType] = Field(None, alias="groupAccessType")
    queue_enabled: Optional[bool] = Field(None, alias="queueEnabled")
    display_name: Optional[str] = Field(None, alias="displayName")
    content_settings: Optional[ContentSettings] = Field(None, alias="contentSettings")


class InstanceInfo(BaseModel):
    id: str  # インスタンスID(wrld+instance)
    display_name: Optional[str] = Field(None, alias="displayName")  # 表示名
    name: str  # インスタンス番号
    location: str  # ロケーション
    type: InstanceType  # インスタンスの種類
    group_access_type: Optional[GroupAccessType] = Field(
        None, alias="groupAccessType"
    )  # グループインスタンスの種類
    instance_id: str = Field(..., alias="instanceId")  # インスタンスID(wrld+instance)
    short_name: str = Field(..., alias="secureName")  # 短縮名 (APIではsecureName,バグ?)
    user_count: int = Field(..., alias="userCount")  # 現在のユーザー数
    queue_enabled: bool = Field(..., alias="queueEnabled")  # キュー有効
    queue_size: int = Field(..., alias="queueSize")  # キューの人数
    region: str  # リージョン
    tags: list[str]  # タグ
    closed_at: Optional[datetime] = Field(None, alias="closedAt")
    world: WorldInfo  # ワールド情報
    world_id: str = Field(..., alias="worldId")  # ワールドID
    owner_id: Optional[str] = Field(
        None, alias="ownerId"
    )  # オーナーのID(Public -> None, Group -> groupId)
