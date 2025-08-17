from pydantic import BaseModel
from typing import Optional

class OAuthRequest(BaseModel):
    token: str
    provider: str  # "google" or "apple"

class OAuthResponse(BaseModel):
    username: str
    email: str
    token: str
    preferences: Optional[dict] = None
    reading_history: Optional[list] = None
    bookmarks: Optional[list] = None
    liked_articles: Optional[list] = None
    oauth_provider: Optional[str] = None 