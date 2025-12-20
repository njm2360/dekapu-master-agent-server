from pydantic import BaseModel, Field, ConfigDict


class OscConfig(BaseModel):
    in_port: int = Field(..., alias="inPort")
    out_ip: str = Field(..., alias="outIp")
    out_port: int = Field(..., alias="outPort")

    model_config = ConfigDict(populate_by_name=True)
