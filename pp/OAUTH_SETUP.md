# OAuth Setup Guide

This guide explains how to set up Google and Apple OAuth for the PhishNews application.

## Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```env
# OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_APPLE_CLIENT_ID=your_apple_client_id_here
VITE_APPLE_REDIRECT_URI=http://localhost:5173/auth/apple/callback
```

For the backend, add these to your `.env` file:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Apple OAuth
APPLE_CLIENT_ID=your_apple_client_id_here
APPLE_CLIENT_SECRET=your_apple_client_secret_here
```

## Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Set the authorized JavaScript origins to:
   - `http://localhost:5173` (for development)
   - `https://yourdomain.com` (for production)
6. Set the authorized redirect URIs to:
   - `http://localhost:5173/auth/google/callback` (for development)
   - `https://yourdomain.com/auth/google/callback` (for production)
7. Copy the Client ID and Client Secret

## Apple OAuth Setup

1. Go to the [Apple Developer Console](https://developer.apple.com/)
2. Create a new App ID or use an existing one
3. Enable "Sign In with Apple" capability
4. Create a Services ID for your domain
5. Configure the Services ID with your domain and redirect URI
6. Create a private key for the Services ID
7. Copy the Client ID and use the private key as the Client Secret

## Backend Dependencies

Install the required OAuth dependencies:

```bash
pip install authlib itsdangerous
```

## Frontend Dependencies

The OAuth functionality uses the Google and Apple SDKs which are loaded dynamically. No additional npm packages are required.

## Testing OAuth

1. Start the backend server: `uvicorn app.main:app --reload`
2. Start the frontend: `npm run dev`
3. Navigate to the registration page
4. Click on "Continue with Google" or "Continue with Apple"
5. Complete the OAuth flow

## Security Notes

- Never commit your OAuth secrets to version control
- Use environment variables for all sensitive configuration
- Implement proper CSRF protection in production
- Validate all OAuth tokens on the backend
- Use HTTPS in production

## Troubleshooting

### Google OAuth Issues
- Ensure the Client ID is correct
- Check that the authorized origins include your domain
- Verify the Google+ API is enabled

### Apple OAuth Issues
- Ensure the Services ID is properly configured
- Check that the redirect URI matches exactly
- Verify the private key is correctly formatted

### Backend Issues
- Check that all environment variables are set
- Verify the OAuth service is properly imported
- Check the logs for detailed error messages 