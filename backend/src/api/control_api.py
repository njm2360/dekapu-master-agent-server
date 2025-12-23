from typing import List
from fastapi import APIRouter, Depends, Request
from presentation.model.client import ClientInfoResponse
from model.launch_option import LaunchOptions
from presentation.model.wol_option import WolOption
from service.control_service import ControlService


def get_ctrl_service(request: Request) -> ControlService:
    return request.app.state.control_service


router = APIRouter(prefix="/api/control")


@router.get("/clients", response_model=List[ClientInfoResponse])
async def get_clients(
    service: ControlService = Depends(get_ctrl_service),
):
    clients = service.get_clients()

    return [
        ClientInfoResponse(
            id=client.id,
            host_name=client.host_name,
            ip_address=client.ip_address,
            mac_address=client.mac_address,
            description=client.description,
        )
        for client in clients
    ]


@router.post("/{client_id}/launch")
async def launch_instance(
    client_id: str,
    body: LaunchOptions,
    service: ControlService = Depends(get_ctrl_service),
):
    return await service.launch_instance(client_id, body)


@router.post("/wol")
async def send_wol_packet(
    body: WolOption,
    service: ControlService = Depends(get_ctrl_service),
):
    return await service.send_wol_packet(body.mac_address)
