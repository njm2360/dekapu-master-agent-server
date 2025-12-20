from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field
from app.model.instance import InstanceInfo
from app.model.osc import OscConfig


class LaunchOptions(BaseModel):
    instance: Optional[InstanceInfo] = Field(None, alias="instance")
    profile: Optional[int] = Field(None, alias="profile")
    no_vr: bool = Field(True, alias="noVr")
    fps: Optional[int] = Field(None, alias="fps")
    midi: Optional[str] = Field(None, alias="midi")
    osc: Optional[OscConfig] = Field(None, alias="osc")
    affinity: Optional[str] = Field(None, alias="affinity")
    process_priority: Optional[str] = Field(None, alias="processPriority")
    watch_worlds: bool = Field(False, alias="watchWorlds")
    watch_avatars: bool = Field(False, alias="watchAvatars")
    debug_gui: bool = Field(False, alias="debugGui")
    sdk_log_levels: bool = Field(False, alias="sdkLogLevels")
    udon_debug_logging: bool = Field(False, alias="udonDebugLogging")
    extra_args: Optional[List[str]] = Field(None, alias="extraArgs")

    model_config = ConfigDict(populate_by_name=True)
