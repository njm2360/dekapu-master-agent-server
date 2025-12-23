import json
import logging
import requests
from typing import Final, Optional

from model.instance import InstanceInfo, CreateInstanceConfig
from model.group import GroupInstance, GroupPostInfo, GroupRole
from util.http import HttpClient
from util.auth import AuthManager


class VRChatAPI:
    BASE_URL: Final[str] = "https://api.vrchat.cloud/api/1"

    def __init__(
        self, http: HttpClient, auth: AuthManager, base_url: Optional[str] = None
    ) -> None:
        self.http = http
        self.auth = auth
        self.base_url = base_url or self.BASE_URL

    def _request_with_relogin(self, method: str, url: str, **kwargs):
        try:
            return self.http.request(method, url, **kwargs)
        except requests.HTTPError as e:
            if e.response is not None and e.response.status_code == 401:
                logging.warning("認証エラー: 再ログインしてリトライ")
                if not self.auth.login():
                    raise
                return self.http.request(method, url, **kwargs)
            raise

    def get_group_instances(self, group_id: str) -> list[GroupInstance]:
        resp = self._request_with_relogin(
            "GET", f"{self.base_url}/groups/{group_id}/instances"
        )
        data = resp.json()
        logging.debug(json.dumps(data, indent=2, ensure_ascii=False))
        return [GroupInstance(**gi) for gi in data]

    def get_group_roles(self, group_id: str) -> list[GroupRole]:
        resp = self._request_with_relogin(
            "GET", f"{self.base_url}/groups/{group_id}/roles"
        )
        data = resp.json()
        logging.debug(json.dumps(data, indent=2, ensure_ascii=False))
        return [GroupRole(**gr) for gr in data]

    def get_instance_info(self, world_id: str, instance_id: str) -> InstanceInfo:
        resp = self._request_with_relogin(
            "GET", f"{self.base_url}/instances/{world_id}:{instance_id}"
        )
        data = resp.json()
        logging.debug(json.dumps(data, indent=2, ensure_ascii=False))
        return InstanceInfo(**data)

    def create_instance(self, instance: CreateInstanceConfig):
        data = instance.model_dump(by_alias=True)
        resp = self._request_with_relogin(
            "POST", "https://api.vrchat.cloud/api/1/instances", data=data
        )
        resp.raise_for_status()
        data = resp.json()
        logging.debug(json.dumps(data, indent=2, ensure_ascii=False))
        return InstanceInfo(**data)

    def close_instance(self, world_id: str, instance_id: str):
        resp = self._request_with_relogin(
            "DELETE",
            f"https://api.vrchat.cloud/api/1/instances/{world_id}:{instance_id}",
        )
        resp.raise_for_status()
        data = resp.json()
        logging.debug(json.dumps(data, indent=2, ensure_ascii=False))
        return InstanceInfo(**data)

    def get_group_posts(
        self,
        group_id: str,
        n_count: int = 60,
        offset: int = 0,
        public_only: bool = True,
    ) -> list[GroupPostInfo]:
        params = {"n": n_count, "offset": offset, "publicOnly": public_only}
        resp = self._request_with_relogin(
            "GET", f"{self.base_url}/groups/{group_id}/posts", params=params
        )
        data = resp.json()
        logging.debug(json.dumps(data, indent=2, ensure_ascii=False))
        return [GroupPostInfo(**gp) for gp in data["posts"]]
