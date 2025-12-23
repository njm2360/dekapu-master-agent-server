import uuid
from fastapi import WebSocket
from dataclasses import dataclass
from fastapi.encoders import jsonable_encoder

from model.client import ClientMeta, ClientMetaWithId


@dataclass
class Client:
    id: str
    websocket: WebSocket
    meta: ClientMeta


class WebSocketService:
    def __init__(self):
        self.clients: dict[str, Client] = {}

    async def connect(
        self,
        websocket: WebSocket,
        meta: ClientMeta,
    ) -> str:
        client_id = str(uuid.uuid4())

        self.clients[client_id] = Client(
            id=client_id,
            websocket=websocket,
            meta=meta,
        )

        return client_id

    def disconnect(self, host_name: str):
        self.clients.pop(host_name, None)

    async def send(self, client_id: str, message: dict):
        client = self.clients.get(client_id)
        if not client:
            raise ValueError("client not connected")

        safe_message = jsonable_encoder(message)
        await client.websocket.send_json(safe_message)

    def get_clients(self) -> list[ClientMetaWithId]:
        return [
            ClientMetaWithId(id=client.id, **client.meta.__dict__)
            for client in self.clients.values()
        ]
