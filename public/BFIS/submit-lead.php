<?php
/**
 * Submit Lead to Zoho CRM - PHP Endpoint
 * Replaces Next.js API route for OVH VPS compatibility
 * 
 * Accepts JSON POST requests and submits leads to Zoho CRM
 */

// Set headers for JSON response and CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Load configuration and token manager
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/zoho-token-manager.php';

// Validate Zoho configuration
if (empty($ZOHO_API_URL)) {
    error_log('❌ ZOHO_API_URL is not configured');
    http_response_code(500);
    echo json_encode([
        'error' => 'Server configuration error',
        'message' => 'ZOHO_API_URL is not configured in .env file'
    ]);
    exit();
}

error_log('📋 Zoho API URL: ' . $ZOHO_API_URL);

/**
 * Validation functions
 */
function validateName($name) {
    if (empty($name) || !trim($name)) {
        return 'Name is required';
    }
    if (!preg_match('/^[A-Za-z\s]+$/', $name)) {
        return 'Only letters and spaces allowed';
    }
    if (strlen(trim($name)) < 2) {
        return 'Name too short (min 2 letters)';
    }
    return null;
}

function validateEmail($email) {
    if (empty($email) || !trim($email)) {
        return 'Email is required';
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return 'Invalid email format';
    }
    return null;
}

function validatePhone($phone) {
    if (empty($phone) || !trim($phone)) {
        return 'Phone number is required';
    }
    if (!preg_match('/^[6-9]\d{9}$/', $phone)) {
        return 'Enter valid 10-digit mobile number';
    }
    return null;
}

// Token management functions are now in zoho-token-manager.php

/**
 * Check if phone number already exists in Zoho CRM
 */
function checkDuplicatePhone($phone, $accessToken) {
    global $ZOHO_API_URL;
    
    try {
        error_log("Checking for duplicate phone number: $phone");
        
        $searchUrl = $ZOHO_API_URL . '/crm/v2/Leads/search?criteria=(Phone:equals:' . urlencode($phone) . ')';
        
        $ch = curl_init($searchUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Zoho-oauthtoken ' . $accessToken,
            'Content-Type: application/json'
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode === 200) {
            $data = json_decode($response, true);
            if (isset($data['data']) && count($data['data']) > 0) {
                error_log('Duplicate phone number found in Zoho CRM');
                return true;
            }
        }
        
        error_log('No duplicate phone number found');
        return false;
    } catch (Exception $e) {
        error_log('Error checking duplicate phone: ' . $e->getMessage());
        // If check fails, allow submission to proceed (fail open)
        return false;
    }
}

/**
 * Verify that a lead exists in Zoho CRM by fetching it
 */
function verifyLeadExists($leadId, $accessToken) {
    global $ZOHO_API_URL;
    
    try {
        error_log("Verifying lead exists in Zoho CRM - ID: $leadId");
        
        $url = $ZOHO_API_URL . '/crm/v2/Leads/' . $leadId;
        
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Zoho-oauthtoken ' . $accessToken,
            'Content-Type: application/json'
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode === 200) {
            $data = json_decode($response, true);
            if (isset($data['data']) && count($data['data']) > 0) {
                error_log('Lead verified successfully in Zoho CRM');
                return true;
            }
        }
        
        error_log("Lead verification failed - HTTP Code: $httpCode, Response: " . substr($response, 0, 200));
        return false;
    } catch (Exception $e) {
        error_log('Error verifying lead: ' . $e->getMessage());
        return false;
    }
}

/**
 * Send thank you email
 */
function sendThankYouEmail($toEmail, $parentName, $studentName = '') {
    global $FROM_EMAIL, $FROM_NAME, $SMTP_HOST, $SMTP_PORT, $SMTP_USER, $SMTP_PASSWORD;
    
    try {
        // Use PHPMailer if available, otherwise fall back to mail()
        if (class_exists('PHPMailer\PHPMailer\PHPMailer')) {
            $mail = new PHPMailer\PHPMailer\PHPMailer(true);
            
            // SMTP configuration
            $mail->isSMTP();
            $mail->Host = $SMTP_HOST;
            $mail->SMTPAuth = true;
            $mail->Username = $SMTP_USER;
            $mail->Password = $SMTP_PASSWORD;
            $mail->SMTPSecure = ($SMTP_PORT == 465) ? PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS : PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = $SMTP_PORT;
            
            // Email content
            $mail->setFrom($FROM_EMAIL, $FROM_NAME);
            $mail->addAddress($toEmail, $parentName);
            $mail->Subject = 'Thank You for Your Interest in Brookfield International School';
            $mail->isHTML(true);
            $mail->Body = getThankYouEmailHTML($parentName, $studentName);
            $mail->AltBody = getThankYouEmailText($parentName, $studentName);
            
            $mail->send();
            error_log("Thank you email sent successfully to: $toEmail");
            return true;
        } else {
            // Fallback to PHP mail() function
            $subject = 'Thank You for Your Interest in Brookfield International School';
            $message = getThankYouEmailText($parentName, $studentName);
            $headers = "From: $FROM_NAME <$FROM_EMAIL>\r\n";
            $headers .= "Reply-To: $FROM_EMAIL\r\n";
            $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
            
            if (mail($toEmail, $subject, $message, $headers)) {
                error_log("Thank you email sent successfully to: $toEmail");
                return true;
            } else {
                error_log("Failed to send email to: $toEmail");
                return false;
            }
        }
    } catch (Exception $e) {
        error_log("Error sending email: " . $e->getMessage());
        return false;
    }
}

