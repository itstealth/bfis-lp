import { NextResponse } from 'next/server';
import { readTokens, isTokenExpired } from '@/lib/zoho-token-manager';
import path from 'path';
import fs from 'fs';

/**
 * Debug endpoint to check Zoho integration status
 * Visit: http://localhost:3000/api/zoho-debug
 */
export async function GET() {
  try {
    const tokenFilePath = path.join(process.cwd(), 'zoho-tokens.json');
    
    // Check if file exists
    const fileExists = fs.existsSync(tokenFilePath);
    
    // Try to read tokens
    const tokens = readTokens();
    
    // Check environment variables
    const envVarsSet = {
      ZOHO_CLIENT_ID: !!process.env.ZOHO_CLIENT_ID,
      ZOHO_CLIENT_SECRET: !!process.env.ZOHO_CLIENT_SECRET,
      ZOHO_REDIRECT_URI: !!process.env.ZOHO_REDIRECT_URI,
      ZOHO_ACCOUNTS_URL: !!process.env.ZOHO_ACCOUNTS_URL,
      ZOHO_API_URL: !!process.env.ZOHO_API_URL,
    };
    
    const debugInfo = {
      status: tokens ? 'AUTHENTICATED' : 'NOT AUTHENTICATED',
      timestamp: new Date().toISOString(),
      tokenFile: {
        path: tokenFilePath,
        exists: fileExists,
        readable: fileExists ? true : false,
      },
      tokens: tokens ? {
        hasAccessToken: !!tokens.access_token,
        hasRefreshToken: !!tokens.refresh_token,
        accessTokenLength: tokens.access_token?.length || 0,
        refreshTokenLength: tokens.refresh_token?.length || 0,
        expiresAt: tokens.expires_at ? new Date(tokens.expires_at).toISOString() : null,
        isExpired: isTokenExpired(tokens),
        createdAt: tokens.created_at || 'unknown',
        apiDomain: tokens.api_domain || 'not set',
      } : null,
      environment: envVarsSet,
      allEnvVarsSet: Object.values(envVarsSet).every(v => v),
      workingDirectory: process.cwd(),
    };
    
    // Add recommendations
    const recommendations = [];
    
    if (!fileExists) {
      recommendations.push('❌ Token file does not exist. Please authenticate at /api/zoho-auth');
    }
    
    if (!tokens) {
      recommendations.push('❌ No tokens found. Visit /api/zoho-auth to authenticate');
    }
    
    if (tokens && isTokenExpired(tokens)) {
      recommendations.push('⚠️ Access token is expired. It will be refreshed automatically on next API call');
    }
    
    if (tokens && !isTokenExpired(tokens)) {
      recommendations.push('✅ Access token is valid and ready to use');
    }
    
    if (!debugInfo.allEnvVarsSet) {
      recommendations.push('❌ Some environment variables are missing. Check your .env.local file');
    }
    
    debugInfo.recommendations = recommendations;
    
    return NextResponse.json(debugInfo, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Debug check failed',
        message: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}

