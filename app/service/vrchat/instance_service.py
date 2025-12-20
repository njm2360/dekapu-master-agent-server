from app.api.vrchat_api import VRChatAPI
from app.model.instance import CreateInstanceConfig, InstanceInfo


class InstanceService:
    def __init__(
        self,
        api: VRChatAPI,
    ):
        self.api = api

    def create_instance(
        self, config: CreateInstanceConfig
    ) -> InstanceInfo | None:
        try:
            instance = self.api.create_instance(config)
        except Exception:
            return None

        return instance

    def get_instance_info(self, world_id: str, instance_id: str):
        return self.api.get_instance_info(world_id, instance_id)

    def close_instance(self, world_id: str, instance_id: str):
        return self.api.close_instance(world_id, instance_id)
