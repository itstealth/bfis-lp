# Zoho CRM Integration Setup Guide

This guide will help you set up the Zoho CRM integration for capturing leads from the enquiry form.

## Prerequisites

- Zoho CRM account
- Zoho API Console access

## Step 1: Install Dependencies

```bash
npm install
```

The integration uses the native `fetch` API, so no additional dependencies are required.

## Step 2: Configure Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```env
# Zoho CRM OAuth Configuration
ZOHO_CLIENT_ID=your_client_id_here
ZOHO_CLIENT_SECRET=your_client_secret_here

# Redirect URI (must match the one configured in Zoho API Console)
# For local development:
ZOHO_REDIRECT_URI=http://localhost:3000/api/zoho-callback
# For production (update in Vercel):
# ZOHO_REDIRECT_URI=https://bfis-lp.vercel.app/api/zoho-callback

# Access Token (obtained after OAuth flow)
ZOHO_ACCESS_TOKEN=your_access_token_here

# Refresh Token (obtained after OAuth flow)
ZOHO_REFRESH_TOKEN=your_refresh_token_here
```

## Step 3: Set Up Zoho OAuth

1. Go to [Zoho API Console](https://api-console.zoho.com/)
2. Create a new Server-based Application
3. Add the following Authorized Redirect URIs:
   - `http://localhost:3000/api/zoho-callback` (for local development)
   - `https://bfis-lp.vercel.app/api/zoho-callback` (for production)
4. Copy the Client ID and Client Secret to your `.env.local` file
5. Set the appropriate `ZOHO_REDIRECT_URI` based on your environment

## Step 4: Complete OAuth Flow

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000/api/zoho-auth` in your browser

3. Log in with your Zoho account and authorize the application

4. You'll be redirected to `/api/zoho-callback` which will display your tokens

5. Copy the `access_token` and `refresh_token` from the response and add them to your `.env.local` file:
   ```env
   ZOHO_ACCESS_TOKEN=your_access_token_here
   ZOHO_REFRESH_TOKEN=your_refresh_token_here
   ```

## Step 5: Test the Integration

1. Fill out the enquiry form on your homepage
2. Submit the form
3. Check your Zoho CRM Leads module to verify the lead was created

## Step 6: Deploy to Vercel

1. Add all environment variables to Vercel:
   - Go to your project settings in Vercel
   - Navigate to Settings → Environment Variables
   - Add all the variables from your `.env.local` file

2. Make sure to update `ZOHO_REDIRECT_URI` to your production URL:
   ```env
   ZOHO_REDIRECT_URI=https://bfis-lp.vercel.app/api/zoho-callback
   ```

3. Redeploy your application

## API Routes

The integration includes three API routes:

- `/api/zoho-auth` - Initiates the OAuth flow
- `/api/zoho-callback` - Handles the OAuth callback and token exchange
- `/api/zoho-lead` - Submits lead data to Zoho CRM

## Troubleshooting

### Token Expiration

Access tokens expire after 1 hour. The system will attempt to refresh the token automatically using the refresh token. If refresh fails, you'll need to re-authenticate by visiting `/api/zoho-auth`.

### Common Issues

1. **"Zoho credentials not configured"** - Make sure all environment variables are set correctly
2. **"Token exchange failed"** - Verify your Client ID, Client Secret, and Redirect URI match your Zoho API Console settings
3. **"Failed to submit lead"** - Check that your access token is valid and hasn't expired

## Security Notes

- Never commit your `.env.local` file to version control
- Store tokens securely in production (consider using a database for token storage)
- The current implementation stores tokens in environment variables, which is fine for development but should be upgraded to a database in production

