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
    const { parentName, studentName, email, phone, classApplyingFor } = body;

    // Validate required fields
    if (!parentName || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
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

    // Prepare lead data for Zoho CRM
    const leadData = {
      data: [
        {
          Last_Name: parentName, // Parent's name as last name
          Company: 'BFIS Admission', // Required field in Zoho
          Email: email,
          Phone: phone,
          Lead_Source: 'Website - Admission Form',
          Description: `Student Name: ${studentName || 'Not provided'}\nClass Applying For: ${classApplyingFor || 'Not specified'}`,
          // Custom fields (uncomment and adjust if you have these in your CRM)
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

