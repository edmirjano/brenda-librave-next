# Environment Setup for Brënda Librave

This file explains how to set up your environment variables for development.

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Database Configuration
DATABASE_URL="file:./dev.db"

# NextAuth.js Configuration
NEXTAUTH_SECRET="your-development-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Application Settings
NODE_ENV="development"
NEXT_PUBLIC_APP_NAME="Brënda Librave"
NEXT_PUBLIC_DEFAULT_LANGUAGE="sq"
NEXT_PUBLIC_DEFAULT_CURRENCY="ALL"
```

## Optional Environment Variables

For additional features, you can add:

```bash
# Monitoring & Error Tracking (optional for development)
SENTRY_DSN="your-sentry-dsn-here"
SENTRY_ORG="brenda-librave"
SENTRY_PROJECT="brenda-librave"

# PayPal Integration (for testing - use sandbox)
PAYPAL_CLIENT_ID="your-paypal-sandbox-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-sandbox-secret"
PAYPAL_MODE="sandbox"

# Google Analytics (optional for development)
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

## Quick Setup

Run these commands to create your `.env.local` file:

```bash
echo 'DATABASE_URL="file:./dev.db"' > .env.local
echo 'NEXTAUTH_SECRET="your-development-secret-key"' >> .env.local
echo 'NEXTAUTH_URL="http://localhost:3000"' >> .env.local
echo 'NODE_ENV="development"' >> .env.local
```

## Production Environment

For production deployment on Netlify:

- Use Neon PostgreSQL for DATABASE_URL
- Generate a secure NEXTAUTH_SECRET
- Set NEXTAUTH_URL to your production domain
- Configure Sentry DSN for error tracking

## Security Notes

- Never commit `.env.local` to version control
- Use strong, unique secrets for production
- Rotate secrets regularly
- Use environment-specific configurations
