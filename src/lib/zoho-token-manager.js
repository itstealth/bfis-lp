/**
 * Zoho Token Manager
 * Handles token storage, retrieval, and refresh logic
 */

import fs from 'fs';
import path from 'path';

const TOKEN_FILE_PATH = path.join(process.cwd(), 'zoho-tokens.json');

/**
 * Read tokens from file system
 */
export function readTokens() {
  try {
    console.log('📖 Reading tokens from:', TOKEN_FILE_PATH);
    
    if (fs.existsSync(TOKEN_FILE_PATH)) {
      const data = fs.readFileSync(TOKEN_FILE_PATH, 'utf8');
      const tokens = JSON.parse(data);
      
      console.log('✅ Tokens found:', {
        has_access_token: !!tokens.access_token,
        has_refresh_token: !!tokens.refresh_token,
        expires_at: tokens.expires_at ? new Date(tokens.expires_at).toISOString() : 'not set',
        is_expired: isTokenExpired(tokens)
      });
      
      return tokens;
    } else {
      console.log('❌ Token file does not exist at:', TOKEN_FILE_PATH);
    }
  } catch (error) {
    console.error('❌ Error reading tokens:', error);
    console.error('Error details:', error.message);
  }
  return null;
}

/**
 * Write tokens to file system
 */
export function writeTokens(tokens) {
  try {
    // Validate required fields
    if (!tokens.access_token || !tokens.refresh_token) {
      console.error('❌ Invalid tokens: missing access_token or refresh_token');
      console.error('Received tokens:', tokens);
      return false;
    }

    // Calculate expires_at with validation
    let expiresAt;
    if (tokens.expires_at) {
      expiresAt = tokens.expires_at;
    } else if (tokens.expires_in && !isNaN(tokens.expires_in)) {
      // expires_in is in seconds, convert to milliseconds
      expiresAt = Date.now() + (parseInt(tokens.expires_in) * 1000);
    } else {
      // Default to 1 hour if no expiry info
      console.warn('⚠️ No valid expires_in provided, defaulting to 1 hour');
      expiresAt = Date.now() + (3600 * 1000);
    }

    const tokenData = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: expiresAt,
      api_domain: tokens.api_domain || process.env.ZOHO_API_URL,
      token_type: tokens.token_type || 'Bearer',
      created_at: new Date().toISOString()
    };
    
    console.log('📝 Writing tokens to:', TOKEN_FILE_PATH);
    console.log('📝 Token data:', {
      has_access_token: !!tokenData.access_token,
      has_refresh_token: !!tokenData.refresh_token,
      expires_at: new Date(tokenData.expires_at).toISOString(),
      api_domain: tokenData.api_domain
    });
    
    fs.writeFileSync(TOKEN_FILE_PATH, JSON.stringify(tokenData, null, 2), 'utf8');
    
    // Verify the file was written
    if (fs.existsSync(TOKEN_FILE_PATH)) {
      console.log('✅ Token file created successfully');
      return true;
    } else {
      console.error('❌ Token file was not created');
      return false;
    }
  } catch (error) {
    console.error('❌ Error writing tokens:', error);
    console.error('Error details:', error.message);
    console.error('Token object received:', tokens);
    return false;
  }
}

/**
 * Check if access token is expired
 */
export function isTokenExpired(tokens) {
  if (!tokens || !tokens.expires_at) return true;
  // Add 5 minute buffer
  return Date.now() >= (tokens.expires_at - 300000);
}

/**
 * Refresh the access token using refresh token
 */
export async function refreshAccessToken() {
  const tokens = readTokens();
  
  if (!tokens || !tokens.refresh_token) {
    throw new Error('No refresh token available. Please re-authenticate.');
  }

  const params = new URLSearchParams({
    refresh_token: tokens.refresh_token,
    client_id: process.env.ZOHO_CLIENT_ID,
    client_secret: process.env.ZOHO_CLIENT_SECRET,
    grant_type: 'refresh_token'
  });

  const response = await fetch(`${process.env.ZOHO_ACCOUNTS_URL}/oauth/v2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Token refresh failed: ${errorData.error || 'Unknown error'}`);
  }

  const data = await response.json();
  
  // Update tokens with new access token
  const updatedTokens = {
    ...tokens,
    access_token: data.access_token,
    expires_at: Date.now() + (data.expires_in * 1000)
  };

  writeTokens(updatedTokens);
  return updatedTokens;
}

/**
 * Get valid access token (refreshes if needed)
 */
export async function getValidAccessToken() {
  let tokens = readTokens();
  
  if (!tokens) {
    throw new Error('No tokens found. Please authenticate first by visiting /api/zoho-auth');
  }

  if (isTokenExpired(tokens)) {
    console.log('Token expired, refreshing...');
    tokens = await refreshAccessToken();
  }

  return tokens.access_token;
}

