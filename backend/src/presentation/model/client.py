from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class ClientInfo(BaseModel):
    host_name: str = Field(..., alias="hostName")
    ip_address: str = Field(..., alias="ipAddress")
    mac_address: str = Field(..., alias="macAddress")
    description: Optional[str] = Field(None, alias="description")

    model_config = ConfigDict(populate_by_name=True)


class ClientInfoResponse(ClientInfo):
    id: str = Field(..., alias="id")

    model_config = ConfigDict(populate_by_name=True)
