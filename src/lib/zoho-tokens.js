import { promises as fs } from 'fs';
import path from 'path';

const TOKEN_FILE = path.join(process.cwd(), '.zoho-tokens.json');

/**
 * Read tokens from file
 */
export async function getTokens() {
  try {
    const data = await fs.readFile(TOKEN_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist or can't be read
    return null;
  }
}

/**
 * Save tokens to file
 */
export async function saveTokens(tokens) {
  try {
    await fs.writeFile(TOKEN_FILE, JSON.stringify(tokens, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving tokens:', error);
    return false;
  }
}

/**
 * Get access token (from file or env)
 */
export async function getAccessToken() {
  // First try to get from file
  const tokens = await getTokens();
  if (tokens?.access_token) {
    return tokens.access_token;
  }
  
  // Fallback to environment variable
  return process.env.ZOHO_ACCESS_TOKEN;
}

/**
 * Get refresh token (from file or env)
 */
export async function getRefreshToken() {
  // First try to get from file
  const tokens = await getTokens();
  if (tokens?.refresh_token) {
    return tokens.refresh_token;
  }
  
  // Fallback to environment variable
  return process.env.ZOHO_REFRESH_TOKEN;
}

/**
 * Update access token (after refresh)
 */
export async function updateAccessToken(newAccessToken) {
  const tokens = await getTokens() || {};
  tokens.access_token = newAccessToken;
  tokens.updated_at = new Date().toISOString();
  await saveTokens(tokens);
}

