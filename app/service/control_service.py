import re
import socket
from app.model.launch_option import LaunchOptions
from app.service.websocket_service import WebSocketService


class ControlService:
    def __init__(self, ws_service: WebSocketService):
        self.ws_service = ws_service

    def get_clients(self):
        return self.ws_service.get_clients()

    async def launch_instance(self, client_id: str, launch_options: LaunchOptions):
        await self.ws_service.send(
            client_id,
            launch_options.model_dump(by_alias=True),
        )

    async def send_wol_packet(self, mac_address: str):
        mac = self._normalize_mac(mac_address)
        magic_packet = b"\xff" * 6 + mac * 16

        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        try:
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
            sock.sendto(magic_packet, ("255.255.255.255", 9))
        finally:
            sock.close()

    def _normalize_mac(self, mac: str) -> bytes:
        clean = re.sub(r"[^0-9A-Fa-f]", "", mac)
        if len(clean) != 12:
            raise ValueError("Invalid MAC address format")

        return bytes.fromhex(clean)
