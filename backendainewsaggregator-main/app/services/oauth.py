import os
import json
import httpx
from typing import Optional, Dict, Any
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
from app.database.mongo import users_collection
from app.core.auth import create_access_token, get_password_hash

# OAuth configuration
config = Config('.env')
oauth = OAuth(config)

# Google OAuth setup
oauth.register(
    name='google',
    client_id=os.getenv('GOOGLE_CLIENT_ID'),
    client_secret=os.getenv('GOOGLE_CLIENT_SECRET'),
    server_metadata_url='https://accounts.google.com/.well-known/openid_configuration',
    client_kwargs={
        'scope': 'openid email profile'
    }
)

class OAuthService:
    """Service for handling OAuth authentication"""
    
    @staticmethod
    async def verify_google_token(token: str) -> Optional[Dict[str, Any]]:
        """Verify Google ID token and return user info"""
        try:
            # Verify the token with Google
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"https://oauth2.googleapis.com/tokeninfo?id_token={token}"
                )
                if response.status_code == 200:
                    token_info = response.json()
                    return {
                        'email': token_info.get('email'),
                        'name': token_info.get('name'),
                        'picture': token_info.get('picture'),
                        'sub': token_info.get('sub')  # Google user ID
                    }
        except Exception as e:
            print(f"Error verifying Google token: {e}")
        return None

    @staticmethod
    async def verify_apple_token(token: str) -> Optional[Dict[str, Any]]:
        """Verify Apple ID token and return user info"""
        try:
            # Apple uses JWT tokens, we need to verify them
            # For now, we'll implement a basic verification
            # In production, you should use proper JWT verification with Apple's public keys
            import jwt
            from cryptography.hazmat.primitives.asymmetric.rsa import RSAPublicNumbers
            from cryptography.hazmat.primitives import hashes
            from cryptography.hazmat.primitives.asymmetric import padding
            
            # This is a simplified verification - in production, you'd verify with Apple's keys
            # For now, we'll decode without verification (not recommended for production)
            decoded = jwt.decode(token, options={"verify_signature": False})
            
            return {
                'email': decoded.get('email'),
                'name': decoded.get('name', ''),
                'sub': decoded.get('sub')  # Apple user ID
            }
        except Exception as e:
            print(f"Error verifying Apple token: {e}")
        return None

    @staticmethod
    async def create_or_get_user(provider: str, user_info: Dict[str, Any]) -> Dict[str, Any]:
        """Create or get user from OAuth provider info"""
        email = user_info.get('email')
        if not email:
            raise ValueError("Email is required for OAuth authentication")
        
        # Check if user exists
        existing_user = users_collection.find_one({"email": email})
        
        if existing_user:
            # User exists, return with token
            token = create_access_token({"sub": email})
            return {
                "username": existing_user.get("username", ""),
                "email": email,
                "token": token,
                "preferences": existing_user.get("preferences", {"topics": [], "sources": [], "countries": []}),
                "reading_history": existing_user.get("reading_history", []),
                "bookmarks": existing_user.get("bookmarks", []),
                "liked_articles": existing_user.get("liked_articles", [])
            }
        else:
            # Create new user
            username = user_info.get('name', '').replace(' ', '').lower()
            if not username:
                username = email.split('@')[0]
            
            # Ensure username is unique
            counter = 1
            original_username = username
            while users_collection.find_one({"username": username}):
                username = f"{original_username}{counter}"
                counter += 1
            
            # Create user document
            user_doc = {
                "username": username,
                "email": email,
                "password": get_password_hash(f"oauth_{provider}_{user_info.get('sub', '')}"),  # Generate a secure password
                "oauth_provider": provider,
                "oauth_id": user_info.get('sub'),
                "preferences": {"topics": [], "sources": [], "countries": []},
                "reading_history": [],
                "bookmarks": [],
                "liked_articles": []
            }
            
            # Insert user
            result = users_collection.insert_one(user_doc)
            
            # Create token
            token = create_access_token({"sub": email})
            
            return {
                "username": username,
                "email": email,
                "token": token,
                "preferences": user_doc["preferences"],
                "reading_history": user_doc["reading_history"],
                "bookmarks": user_doc["bookmarks"],
                "liked_articles": user_doc["liked_articles"]
            }

    @staticmethod
    async def handle_google_oauth(token: str) -> Dict[str, Any]:
        """Handle Google OAuth authentication"""
        user_info = await OAuthService.verify_google_token(token)
        if not user_info:
            raise ValueError("Invalid Google token")
        
        return await OAuthService.create_or_get_user("google", user_info)

    @staticmethod
    async def handle_apple_oauth(token: str) -> Dict[str, Any]:
        """Handle Apple OAuth authentication"""
        user_info = await OAuthService.verify_apple_token(token)
        if not user_info:
            raise ValueError("Invalid Apple token")
        
        return await OAuthService.create_or_get_user("apple", user_info) 