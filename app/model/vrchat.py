from pydantic import BaseModel


class AuthVerifyResponse(BaseModel):
    verified: bool
