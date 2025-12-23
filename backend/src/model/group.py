from enum import StrEnum
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field

from model.world import WorldInfo


class GroupRole(BaseModel):
    id: str = Field(..., alias="id")
    name: str = Field(..., alias="name")
    description: str = Field(..., alias="description")
    permissions: list = Field(..., alias="permissions")


class GroupInstance(BaseModel):
    instance_id: str = Field(..., alias="instanceId")  # インスタンスID
    location: str  # ロケーション
    member_count: int = Field(
        ..., alias="memberCount"
    )  # グループメンバー数(userCountではない)
    world: WorldInfo  # ワールド情報


class GroupAccessType(StrEnum):
    PUBLIC = "public"
    PLUS = "plus"
    MEMBER = "members"


class GroupPostInfo(BaseModel):
    id: str = Field(..., alias="id")
    group_id: str = Field(..., alias="groupId")
    author_id: str = Field(..., alias="authorId")
    editor_id: Optional[str] = Field(None, alias="editorId")
    visibility: str = Field(..., alias="visibility")
    role_ids: list[str] = Field(default_factory=list, alias="roleIds")
    title: str = Field(..., alias="title")
    text: str = Field(..., alias="text")
    image_id: Optional[str] = Field(None, alias="imageId")
    image_url: Optional[str] = Field(None, alias="imageUrl")
    created_at: datetime = Field(..., alias="createdAt")
    updated_at: datetime = Field(..., alias="updatedAt")
