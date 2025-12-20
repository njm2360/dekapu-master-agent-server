from pydantic import BaseModel, ConfigDict, Field

class WolOption(BaseModel):
    mac_address: str = Field(..., alias="macAddress")

    model_config = ConfigDict(populate_by_name=True)
