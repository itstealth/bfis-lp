<?php
/**
 * Test Email Configuration Endpoint
 * Visit: /BFIS/test-email.php
 * 
 * This endpoint verifies your SMTP connection without sending an actual email
 */

// Set headers for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Load configuration
require_once __DIR__ . '/config.php';

try {
    error_log('🧪 Testing SMTP configuration...');
    
    $smtpConfig = [
        'host' => $SMTP_HOST ?: 'NOT SET',
        'port' => $SMTP_PORT ?: 'NOT SET',
        'user' => $SMTP_USER ?: 'NOT SET',
        'passwordSet' => !empty($SMTP_PASSWORD),
        'fromEmail' => $FROM_EMAIL ?: 'NOT SET',
        'fromName' => $FROM_NAME ?: 'NOT SET',
    ];
    
    error_log('📋 SMTP Settings: ' . json_encode($smtpConfig));
    
    // Check if PHPMailer is available
    $phpmailerAvailable = class_exists('PHPMailer\PHPMailer\PHPMailer');
    
    if ($phpmailerAvailable) {
        // Test SMTP connection using PHPMailer
        $mail = new PHPMailer\PHPMailer\PHPMailer(true);
        
        try {
            // SMTP configuration
            $mail->isSMTP();
            $mail->Host = $SMTP_HOST;
            $mail->SMTPAuth = true;
            $mail->Username = $SMTP_USER;
            $mail->Password = $SMTP_PASSWORD;
            $mail->SMTPSecure = ($SMTP_PORT == 465) 
                ? PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS 
                : PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = $SMTP_PORT;
            $mail->SMTPDebug = 0; // Set to 2 for verbose debugging
            $mail->Timeout = 10;
            
            // Test connection
            $mail->smtpConnect();
            $mail->smtpClose();
            
            // Success
            echo json_encode([
                'success' => true,
                'message' => '✅ SMTP connection verified successfully!',
                'details' => [
                    'host' => $SMTP_HOST,
                    'port' => $SMTP_PORT,
                    'user' => $SMTP_USER,
                    'fromEmail' => $FROM_EMAIL,
                    'fromName' => $FROM_NAME,
                    'method' => 'PHPMailer'
                ],
                'note' => 'Your email configuration is working correctly. Test by submitting the admission form.'
            ]);
            
        } catch (Exception $e) {
            $errorMessage = $e->getMessage();
            error_log('❌ SMTP connection failed: ' . $errorMessage);
            
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => '❌ SMTP connection failed',
                'error' => $errorMessage,
                'hint' => 'Check your SMTP credentials in config.php or environment variables',
                'help' => [
                    'commonIssues' => [
                        'EAUTH: Wrong email/password (use App Password for Gmail)',
                        'ECONNECTION: Wrong host/port',
                        'ETIMEDOUT: Firewall or network issue',
                    ],
                    'checkList' => [
                        'Verify all SMTP_* variables are set in config.php',
                        'For Gmail: Enable 2FA and use App Password',
                        'Check SMTP_PORT (587 for TLS, 465 for SSL)',
                        'Verify SMTP_SECURE matches your port',
                    ]
                ]
            ]);
        }
        
    } else {
        // PHPMailer not available - provide configuration status only
        $hasConfig = !empty($SMTP_HOST) && !empty($SMTP_USER) && !empty($SMTP_PASSWORD);
        
        if ($hasConfig) {
            echo json_encode([
                'success' => true,
                'message' => '⚠️ SMTP configuration found, but PHPMailer is not installed',
                'details' => [
                    'host' => $SMTP_HOST,
                    'port' => $SMTP_PORT,
                    'user' => $SMTP_USER,
                    'fromEmail' => $FROM_EMAIL,
                    'fromName' => $FROM_NAME,
                    'method' => 'PHP mail() (fallback)'
                ],
                'note' => 'Install PHPMailer for better email delivery: composer require phpmailer/phpmailer',
                'warning' => 'PHP mail() function will be used as fallback, which may have delivery issues'
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => '❌ SMTP configuration incomplete',
                'error' => 'Missing SMTP configuration. Set SMTP_HOST, SMTP_USER, and SMTP_PASSWORD in config.php',
                'details' => $smtpConfig,
                'help' => [
                    'installPhpMailer' => 'Run: composer require phpmailer/phpmailer',
                    'configure' => 'Set SMTP_* variables in config.php or environment variables'
                ]
            ]);
        }
    }
    
} catch (Exception $e) {
    error_log('❌ Test email error: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'SMTP configuration test failed',
        'error' => $e->getMessage(),
        'help' => [
            'commonIssues' => [
                'EAUTH: Wrong email/password (use App Password for Gmail)',
                'ECONNECTION: Wrong host/port',
                'ETIMEDOUT: Firewall or network issue',
            ],
            'checkList' => [
                'Verify all SMTP_* variables are set in config.php',
                'For Gmail: Enable 2FA and use App Password',
                'Check SMTP_PORT (587 for TLS, 465 for SSL)',
                'Verify SMTP_SECURE matches your port',
            ]
        ]
    ]);
}
?>

