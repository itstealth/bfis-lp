<?php
/**
 * Zoho OAuth - Step 2: Handle Callback and Exchange Code for Tokens
 * This endpoint is called by Zoho after user authorizes
 */

// Load configuration and token manager
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/zoho-token-manager.php';

try {
    // Get authorization code and error from query parameters
    $code = $_GET['code'] ?? null;
    $error = $_GET['error'] ?? null;
    $accountsServer = $_GET['accounts-server'] ?? null;
    $location = $_GET['location'] ?? null;
    
    // Handle authorization errors
    if ($error) {
        http_response_code(400);
        header('Content-Type: application/json');
        echo json_encode(['error' => "Authorization failed: $error"]);
        exit();
    }
    
    if (!$code) {
        http_response_code(400);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'No authorization code received']);
        exit();
    }
    
    // Detect Zoho data center from callback URL
    // Zoho returns accounts-server parameter (e.g., https://accounts.zoho.in)
    $accountsUrl = $ZOHO_ACCOUNTS_URL; // Default from config
    
    if ($accountsServer) {
        // Use the accounts server from callback (URL decoded)
        $accountsUrl = urldecode($accountsServer);
        error_log('🌍 Detected Zoho data center from callback: ' . $accountsUrl);
    } elseif ($location) {
        // Fallback: Use location parameter to determine data center
        // location=in -> accounts.zoho.in, location=eu -> accounts.zoho.eu, etc.
        $locationMap = [
            'in' => 'https://accounts.zoho.in',
            'eu' => 'https://accounts.zoho.eu',
            'com' => 'https://accounts.zoho.com',
            'com.au' => 'https://accounts.zoho.com.au',
            'com.cn' => 'https://accounts.zoho.com.cn'
        ];
        
        if (isset($locationMap[$location])) {
            $accountsUrl = $locationMap[$location];
            error_log('🌍 Detected Zoho data center from location: ' . $location . ' -> ' . $accountsUrl);
        }
    }
    
    // Map accounts URL to API URL based on data center
    $apiUrl = $ZOHO_API_URL; // Default from config
    if (strpos($accountsUrl, 'zoho.in') !== false) {
        $apiUrl = 'https://www.zohoapis.in';
    } elseif (strpos($accountsUrl, 'zoho.eu') !== false) {
        $apiUrl = 'https://www.zohoapis.eu';
    } elseif (strpos($accountsUrl, 'zoho.com.au') !== false) {
        $apiUrl = 'https://www.zohoapis.com.au';
    } elseif (strpos($accountsUrl, 'zoho.com.cn') !== false) {
        $apiUrl = 'https://www.zohoapis.com.cn';
    } else {
        $apiUrl = 'https://www.zohoapis.com'; // Default US
    }
    
    error_log('🌍 Using Accounts URL: ' . $accountsUrl);
    error_log('🌍 Using API URL: ' . $apiUrl);
    
    // Exchange authorization code for access and refresh tokens
    $tokenParams = [
        'code' => $code,
        'client_id' => $ZOHO_CLIENT_ID,
        'client_secret' => $ZOHO_CLIENT_SECRET,
        'redirect_uri' => $ZOHO_REDIRECT_URI,
        'grant_type' => 'authorization_code'
    ];
    
    error_log('🔄 Exchanging code for tokens...');
    error_log('📤 Token request params: ' . json_encode([
        'code' => substr($code, 0, 20) . '...',
        'client_id' => substr($ZOHO_CLIENT_ID, 0, 20) . '...',
        'redirect_uri' => $ZOHO_REDIRECT_URI,
        'grant_type' => 'authorization_code',
        'accounts_url' => $accountsUrl
    ]));
    
    $url = $accountsUrl . '/oauth/v2/token';
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($tokenParams));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/x-www-form-urlencoded']);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    error_log('📥 Token response status: ' . $httpCode);
    
    $tokens = json_decode($response, true);
    
    // Log full response for debugging
    error_log('📥 Full Zoho response: ' . json_encode($tokens, JSON_PRETTY_PRINT));
    
    if ($httpCode !== 200) {
        error_log('❌ Token exchange failed with status: ' . $httpCode);
        error_log('❌ Error details: ' . json_encode($tokens));
        
        http_response_code(400);
        header('Content-Type: application/json');
        echo json_encode([
            'error' => 'Failed to exchange code for tokens',
            'details' => $tokens,
            'status' => $httpCode
        ]);
        exit();
    }
    
    // Validate token response
    if (empty($tokens['access_token']) || empty($tokens['refresh_token'])) {
        error_log('❌ Invalid token response - missing tokens');
        error_log('Response received: ' . json_encode($tokens));
        
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode([
            'error' => 'Invalid token response from Zoho',
            'details' => 'access_token or refresh_token missing',
            'response' => $tokens
        ]);
        exit();
    }
    
    error_log('✅ Tokens received from Zoho: ' . json_encode([
        'has_access_token' => !empty($tokens['access_token']),
        'has_refresh_token' => !empty($tokens['refresh_token']),
        'expires_in' => $tokens['expires_in'] ?? 'not set',
        'token_type' => $tokens['token_type'] ?? 'not set'
    ]));
    
    // Use the detected API URL (or from token response)
    $finalApiUrl = $tokens['api_domain'] ?? $apiUrl ?? $ZOHO_API_URL;
    
    error_log('💾 Saving tokens with API domain: ' . $finalApiUrl);
    
    // Save tokens to file system
    $saved = writeTokens([
        'access_token' => $tokens['access_token'],
        'refresh_token' => $tokens['refresh_token'],
        'expires_in' => $tokens['expires_in'] ?? 3600,
        'api_domain' => $finalApiUrl,
        'token_type' => $tokens['token_type'] ?? 'Bearer'
    ]);
    
    if (!$saved) {
        error_log('❌ Failed to save tokens to file system');
        
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Failed to save tokens']);
        exit();
    }
    
    error_log('✅ Tokens saved successfully to zoho-tokens.json');
    
    // Verify tokens were saved by reading them back
    $savedTokens = readTokens();
    $verificationMessage = $savedTokens 
        ? '✅ Tokens verified and ready to use!' 
        : '⚠️ Warning: Tokens may not have been saved correctly';
    
    error_log($verificationMessage);
    
    // Success! Return a friendly HTML page
    $successHtml = '
<!DOCTYPE html>
<html>
  <head>
    <title>Zoho CRM Connected</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
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
        <small style="color: #10b981;">' . htmlspecialchars($verificationMessage) . '</small>
      </div>
      <button class="close-btn" onclick="window.close()">Close Window</button>
    </div>
  </body>
</html>';
    
    header('Content-Type: text/html');
    echo $successHtml;
    
} catch (Exception $e) {
    error_log('Callback error: ' . $e->getMessage());
    
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'error' => 'Failed to complete OAuth flow',
        'details' => $e->getMessage()
    ]);
}
?>

