from fastapi import APIRouter
from api.instance_api import router as instance_router
from api.group_api import router as group_router
from api.control_api import router as ctrl_router
from api.websocket_api import router as websocket_router

api_router = APIRouter()
api_router.include_router(instance_router)
api_router.include_router(group_router)
api_router.include_router(ctrl_router)
api_router.include_router(websocket_router)
