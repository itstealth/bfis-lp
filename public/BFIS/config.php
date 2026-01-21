<?php
/**
 * Configuration file for Zoho CRM and Email settings
 * 
 * Loads environment variables from .env file or system environment
 * For GoDaddy: Create .env file in this directory with your credentials
 */

// Load .env file first (if exists)
require_once __DIR__ . '/env-loader.php';

/**
 * Helper function to get environment variable with fallback
 */
function getEnvVar($key, $default = '') {
    // Try different methods to get environment variable
    $value = getenv($key);
    if ($value !== false) {
        return $value;
    }
    
    if (isset($_ENV[$key])) {
        return $_ENV[$key];
    }
    
    if (isset($_SERVER[$key])) {
        return $_SERVER[$key];
    }
    
    return $default;
}

// Zoho CRM Configuration
$ZOHO_CLIENT_ID = getEnvVar('ZOHO_CLIENT_ID', '');
$ZOHO_CLIENT_SECRET = getEnvVar('ZOHO_CLIENT_SECRET', '');
$ZOHO_REDIRECT_URI = getEnvVar('ZOHO_REDIRECT_URI', '');
$ZOHO_ACCOUNTS_URL = getEnvVar('ZOHO_ACCOUNTS_URL', 'https://accounts.zoho.com');
$ZOHO_API_URL = getEnvVar('ZOHO_API_URL', 'https://www.zohoapis.com');

// Email Configuration
$SMTP_HOST = getEnvVar('SMTP_HOST', '');
$SMTP_PORT = getEnvVar('SMTP_PORT', '465');
$SMTP_USER = getEnvVar('SMTP_USER', '');
$SMTP_PASSWORD = getEnvVar('SMTP_PASSWORD', '');
$FROM_EMAIL = getEnvVar('FROM_EMAIL', getEnvVar('SMTP_USER', 'info@bfis.in'));
$FROM_NAME = getEnvVar('FROM_NAME', 'Brookfield International School');
$REPLY_TO = getEnvVar('REPLY_TO', $FROM_EMAIL);

// Validate required Zoho configuration
if (empty($ZOHO_CLIENT_ID) || empty($ZOHO_CLIENT_SECRET)) {
    error_log('Warning: Zoho credentials not configured. Set ZOHO_CLIENT_ID and ZOHO_CLIENT_SECRET in .env file.');
}

// Validate required email configuration (optional - will use PHP mail() if not set)
if (empty($SMTP_HOST) || empty($SMTP_USER) || empty($SMTP_PASSWORD)) {
    error_log('Warning: SMTP configuration not set. Will use PHP mail() function as fallback.');
}
?>

