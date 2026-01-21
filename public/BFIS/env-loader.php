<?php
/**
 * Environment Variables Loader for PHP
 * Reads .env file and sets environment variables
 * 
 * For GoDaddy hosting, place .env file in the same directory as this file
 * Make sure .env file is not publicly accessible (outside web root or protected)
 */

function loadEnvFile($filePath) {
    if (!file_exists($filePath)) {
        return false;
    }
    
    $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    
    foreach ($lines as $line) {
        // Skip comments
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        
        // Parse KEY=VALUE format
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);
            
            // Remove quotes if present
            if ((substr($value, 0, 1) === '"' && substr($value, -1) === '"') ||
                (substr($value, 0, 1) === "'" && substr($value, -1) === "'")) {
                $value = substr($value, 1, -1);
            }
            
            // Set environment variable if not already set
            if (!getenv($key)) {
                putenv("$key=$value");
                $_ENV[$key] = $value;
                $_SERVER[$key] = $value;
            }
        }
    }
    
    return true;
}

// Try to load .env file from multiple locations
$envPaths = [
    __DIR__ . '/.env',           // Same directory as PHP files
    __DIR__ . '/../.env',         // Parent directory
    __DIR__ . '/../../.env',      // Root directory
    dirname(__DIR__, 2) . '/.env' // Absolute path to root
];

$envLoaded = false;
foreach ($envPaths as $envPath) {
    if (loadEnvFile($envPath)) {
        error_log("✅ Loaded .env file from: $envPath");
        $envLoaded = true;
        break;
    }
}

if (!$envLoaded) {
    error_log("⚠️ No .env file found. Using system environment variables or defaults.");
}
?>