/**
 * Get thank you email HTML content
 */
function getThankYouEmailHTML($parentName, $studentName) {
    $studentNameText = $studentName ? "<strong>$studentName</strong>" : 'your child';
    
    return '
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; max-width: 100%;">
                    <tr>
                        <td style="padding: 40px 30px; color: #333333; line-height: 1.7;">
                            <p>Dear <strong>' . htmlspecialchars($parentName) . '</strong>,</p>
                            <p>Thank you for submitting your inquiry and showing interest in <strong>Brookfield International School, New Chandigarh</strong>. We appreciate the time you have taken to learn more about our institution.</p>
                            <p>Our Admissions Team will reach out to you shortly to guide you through the admission process.</p>
                            <p><strong>Contact Us:</strong><br>
                            Phone: +91-9066790662<br>
                            Email: info@bfis.in<br>
                            Website: https://www.bfis.in/</p>
                            <p>Warm regards,<br>
                            <strong>Admissions Office</strong><br>
                            Brookfield International School, New Chandigarh</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>';
}

/**
 * Get thank you email text content
 */
function getThankYouEmailText($parentName, $studentName) {
    $studentNameText = $studentName ? $studentName : 'your child';
    
    return "Dear $parentName,

Thank you for submitting your inquiry and showing interest in Brookfield International School, New Chandigarh. We appreciate the time you have taken to learn more about our institution.

Our Admissions Team will reach out to you shortly to guide you through the admission process.

Contact Us:
Phone: +91-9066790662
Email: info@bfis.in
Website: https://www.bfis.in/

Warm regards,
Admissions Office
Brookfield International School, New Chandigarh";
}

