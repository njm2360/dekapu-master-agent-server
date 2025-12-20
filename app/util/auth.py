import pyotp
import logging
import requests
from typing import Final
from requests.auth import HTTPBasicAuth

from app.config import Config
from app.util.http import HttpClient
from app.model.vrchat import AuthVerifyResponse
from app.service.json_cookie_repo import JsonCookieRepo


class AuthError(Exception):
    pass


class AuthManager:
    BASE_URL: Final[str] = "https://api.vrchat.cloud/api/1"
    AUTH_DOMAIN: Final[str] = "api.vrchat.cloud"
    AUTH_COOKIE: Final[str] = "auth"

    def __init__(self, http: HttpClient, config: Config) -> None:
        self.http = http
        self.config = config

        self.session = http.session
        self.cookie_repo = JsonCookieRepo(config.cookie_file, self.session)

    @staticmethod
    def generate_totp(secret: str) -> str:
        totp = pyotp.TOTP(secret.replace(" ", ""))
        return totp.now()

    def load_session(self):
        self.cookie_repo.load()

    def save_session(self):
        self.cookie_repo.save()

    def ensure_logged_in(self) -> bool:
        if not self.cookie_repo.has_valid_auth_cookie():
            return self.login()

        try:
            resp = self.http.request("GET", f"{self.BASE_URL}/auth/user")
            resp.raise_for_status()
            return True
        except requests.HTTPError as e:
            if e.response is not None and e.response.status_code == 401:
                return self.login()
            raise
        except Exception as e:
            logging.error(f"Unexpected error: {e}")
            return False

    def login(self) -> bool:
        try:
            response = self.http.request(
                "GET",
                f"{self.BASE_URL}/auth/user",
                auth=HTTPBasicAuth(self.config.username, self.config.password),
            )
            response.raise_for_status()
            data = response.json()

            if (
                "requiresTwoFactorAuth" not in data
                or "totp" not in data["requiresTwoFactorAuth"]
            ):
                logging.error("TOTP is not required in the response")
                return False

            if not self.cookie_repo.has_valid_auth_cookie():
                logging.error("Auth Cookie not found after login")
                return False

            current_otp = self.generate_totp(self.config.totp_secret)
            verify_resp = self.http.request(
                "POST",
                f"{self.BASE_URL}/auth/twofactorauth/totp/verify",
                data={"code": current_otp},
            )
            verify_resp.raise_for_status()

            verify_data = AuthVerifyResponse(**verify_resp.json())
            if not verify_data.verified:
                logging.error("TOTP verification failed")
                return False

            return True

        except Exception as e:
            logging.error(f"Unexpected error: {e}")
            return False
