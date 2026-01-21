<?php
/**
 * Zoho Token Manager - Shared Helper Functions
 * Handles token storage, retrieval, and validation
 */

/**
 * Read tokens from JSON file
 */
function readTokens() {
    $tokenFile = __DIR__ . '/zoho-tokens.json';
    
    if (!file_exists($tokenFile)) {
        error_log("Token file does not exist: $tokenFile");
        return null;
    }
    
    $data = file_get_contents($tokenFile);
    if ($data === false) {
        error_log("Failed to read token file: $tokenFile");
        return null;
    }
    
    $tokens = json_decode($data, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log("Failed to parse token file JSON: " . json_last_error_msg());
        return null;
    }
    
    return $tokens;
}

/**
 * Write tokens to JSON file
 */
function writeTokens($tokens) {
    // Validate required fields
    if (empty($tokens['access_token']) || empty($tokens['refresh_token'])) {
        error_log('❌ Invalid tokens: missing access_token or refresh_token');
        error_log('Received tokens: ' . json_encode($tokens));
        return false;
    }
    
    // Calculate expires_at with validation
    $expiresAt = null;
    if (isset($tokens['expires_at'])) {
        $expiresAt = $tokens['expires_at'];
    } elseif (isset($tokens['expires_in']) && is_numeric($tokens['expires_in'])) {
        // expires_in is in seconds, convert to milliseconds
        $expiresAt = (time() * 1000) + (intval($tokens['expires_in']) * 1000);
    } else {
        // Default to 1 hour if no expiry info
        error_log('⚠️ No valid expires_in provided, defaulting to 1 hour');
        $expiresAt = (time() * 1000) + (3600 * 1000);
    }
    
    global $ZOHO_API_URL;
    
    $tokenData = [
        'access_token' => $tokens['access_token'],
        'refresh_token' => $tokens['refresh_token'],
        'expires_at' => $expiresAt,
        'api_domain' => $tokens['api_domain'] ?? $ZOHO_API_URL ?? 'https://www.zohoapis.com',
        'token_type' => $tokens['token_type'] ?? 'Bearer',
        'created_at' => date('c') // ISO 8601 format
    ];
    
    $tokenFile = __DIR__ . '/zoho-tokens.json';
    
    error_log('📝 Writing tokens to: ' . $tokenFile);
    error_log('📝 Token data: ' . json_encode([
        'has_access_token' => !empty($tokenData['access_token']),
        'has_refresh_token' => !empty($tokenData['refresh_token']),
        'expires_at' => date('c', $expiresAt / 1000),
        'api_domain' => $tokenData['api_domain']
    ]));
    
    $result = file_put_contents($tokenFile, json_encode($tokenData, JSON_PRETTY_PRINT));
    
    if ($result === false) {
        error_log('❌ Failed to write token file');
        return false;
    }
    
    // Verify the file was written
    if (file_exists($tokenFile)) {
        error_log('✅ Token file created successfully');
        return true;
    } else {
        error_log('❌ Token file was not created');
        return false;
    }
}

/**
 * Check if access token is expired
 */
function isTokenExpired($tokens) {
    if (!$tokens || !isset($tokens['expires_at'])) {
        return true;
    }
    // Add 5 minute buffer
    return (time() * 1000) >= ($tokens['expires_at'] - 300000);
}

/**
 * Refresh access token using refresh token
 */
