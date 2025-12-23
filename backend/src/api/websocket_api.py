from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from pydantic import ValidationError

from model.client import ClientMeta
from presentation.model.client import ClientInfo
from service.websocket_service import WebSocketService


router = APIRouter(prefix="/api")


def get_ws_service(ws: WebSocket) -> WebSocketService:
    return ws.app.state.websocket_service


@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    service: WebSocketService = Depends(get_ws_service),
):
    client_id: str | None = None

    try:
        await websocket.accept()

        raw = await websocket.receive_json()

        try:
            c = ClientInfo.model_validate(raw)
        except ValidationError:
            await websocket.close(code=1008)
            return

        meta = ClientMeta(
            host_name=c.host_name,
            ip_address=c.ip_address,
            mac_address=c.mac_address,
            description=c.description,
        )

        client_id = await service.connect(websocket, meta)

        while True:
            await websocket.receive_text()

    except WebSocketDisconnect:
        pass

    finally:
        if client_id:
            service.disconnect(client_id)