// Main execution
try {
    // Get JSON input
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode([
            'error' => 'Invalid request format',
            'message' => 'Request body must be valid JSON'
        ]);
        exit();
    }
    
    // Extract form fields - support both formats (landing page + main website)
    // Landing page uses: parentName, email, phone, classApplyingFor
    // Main website uses: contact-parent-name, contact-email, contact-phone, contact-class
    $parentName = $data['parentName'] ?? $data['contact-parent-name'] ?? '';
    $studentName = $data['studentName'] ?? $data['contact-student-name'] ?? '';
    $email = $data['email'] ?? $data['contact-email'] ?? '';
    $phone = $data['phone'] ?? $data['contact-phone'] ?? '';
    $classApplyingFor = $data['classApplyingFor'] ?? $data['contact-class'] ?? '';
    $enquiry = $data['enquiry'] ?? $data['contact-enquiry'] ?? ''; // Optional for landing page
    
    // Extract UTM parameters
    $utm_source = $data['utm_source'] ?? '';
    $utm_medium = $data['utm_medium'] ?? '';
    $utm_campaign = $data['utm_campaign'] ?? '';
    $utm_term = $data['utm_term'] ?? '';
    $utm_content = $data['utm_content'] ?? '';
    
    // Validate required fields
    if (empty($parentName) || empty($email) || empty($phone) || empty($classApplyingFor)) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        exit();
    }
    
    // Server-side validation
    $validationErrors = [];
    
    $parentNameError = validateName($parentName);
    if ($parentNameError) {
        $validationErrors['parentName'] = $parentNameError;
    }
    
    if (!empty($studentName)) {
        $studentNameError = validateName($studentName);
        if ($studentNameError) {
            $validationErrors['studentName'] = $studentNameError;
        }
    }
    
    $emailError = validateEmail($email);
    if ($emailError) {
        $validationErrors['email'] = $emailError;
    }
    
    $phoneError = validatePhone($phone);
    if ($phoneError) {
        $validationErrors['phone'] = $phoneError;
    }
    
    if (!empty($validationErrors)) {
        http_response_code(400);
        echo json_encode([
            'error' => 'Please check your information',
            'validationErrors' => $validationErrors
        ]);
        exit();
    }
    
    // Get valid access token
    try {
        $accessToken = getValidAccessToken();
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode([
            'error' => 'Authentication required',
            'message' => 'Please authenticate with Zoho CRM first by visiting /BFIS/zoho-auth.php',
            'details' => $e->getMessage()
        ]);
        exit();
    }
    
    // Check for duplicate phone number
    $isDuplicate = checkDuplicatePhone($phone, $accessToken);
    if ($isDuplicate) {
        http_response_code(409);
        echo json_encode([
            'error' => 'This number is already registered',
            'field' => 'phone'
        ]);
        exit();
    }
    
    // Build description
    $description = "Student Name: " . ($studentName ?: 'Not provided') . "\n";
    $description .= "Class Applying For: " . ($classApplyingFor ?: 'Not specified') . "\n";
    
    if (!empty($enquiry)) {
        $description .= "\n--- Enquiry Message ---\n$enquiry";
    }
    
    if (!empty($utm_source) || !empty($utm_medium) || !empty($utm_campaign)) {
        $description .= "\n\n--- Campaign Tracking ---";
        if (!empty($utm_source)) $description .= "\nSource: $utm_source";
        if (!empty($utm_medium)) $description .= "\nMedium: $utm_medium";
        if (!empty($utm_campaign)) $description .= "\nCampaign: $utm_campaign";
        if (!empty($utm_term)) $description .= "\nTerm: $utm_term";
        if (!empty($utm_content)) $description .= "\nContent: $utm_content";
    }
    
    // Prepare lead data for Zoho CRM
    $leadData = [
        'data' => [
            [
                'Last_Name' => $parentName,
                'Company' => 'BFIS Admission',
                'Email' => $email,
                'Phone' => $phone,
                'Lead_Source' => $utm_source ?: 'Website - Admission Form',
                'Description' => $description
            ]
        ],
        'trigger' => ['approval', 'workflow', 'blueprint']
    ];
    
    // Submit to Zoho CRM
    global $ZOHO_API_URL;
    $url = $ZOHO_API_URL . '/crm/v2/Leads';
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($leadData));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Zoho-oauthtoken ' . $accessToken,
        'Content-Type: application/json'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);
    
    // Log request details for debugging
    error_log('Zoho API Request - URL: ' . $url);
    error_log('Zoho API Request - Payload: ' . json_encode($leadData));
    
    // Check for cURL errors
    if ($curlError) {
        error_log('Zoho API cURL Error: ' . $curlError);
        http_response_code(500);
        echo json_encode([
            'error' => 'Failed to connect to Zoho CRM',
            'message' => $curlError
        ]);
        exit();
    }
    
    $responseData = json_decode($response, true);
    
    // Log response for debugging
    error_log('Zoho API Response - HTTP Code: ' . $httpCode);
    error_log('Zoho API Response - Body: ' . $response);
    
    // Check for JSON decode errors
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log('Zoho API Response - JSON Decode Error: ' . json_last_error_msg());
        http_response_code(500);
        echo json_encode([
            'error' => 'Invalid response from Zoho CRM',
            'message' => 'Failed to parse response: ' . json_last_error_msg(),
            'rawResponse' => substr($response, 0, 500)
        ]);
        exit();
    }
    
    // Check for Zoho API errors in response
    if (isset($responseData['data']) && is_array($responseData['data']) && count($responseData['data']) > 0) {
        $firstRecord = $responseData['data'][0];
        
        // Check for error status
        if (isset($firstRecord['status']) && strtolower($firstRecord['status']) === 'error') {
            error_log('Zoho API Error: ' . ($firstRecord['message'] ?? 'Unknown error'));
            http_response_code(400);
            echo json_encode([
                'error' => 'Zoho CRM error',
                'message' => $firstRecord['message'] ?? 'Failed to create lead',
                'details' => $firstRecord['details'] ?? null,
                'code' => $firstRecord['code'] ?? null
            ]);
            exit();
        }
        
        // Check for error code
        if (isset($firstRecord['code']) && strtoupper($firstRecord['code']) !== 'SUCCESS') {
            error_log('Zoho API Error Code: ' . $firstRecord['code']);
            http_response_code(400);
            echo json_encode([
                'error' => 'Zoho CRM error',
                'message' => $firstRecord['message'] ?? 'Failed to create lead',
                'code' => $firstRecord['code'],
                'details' => $firstRecord
            ]);
            exit();
        }
    }
    
    // Check if request was successful
    // Zoho returns success when:
    // 1. HTTP 200 or 201
    // 2. data[0].status === 'success' OR data[0].code === 'SUCCESS'
    // 3. data[0].details.id exists (confirms lead was actually created)
    $isSuccess = false;
    $leadId = null;
    
    if ($httpCode === 200 || $httpCode === 201) {
        if (isset($responseData['data']) && is_array($responseData['data']) && count($responseData['data']) > 0) {
            $firstRecord = $responseData['data'][0];
            
            // Check for success status
            $hasSuccessStatus = isset($firstRecord['status']) && strtolower($firstRecord['status']) === 'success';
            
            // Check for success code
            $hasSuccessCode = isset($firstRecord['code']) && strtoupper($firstRecord['code']) === 'SUCCESS';
            
            // Extract lead ID (this confirms the lead was actually created)
            if (isset($firstRecord['details']['id'])) {
                $leadId = $firstRecord['details']['id'];
            }
            
            // Success requires: (status OR code) AND lead ID
            if (($hasSuccessStatus || $hasSuccessCode) && $leadId) {
                $isSuccess = true;
                error_log('Lead created successfully in Zoho CRM - ID: ' . $leadId);
            } else {
                error_log('Zoho response indicates success but no lead ID found. Status: ' . ($firstRecord['status'] ?? 'N/A') . ', Code: ' . ($firstRecord['code'] ?? 'N/A'));
            }
        } else {
            error_log('Zoho API response missing data array');
        }
    } else {
        error_log('Zoho API returned non-success HTTP code: ' . $httpCode);
    }
    
    if (!$isSuccess) {
        http_response_code($httpCode !== 200 && $httpCode !== 201 ? $httpCode : 400);
        echo json_encode([
            'error' => 'Failed to create lead in Zoho CRM',
            'message' => 'Lead was not created. Please check Zoho CRM configuration.',
            'details' => $responseData,
            'debug' => [
                'httpCode' => $httpCode,
                'hasData' => isset($responseData['data']),
                'firstRecord' => $responseData['data'][0] ?? null,
                'leadId' => $leadId
            ]
        ]);
        exit();
    }
    
    // MANDATORY: Verify lead actually exists in Zoho
    $leadVerified = false;
    if ($leadId) {
        try {
            error_log('🔍 Verifying lead creation in Zoho CRM...');
            $leadVerified = verifyLeadExists($leadId, $accessToken);
            
            if (!$leadVerified) {
                error_log('❌ CRITICAL: Lead ID returned but lead does not exist in Zoho CRM!');
                error_log('❌ Lead ID: ' . $leadId);
                error_log('❌ This indicates a Zoho API issue or data center mismatch');
                
                // FAIL the request - lead was not actually created
                http_response_code(500);
                echo json_encode([
                    'error' => 'Lead creation failed',
                    'message' => 'Lead ID was returned but lead does not exist in Zoho CRM. This may be a data center configuration issue.',
                    'leadId' => $leadId,
                    'verified' => false,
                    'troubleshooting' => [
                        'Check your .env file has the correct ZOHO_API_URL',
                        'Verify your Zoho account data center (India: .in, US: .com)',
                        'Check server error logs for detailed information'
                    ]
                ]);
                exit();
            }
            
            error_log('✅ Lead verified successfully in Zoho CRM - ID: ' . $leadId);
        } catch (Exception $e) {
            error_log('❌ Error during lead verification: ' . $e->getMessage());
            
            // FAIL the request - we can't confirm lead was created
            http_response_code(500);
            echo json_encode([
                'error' => 'Lead verification failed',
                'message' => 'Unable to verify lead creation: ' . $e->getMessage(),
                'leadId' => $leadId,
                'verified' => false
            ]);
            exit();
        }
    } else {
        // No lead ID returned - this should have been caught earlier but double-check
        error_log('❌ No lead ID returned from Zoho API');
        http_response_code(500);
        echo json_encode([
            'error' => 'Lead creation failed',
            'message' => 'No lead ID returned from Zoho CRM'
        ]);
        exit();
    }
    
    // Send thank you email (non-blocking - don't fail if email fails)
    try {
        sendThankYouEmail($email, $parentName, $studentName);
    } catch (Exception $e) {
        error_log('Failed to send thank you email: ' . $e->getMessage());
        // Continue with success response even if email fails
    }
    
    // Success response - only reached if lead is verified
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Lead created and verified successfully',
        'leadId' => $leadId,
        'verified' => true
    ]);
    
} catch (Exception $e) {
    error_log('Submit lead error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'error' => 'Internal server error',
        'message' => $e->getMessage()
    ]);
}
?>

