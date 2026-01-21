<?php
/**
 * Zoho OAuth - Step 1: Initiate Authentication
 * Visit this endpoint to start the OAuth flow
 * 
 * Usage: Visit /BFIS/zoho-auth.php in your browser
 */

// Load configuration
require_once __DIR__ . '/config.php';

// Set error logging
error_log('🔐 Starting Zoho OAuth flow...');

// Check for required environment variables
if (empty($ZOHO_CLIENT_ID) || empty($ZOHO_REDIRECT_URI) || empty($ZOHO_ACCOUNTS_URL)) {
    error_log('❌ Missing required environment variables');
    
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'error' => 'Missing Zoho configuration. Please check your environment variables.',
        'missing' => [
            'clientId' => empty($ZOHO_CLIENT_ID),
            'redirectUri' => empty($ZOHO_REDIRECT_URI),
            'accountsUrl' => empty($ZOHO_ACCOUNTS_URL)
        ]
    ]);
    exit();
}

// Log configuration (mask sensitive data)
error_log('📋 Configuration: ' . json_encode([
    'clientId' => substr($ZOHO_CLIENT_ID, 0, 20) . '...',
    'redirectUri' => $ZOHO_REDIRECT_URI,
    'accountsUrl' => $ZOHO_ACCOUNTS_URL,
    'hasClientId' => !empty($ZOHO_CLIENT_ID),
    'hasRedirectUri' => !empty($ZOHO_REDIRECT_URI),
    'hasAccountsUrl' => !empty($ZOHO_ACCOUNTS_URL)
]));

// Build OAuth URL with required scopes
$scope = 'ZohoCRM.modules.ALL,ZohoCRM.settings.ALL';
$accessType = 'offline'; // To get refresh token

$params = [
    'response_type' => 'code',
    'client_id' => $ZOHO_CLIENT_ID,
    'scope' => $scope,
    'redirect_uri' => $ZOHO_REDIRECT_URI,
    'access_type' => $accessType,
    'prompt' => 'consent'
];

$authUrl = $ZOHO_ACCOUNTS_URL . '/oauth/v2/auth?' . http_build_query($params);

error_log('🌐 Redirecting to Zoho authorization URL');
error_log('🔗 Auth URL: ' . str_replace($ZOHO_CLIENT_ID, substr($ZOHO_CLIENT_ID, 0, 20) . '...', $authUrl));

// Redirect user to Zoho's authorization page
header('Location: ' . $authUrl);
exit();
?>

