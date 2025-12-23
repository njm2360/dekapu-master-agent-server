import os
from pathlib import Path
from dotenv import load_dotenv


class ConfigError(Exception):
    pass


class Config:
    def __init__(self) -> None:
        load_dotenv(override=True)

        self.username: str = self._require_env("ID")
        self.password: str = self._require_env("PASSWORD")
        self.totp_secret: str = self._require_env("TOTP_SECRET")

        self.cookie_file = Path("data") / f"{self.username}.json"
        self.cookie_file.parent.mkdir(parents=True, exist_ok=True)

    @staticmethod
    def _require_env(key: str) -> str:
        value = os.getenv(key)
        if not value:
            raise ConfigError(f"Environment variable {key} is not set")
        return value
