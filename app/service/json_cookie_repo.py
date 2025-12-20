import os
import json
import time
import logging
from typing import Final
from requests import Session
from dataclasses import dataclass, asdict


@dataclass
class CookieData:
    name: str
    value: str
    domain: str
    path: str = "/"
    secure: bool = False
    expires: int | None = None


class JsonCookieRepo:
    AUTH_DOMAIN: Final[str] = "api.vrchat.cloud"
    AUTH_COOKIE: Final[str] = "auth"

    def __init__(self, cookie_file: str, session: Session) -> None:
        self.cookie_file = cookie_file
        self.session = session

    def save(self) -> None:
        cookies: list[CookieData] = []
        for c in self.session.cookies:
            cookies.append(
                CookieData(
                    name=c.name,
                    value=c.value,
                    domain=c.domain,
                    path=c.path,
                    secure=c.secure,
                    expires=c.expires,
                )
            )
        with open(self.cookie_file, "w", encoding="utf-8") as f:
            json.dump([asdict(c) for c in cookies], f, ensure_ascii=False)

    def load(self) -> None:
        if not os.path.exists(self.cookie_file):
            return

        with open(self.cookie_file, "r", encoding="utf-8") as f:
            cookies = json.load(f)

        for c in cookies:
            data = CookieData(**c)
            self.session.cookies.set(
                name=data.name,
                value=data.value,
                domain=data.domain,
                path=data.path,
                secure=data.secure,
                expires=data.expires,
            )

    def has_valid_auth_cookie(self) -> bool:
        now = time.time()
        for c in self.session.cookies:
            if (
                c.domain.lstrip(".") == self.AUTH_DOMAIN.lstrip(".")
                and c.name == self.AUTH_COOKIE
            ):
                if c.expires is None or c.expires > now:
                    return True
                logging.info(
                    f"Cookie '{self.AUTH_COOKIE}' expired at {time.ctime(c.expires)}"
                )
        return False