function refreshAccessToken($tokens) {
    global $ZOHO_CLIENT_ID, $ZOHO_CLIENT_SECRET, $ZOHO_ACCOUNTS_URL;
    
    if (!$tokens || !isset($tokens['refresh_token'])) {
        throw new Exception('No refresh token available. Please re-authenticate.');
    }
    
    // Determine accounts URL from saved tokens or use config default
    // If api_domain is saved, derive accounts URL from it
    $accountsUrl = $ZOHO_ACCOUNTS_URL; // Default from config
    
    if (isset($tokens['api_domain'])) {
        // Map API domain to accounts URL
        $apiDomain = $tokens['api_domain'];
        if (strpos($apiDomain, 'zohoapis.in') !== false) {
            $accountsUrl = 'https://accounts.zoho.in';
        } elseif (strpos($apiDomain, 'zohoapis.eu') !== false) {
            $accountsUrl = 'https://accounts.zoho.eu';
        } elseif (strpos($apiDomain, 'zohoapis.com.au') !== false) {
            $accountsUrl = 'https://accounts.zoho.com.au';
        } elseif (strpos($apiDomain, 'zohoapis.com.cn') !== false) {
            $accountsUrl = 'https://accounts.zoho.com.cn';
        } else {
            $accountsUrl = 'https://accounts.zoho.com'; // Default US
        }
        error_log('🌍 Using accounts URL from saved tokens: ' . $accountsUrl);
    }
    
    $url = $accountsUrl . '/oauth/v2/token';
    $data = [
        'refresh_token' => $tokens['refresh_token'],
        'client_id' => $ZOHO_CLIENT_ID,
        'client_secret' => $ZOHO_CLIENT_SECRET,
        'grant_type' => 'refresh_token'
    ];
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/x-www-form-urlencoded']);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);
    
    if ($curlError) {
        error_log('❌ cURL error during token refresh: ' . $curlError);
        throw new Exception('Network error during token refresh: ' . $curlError);
    }
    
    if ($httpCode !== 200) {
        error_log('❌ Token refresh failed - HTTP ' . $httpCode . ': ' . $response);
        $errorData = json_decode($response, true);
        $errorMsg = $errorData['error'] ?? 'Unknown error';
        
        if ($httpCode === 401 || $httpCode === 403) {
            throw new Exception('Token refresh failed (HTTP ' . $httpCode . '): ' . $errorMsg . '. Please re-authenticate by visiting /BFIS/zoho-auth.php');
        }
        
        throw new Exception('Token refresh failed (HTTP ' . $httpCode . '): ' . $errorMsg);
    }
    
    $responseData = json_decode($response, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log('❌ Invalid JSON response during token refresh: ' . json_last_error_msg());
        throw new Exception('Invalid response from Zoho during token refresh');
    }
    
    if (empty($responseData['access_token'])) {
        error_log('❌ No access token in refresh response: ' . $response);
        throw new Exception('Token refresh did not return a valid access token');
    }
    
    // Update tokens
    $updatedTokens = $tokens;
    $updatedTokens['access_token'] = $responseData['access_token'];
    $updatedTokens['expires_at'] = (time() * 1000) + ($responseData['expires_in'] * 1000);
    
    // Save updated tokens using writeTokens
    writeTokens($updatedTokens);
    
    return $updatedTokens;
}

/**
 * Get valid access token (refreshes if needed)
 */
function getValidAccessToken() {
    error_log('🔑 Getting valid access token...');
    
    $tokens = readTokens();
    
    if (!$tokens) {
        error_log('❌ No tokens found in token file');
        throw new Exception('No tokens found. Please authenticate first by visiting /BFIS/zoho-auth.php');
    }
    
    error_log('🔑 Token file loaded successfully');
    
    if (!isset($tokens['access_token'])) {
        error_log('❌ Token file missing access_token field');
        throw new Exception('Invalid token file. Please re-authenticate by visiting /BFIS/zoho-auth.php');
    }
    
    if (isTokenExpired($tokens)) {
        error_log('⏰ Token expired, refreshing...');
        try {
            $tokens = refreshAccessToken($tokens);
            error_log('✅ Token refreshed successfully');
        } catch (Exception $e) {
            error_log('❌ Token refresh failed: ' . $e->getMessage());
            throw $e;
        }
    } else {
        error_log('✅ Token is still valid, no refresh needed');
    }
    
    return $tokens['access_token'];
}
?>

