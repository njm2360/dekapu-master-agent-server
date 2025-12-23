from dataclasses import dataclass
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager

from config import Config
from api.vrchat_api import VRChatAPI
from service.control_service import ControlService
from service.vrchat.group_service import GroupService
from service.vrchat.instance_service import InstanceService
from service.websocket_service import WebSocketService
from router.router import api_router
from util.auth import AuthManager
from util.http import HttpClient


@dataclass
class AppState:
    instance_service: InstanceService
    group_service: GroupService
    control_service: ControlService
    websocket_service: WebSocketService


@asynccontextmanager
async def lifespan(app: FastAPI):
    cfg = Config()
    http = HttpClient()
    auth = AuthManager(http, cfg)
    api = VRChatAPI(http, auth)

    auth.load_session()
    if not auth.ensure_logged_in():
        raise RuntimeError("VRChat login failed")

    ws_service = WebSocketService()
    ctrl_service = ControlService(ws_service)
    inst_service = InstanceService(api)
    group_service = GroupService(api)

    app.state = AppState(
        instance_service=inst_service,
        group_service=group_service,
        control_service=ctrl_service,
        websocket_service=ws_service,
    )

    yield

    auth.save_session()


app = FastAPI(lifespan=lifespan)
app.include_router(api_router)
app.mount(
    "/",
    StaticFiles(directory="../../frontend/dist", html=True),
    name="web",
)
