import { NextResponse } from 'next/server';
import { getValidAccessToken } from '@/lib/zoho-token-manager';
import { sendThankYouEmail } from '@/lib/email-sender';

/**
 * Validation helper functions
 */
const validateName = (name) => {
  const nameRegex = /^[A-Za-z\s]+$/;
  if (!name || !name.trim()) return 'Name is required';
  if (!nameRegex.test(name)) return 'Only letters and spaces allowed';
  if (name.trim().length < 2) return 'Name too short (min 2 letters)';
  return null;
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !email.trim()) return 'Email is required';
  if (!emailRegex.test(email)) return 'Invalid email format';
  return null;
};

const validatePhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phone || !phone.trim()) return 'Phone number is required';
  if (!phoneRegex.test(phone)) return 'Enter valid 10-digit mobile number';
  return null;
};

/**
 * Check if phone number already exists in Zoho CRM
 */
const checkDuplicatePhone = async (phone, accessToken) => {
  try {
    console.log('🔍 Checking for duplicate phone number:', phone);
    
    const searchUrl = `${process.env.ZOHO_API_URL}/crm/v2/Leads/search?criteria=(Phone:equals:${phone})`;
    
    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (response.ok && data.data && data.data.length > 0) {
      console.log('⚠️ Duplicate phone number found in Zoho CRM');
      return true;
    }
    
    console.log('✅ No duplicate phone number found');
    return false;
  } catch (error) {
    console.error('Error checking duplicate phone:', error);
    // If check fails, allow submission to proceed (fail open)
    return false;
  }
};

/**
 * Submit Lead to Zoho CRM and Send Thank You Email
 * This endpoint receives form data, creates a lead in Zoho CRM, and sends a thank you email
 */
export async function POST(request) {
  try {
    // Parse form data
    const body = await request.json();
    const { 
      parentName, 
      studentName, 
      email, 
      phone, 
      classApplyingFor,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content
    } = body;

    // Validate required fields
    if (!parentName || !email || !phone || !classApplyingFor) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Server-side validation
    const validationErrors = {};
    
    const parentNameError = validateName(parentName);
    if (parentNameError) validationErrors.parentName = parentNameError;
    
    if (studentName) {
      const studentNameError = validateName(studentName);
      if (studentNameError) validationErrors.studentName = studentNameError;
    }
    
    const emailError = validateEmail(email);
    if (emailError) validationErrors.email = emailError;
    
    const phoneError = validatePhone(phone);
    if (phoneError) validationErrors.phone = phoneError;

    if (Object.keys(validationErrors).length > 0) {
      return NextResponse.json(
        { 
          error: 'Please check your information',
          validationErrors 
        },
        { status: 400 }
      );
    }

    // Log UTM parameters if present
    if (utm_source || utm_medium || utm_campaign) {
      console.log('📊 UTM Parameters received:', {
        utm_source,
        utm_medium,
        utm_campaign,
        utm_term,
        utm_content
      });
    }

    // Get valid access token (will auto-refresh if expired)
    let accessToken;
    try {
      console.log('🔑 Getting valid access token...');
      accessToken = await getValidAccessToken();
      console.log('✅ Access token obtained successfully');
    } catch (tokenError) {
      console.error('❌ Token error:', tokenError);
      console.error('Token error message:', tokenError.message);
      return NextResponse.json(
        { 
          error: 'Authentication required',
          message: 'Please authenticate with Zoho CRM first by visiting /api/zoho-auth',
          details: tokenError.message,
          hint: 'Visit http://localhost:3000/api/zoho-debug to check integration status'
        },
        { status: 401 }
      );
    }

    // Check for duplicate phone number in Zoho CRM
    const isDuplicate = await checkDuplicatePhone(phone, accessToken);
    if (isDuplicate) {
      return NextResponse.json(
        { 
          error: 'This number is already registered',
          field: 'phone'
        },
        { status: 409 } // 409 Conflict
      );
    }

    // Build description with all relevant information
    let description = `Student Name: ${studentName || 'Not provided'}\nClass Applying For: ${classApplyingFor || 'Not specified'}`;
    
    // Add UTM parameters to description if available
    if (utm_source || utm_medium || utm_campaign || utm_term || utm_content) {
      description += '\n\n--- Campaign Tracking ---';
      if (utm_source) description += `\nSource: ${utm_source}`;
      if (utm_medium) description += `\nMedium: ${utm_medium}`;
      if (utm_campaign) description += `\nCampaign: ${utm_campaign}`;
      if (utm_term) description += `\nTerm: ${utm_term}`;
      if (utm_content) description += `\nContent: ${utm_content}`;
    }

    // Prepare lead data for Zoho CRM
    const leadData = {
      data: [
        {
          Last_Name: parentName, // Parent's name as last name
          Company: 'BFIS Admission', // Required field in Zoho
          Email: email,
          Phone: phone,
          Lead_Source: utm_source || 'Website - Admission Form', // Use UTM source if available
          Description: description,
          // Custom fields for UTM parameters (uncomment if you have these custom fields in Zoho CRM)
          // UTM_Source: utm_source,
          // UTM_Medium: utm_medium,
          // UTM_Campaign: utm_campaign,
          // UTM_Term: utm_term,
          // UTM_Content: utm_content,
          // Student_Name: studentName,
          // Class_Applying_For: classApplyingFor,
        }
      ],
      trigger: ['approval', 'workflow', 'blueprint']
    };

    // Submit to Zoho CRM
    console.log('📤 Submitting lead to Zoho CRM...');
    const zohoResponse = await fetch(
      `${process.env.ZOHO_API_URL}/crm/v2/Leads`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(leadData)
      }
    );

    const responseData = await zohoResponse.json();
    console.log('📥 Zoho API response:', {
      status: zohoResponse.status,
      ok: zohoResponse.ok,
      data: responseData
    });

    if (!zohoResponse.ok) {
      console.error('Zoho API error:', responseData);
      return NextResponse.json(
        { 
          error: 'Failed to create lead in Zoho CRM',
          details: responseData
        },
        { status: zohoResponse.status }
      );
    }

    // Check if lead was created successfully
    if (responseData.data && responseData.data[0]?.status === 'success') {
      const leadId = responseData.data[0].details.id;
      
      // Send thank you email (non-blocking - don't fail the request if email fails)
      try {
        console.log('📧 Attempting to send thank you email...');
        await sendThankYouEmail(email, parentName, studentName);
        console.log('✅ Thank you email sent successfully');
      } catch (emailError) {
        // Log the error but don't fail the entire request
        console.error('⚠️ Failed to send thank you email:', emailError.message);
        console.error('Note: Lead was created successfully in Zoho CRM, but email failed');
        // Continue with success response even if email fails
      }

      return NextResponse.json({
        success: true,
        message: 'Lead created successfully',
        leadId: leadId
      });
    } else {
      return NextResponse.json(
        { 
          error: 'Failed to create lead',
          details: responseData
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Submit lead error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message
      },
      { status: 500 }
    );
  }
}

