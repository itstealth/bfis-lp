import { NextResponse } from 'next/server';
import { getValidAccessToken } from '@/lib/zoho-token-manager';

/**
 * Submit Lead to Zoho CRM
 * This endpoint receives form data and creates a lead in Zoho CRM
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
    if (!parentName || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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
      return NextResponse.json({
        success: true,
        message: 'Lead created successfully',
        leadId: responseData.data[0].details.id
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

