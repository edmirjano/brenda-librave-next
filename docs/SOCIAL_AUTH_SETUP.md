# Social Authentication Setup

This document explains how to configure Google, Apple, and Facebook sign-in for the Brënda Librave application.

## Overview

The application now supports social authentication through:
- **Google OAuth 2.0**
- **Facebook Login**
- **Apple Sign In**

All users who register through social authentication are automatically assigned the `USER` role.

## Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Facebook OAuth
FACEBOOK_CLIENT_ID="your-facebook-app-id"
FACEBOOK_CLIENT_SECRET="your-facebook-app-secret"

# Apple OAuth
APPLE_ID="your-apple-service-id"
APPLE_SECRET="your-apple-private-key-or-client-secret"
```

## Provider Setup

### Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
6. Copy the Client ID and Client Secret to your environment variables

### Facebook App Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or use an existing one
3. Add "Facebook Login" product
4. Configure OAuth redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/facebook`
   - Production: `https://yourdomain.com/api/auth/callback/facebook`
5. Copy the App ID and App Secret to your environment variables

### Apple Sign In Setup

1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Create a new App ID or use an existing one
3. Enable "Sign In with Apple" capability
4. Create a Service ID for web authentication
5. Configure domains and redirect URLs:
   - Development: `http://localhost:3000/api/auth/callback/apple`
   - Production: `https://yourdomain.com/api/auth/callback/apple`
6. Generate a private key for Sign In with Apple
7. Copy the Service ID and private key to your environment variables

## Features

### User Experience
- Social sign-in buttons are available on both login and register pages
- Users can sign in with their existing Google, Facebook, or Apple accounts
- Seamless registration process - no additional form filling required
- Consistent branding with platform-specific button styles

### Backend Implementation
- NextAuth.js handles all OAuth flows
- Automatic user creation in database for new social sign-ins
- All social auth users get `USER` role by default
- Proper error handling and logging
- Session management across all providers

### Security Features
- Secure token handling
- CSRF protection
- Proper callback URL validation
- Session security with JWT tokens

## Database Schema

The existing Prisma schema already supports social authentication:

- `User.password` is nullable for social auth users
- `User.role` defaults to `USER`
- `Account` model stores OAuth provider information
- `Session` model handles NextAuth sessions

## Usage

Users can now:
1. Click on any social provider button on login/register pages
2. Complete OAuth flow with the provider
3. Be automatically signed in and redirected
4. Access all user features with their social account

## Troubleshooting

### Common Issues

1. **Invalid redirect URI**: Ensure all callback URLs are properly configured in each provider's settings
2. **Missing environment variables**: Check that all required variables are set in `.env.local`
3. **HTTPS requirement**: Some providers require HTTPS in production

### Development Notes

- Social authentication works in development with localhost URLs
- For production deployment, ensure proper HTTPS configuration
- Test each provider thoroughly before deploying

## Development vs Production

### Development
- Use localhost URLs in provider configurations
- Ensure `.env.local` has all required variables
- Test social sign-in flows thoroughly

### Production
- Update all provider configurations with production URLs
- Use secure environment variable management
- Enable HTTPS for all OAuth callbacks
- Monitor authentication logs for issues