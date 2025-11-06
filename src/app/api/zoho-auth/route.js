import { NextResponse } from 'next/server';

/**
 * Zoho OAuth - Step 1: Initiate Authentication
 * Visit this endpoint to start the OAuth flow
 */
export async function GET() {
  try {
    const clientId = process.env.ZOHO_CLIENT_ID;
    const redirectUri = process.env.ZOHO_REDIRECT_URI;
    const accountsUrl = process.env.ZOHO_ACCOUNTS_URL;

    console.log('🔐 Starting Zoho OAuth flow...');
    console.log('📋 Configuration:', {
      clientId: clientId?.substring(0, 20) + '...',
      redirectUri,
      accountsUrl,
      hasClientId: !!clientId,
      hasRedirectUri: !!redirectUri,
      hasAccountsUrl: !!accountsUrl
    });

    if (!clientId || !redirectUri || !accountsUrl) {
      console.error('❌ Missing required environment variables');
      return NextResponse.json(
        { 
          error: 'Missing Zoho configuration. Please check your environment variables.',
          missing: {
            clientId: !clientId,
            redirectUri: !redirectUri,
            accountsUrl: !accountsUrl
          }
        },
        { status: 500 }
      );
    }

    // Build OAuth URL with required scopes
    const scope = 'ZohoCRM.modules.ALL,ZohoCRM.settings.ALL';
    const accessType = 'offline'; // To get refresh token
    
    const authUrl = `${accountsUrl}/oauth/v2/auth?` + new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      scope: scope,
      redirect_uri: redirectUri,
      access_type: accessType,
      prompt: 'consent'
    }).toString();

    console.log('🌐 Redirecting to Zoho authorization URL');
    console.log('🔗 Auth URL:', authUrl.replace(clientId, clientId.substring(0, 20) + '...'));

    // Redirect user to Zoho's authorization page
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Zoho auth error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Zoho authentication' },
      { status: 500 }
    );
  }
}

