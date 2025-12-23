from fastapi import APIRouter, Depends, Request

from model.instance import CreateInstanceConfig, InstanceInfo
from service.vrchat.instance_service import InstanceService


def get_instance_service(request: Request) -> InstanceService:
    return request.app.state.instance_service


router = APIRouter(prefix="/api/instances")


@router.post("/", response_model=InstanceInfo)
async def create_instance(
    body: CreateInstanceConfig,
    service: InstanceService = Depends(get_instance_service),
):
    return service.create_instance(body)


@router.get("/{world_id}:{instance_id}", response_model=InstanceInfo)
async def get_instance_info(
    world_id: str,
    instance_id: str,
    service: InstanceService = Depends(get_instance_service),
):
    return service.get_instance_info(world_id, instance_id)


@router.delete("/{world_id}:{instance_id}")
def close_instance(
    world_id: str,
    instance_id: str,
    service: InstanceService = Depends(get_instance_service),
):
    return service.close_instance(world_id, instance_id)
