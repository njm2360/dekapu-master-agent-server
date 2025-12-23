from fastapi import APIRouter, Depends, Request
from model.group import GroupInstance, GroupRole
from service.vrchat.group_service import GroupService


def get_group_service(request: Request) -> GroupService:
    return request.app.state.group_service


router = APIRouter(prefix="/api/groups")


@router.get("/{group_id}")
def get_group_info(
    group_id: str,
    service: GroupService = Depends(get_group_service),
):
    return service.get_group_info(group_id)


@router.get("/{group_id}/announcement")
def get_announcement(
    group_id: str,
    service: GroupService = Depends(get_group_service),
):
    return service.get_announcement(group_id)


@router.get("/{group_id}/instances", response_model=list[GroupInstance])
def list_instances(
    group_id: str,
    service: GroupService = Depends(get_group_service),
):
    return service.list_instances(group_id)


@router.get("/{group_id}/roles", response_model=list[GroupRole])
def get_roles(
    group_id: str,
    service: GroupService = Depends(get_group_service),
):
    return service.get_roles(group_id)
