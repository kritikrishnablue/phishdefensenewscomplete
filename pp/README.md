<<<<<<< HEAD
# PhishNews Frontend

A modern news aggregator application with AI-powered summarization and personalized content delivery.

## Features

### Authentication
- **Enhanced Registration**: Username, email, and password fields with validation
- **OAuth Integration**: Google and Apple sign-in with secure token verification
- **Password Security**: Show/hide password functionality with confirmation
- **Form Validation**: Real-time validation with error messages
- **Cross-linking**: Easy navigation between login and register pages

### News Features
- **Multi-source News**: NewsAPI, GNews, and RSS feeds
- **AI Summarization**: Automated article summarization
- **Personalization**: User preferences and reading history
- **Bookmarking**: Save articles for later reading
- **Search**: Advanced search with filters and date ranges
- **Categories**: Browse news by categories
- **Trending**: View trending articles

### User Experience
- **Dark Theme**: Modern dark interface
- **Responsive Design**: Works on all device sizes
- **Real-time Updates**: Live news updates
- **Location-based**: Automatic country detection
- **User Profiles**: Manage preferences and view statistics

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up OAuth credentials (see OAUTH_SETUP.md for detailed instructions):
```bash
# Create .env file with OAuth credentials
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_APPLE_CLIENT_ID=your_apple_client_id
VITE_APPLE_REDIRECT_URI=http://localhost:5173/auth/apple/callback
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Backend Requirements

Make sure the backend server is running on `http://127.0.0.1:8000` with the following features:
- User authentication with username support
- OAuth endpoints for Google and Apple authentication
- News API integration
- RSS feed processing
- User preferences management

## OAuth Implementation

The application now includes full OAuth support:

### Google OAuth
- Uses Google Identity Services SDK
- Secure token verification on backend
- Automatic user creation/login
- Profile information extraction

### Apple OAuth
- Uses Apple Sign-In SDK
- JWT token verification
- Secure user authentication
- Privacy-focused implementation

### Backend OAuth Endpoints
- `POST /auth/oauth/google` - Google OAuth authentication
- `POST /auth/oauth/apple` - Apple OAuth authentication
- `POST /auth/oauth/{provider}` - Generic OAuth endpoint

## Registration Features

The registration page now includes:
- **Username field** with validation (minimum 3 characters)
- **Email field** with format validation
- **Password field** with show/hide toggle
- **Confirm password** field with matching validation
- **Google Sign-in** with full OAuth flow
- **Apple Sign-in** with full OAuth flow
- **Login link** for existing users
- **Terms and Privacy** links
- **Real-time validation** with error messages

## Technology Stack

- **React 19** with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **React Icons** for icons
- **Context API** for state management
- **Google Identity Services** for Google OAuth
- **Apple Sign-In SDK** for Apple OAuth

## OAuth Security

- All OAuth tokens are verified on the backend
- Secure token storage and transmission
- Environment variable configuration
- CSRF protection ready
- HTTPS enforcement in production

For detailed OAuth setup instructions, see [OAUTH_SETUP.md](./OAUTH_SETUP.md).
=======
.
>>>>>>> 870f6a2f9f67484bf69606093416de91b94bf000
