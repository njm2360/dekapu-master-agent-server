from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class ClientMeta:
    host_name: str
    ip_address: str
    mac_address: str
    description: Optional[str] = None


@dataclass(frozen=True)
class ClientMetaWithId(ClientMeta):
    id: str = None
