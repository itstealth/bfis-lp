import { NextResponse } from 'next/server';
import { writeTokens, readTokens } from '@/lib/zoho-token-manager';

/**
 * Zoho OAuth - Step 2: Handle Callback and Exchange Code for Tokens
 * This endpoint is called by Zoho after user authorizes
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    // Handle authorization errors
    if (error) {
      return NextResponse.json(
        { error: `Authorization failed: ${error}` },
        { status: 400 }
      );
    }

    if (!code) {
      return NextResponse.json(
        { error: 'No authorization code received' },
        { status: 400 }
      );
    }

    // Exchange authorization code for access and refresh tokens
    const tokenParams = new URLSearchParams({
      code: code,
      client_id: process.env.ZOHO_CLIENT_ID,
      client_secret: process.env.ZOHO_CLIENT_SECRET,
      redirect_uri: process.env.ZOHO_REDIRECT_URI,
      grant_type: 'authorization_code'
    });

    console.log('🔄 Exchanging code for tokens...');
    console.log('📤 Token request params:', {
      code: code.substring(0, 20) + '...',
      client_id: process.env.ZOHO_CLIENT_ID?.substring(0, 20) + '...',
      redirect_uri: process.env.ZOHO_REDIRECT_URI,
      grant_type: 'authorization_code'
    });

    const tokenResponse = await fetch(
      `${process.env.ZOHO_ACCOUNTS_URL}/oauth/v2/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: tokenParams.toString()
      }
    );

    console.log('📥 Token response status:', tokenResponse.status);

    const tokens = await tokenResponse.json();
    
    // Log full response for debugging
    console.log('📥 Full Zoho response:', JSON.stringify(tokens, null, 2));

    if (!tokenResponse.ok) {
      console.error('❌ Token exchange failed with status:', tokenResponse.status);
      console.error('❌ Error details:', tokens);
      return NextResponse.json(
        { 
          error: 'Failed to exchange code for tokens', 
          details: tokens,
          status: tokenResponse.status 
        },
        { status: 400 }
      );
    }

    // Validate token response
    if (!tokens.access_token || !tokens.refresh_token) {
      console.error('❌ Invalid token response - missing tokens');
      console.error('Response received:', tokens);
      return NextResponse.json(
        { 
          error: 'Invalid token response from Zoho',
          details: 'access_token or refresh_token missing',
          response: tokens
        },
        { status: 500 }
      );
    }

    console.log('✅ Tokens received from Zoho:', {
      has_access_token: !!tokens.access_token,
      has_refresh_token: !!tokens.refresh_token,
      expires_in: tokens.expires_in,
      token_type: tokens.token_type
    });

    // Save tokens to file system
    const saved = writeTokens({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: tokens.expires_in,
      api_domain: tokens.api_domain,
      token_type: tokens.token_type
    });

    if (!saved) {
      console.error('❌ Failed to save tokens to file system');
      return NextResponse.json(
        { error: 'Failed to save tokens' },
        { status: 500 }
      );
    }

    console.log('✅ Tokens saved successfully to zoho-tokens.json');

    // Verify tokens were saved by reading them back
    const savedTokens = readTokens();
    const verificationMessage = savedTokens 
      ? '✅ Tokens verified and ready to use!' 
      : '⚠️ Warning: Tokens may not have been saved correctly';

    console.log(verificationMessage);

    // Success! Return a friendly HTML page
    const successHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Zoho CRM Connected</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
              background: white;
              padding: 3rem;
              border-radius: 1rem;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
              text-align: center;
              max-width: 500px;
            }
            .success-icon {
              font-size: 4rem;
              margin-bottom: 1rem;
            }
            h1 {
              color: #10b981;
              margin-bottom: 1rem;
            }
            p {
              color: #6b7280;
              line-height: 1.6;
            }
            .info {
              background: #f3f4f6;
              padding: 1rem;
              border-radius: 0.5rem;
              margin-top: 1.5rem;
              font-size: 0.875rem;
            }
            .close-btn {
              margin-top: 1.5rem;
              padding: 0.75rem 2rem;
              background: #667eea;
              color: white;
              border: none;
              border-radius: 0.5rem;
              font-size: 1rem;
              cursor: pointer;
              transition: background 0.3s;
            }
            .close-btn:hover {
              background: #5568d3;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success-icon">✅</div>
            <h1>Successfully Connected!</h1>
            <p>Your Zoho CRM integration is now active. Your lead form will automatically create leads in Zoho CRM.</p>
            <div class="info">
              <strong>Next Steps:</strong><br>
              You can close this window and test your form submission. All leads will be automatically captured in your Zoho CRM.
              <br><br>
              <small style="color: #10b981;">${verificationMessage}</small>
              <br><br>
              <a href="/api/zoho-debug" target="_blank" style="color: #667eea; text-decoration: underline;">
                View Integration Status
              </a>
            </div>
            <button class="close-btn" onclick="window.close()">Close Window</button>
          </div>
        </body>
      </html>
    `;

    return new NextResponse(successHtml, {
      headers: { 'Content-Type': 'text/html' }
    });

  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.json(
      { error: 'Failed to complete OAuth flow', details: error.message },
      { status: 500 }
    );
  }
}

