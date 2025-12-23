from api.vrchat_api import VRChatAPI


class GroupService:
    def __init__(
        self,
        api: VRChatAPI,
    ):
        self.api = api

    def get_group_info(self, group_id: str):
        raise NotImplementedError

    def get_announcement(self, group_id: str):
        raise NotImplementedError

    def list_instances(self, group_id: str):
        return self.api.get_group_instances(group_id)

    def get_roles(self, group_id: str):
        return self.api.get_group_roles(group_id)
