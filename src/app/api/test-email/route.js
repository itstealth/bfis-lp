import { NextResponse } from 'next/server';
import { verifyEmailConnection } from '@/lib/email-sender';

/**
 * Test Email Configuration Endpoint
 * Visit: http://localhost:3000/api/test-email
 * 
 * This endpoint verifies your SMTP connection without sending an actual email
 */
export async function GET() {
  try {
    console.log('🧪 Testing SMTP configuration...');
    console.log('📋 SMTP Settings:', {
      host: process.env.SMTP_HOST || 'NOT SET',
      port: process.env.SMTP_PORT || 'NOT SET',
      user: process.env.SMTP_USER || 'NOT SET',
      passwordSet: !!process.env.SMTP_PASSWORD,
      fromEmail: process.env.FROM_EMAIL || 'NOT SET',
      fromName: process.env.FROM_NAME || 'NOT SET',
    });

    // Verify SMTP connection
    const result = await verifyEmailConnection();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: '✅ SMTP connection verified successfully!',
        details: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          user: process.env.SMTP_USER,
          fromEmail: process.env.FROM_EMAIL,
          fromName: process.env.FROM_NAME,
        },
        note: 'Your email configuration is working correctly. Test by submitting the admission form.'
      });
    } else {
      return NextResponse.json({
        success: false,
        message: '❌ SMTP connection failed',
        error: result.message,
        hint: 'Check your SMTP credentials in .env.local file'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('❌ Test email error:', error);
    return NextResponse.json({
      success: false,
      message: 'SMTP configuration test failed',
      error: error.message,
      help: {
        commonIssues: [
          'EAUTH: Wrong email/password (use App Password for Gmail)',
          'ECONNECTION: Wrong host/port',
          'ETIMEDOUT: Firewall or network issue',
        ],
        checkList: [
          'Verify all SMTP_* variables are set in .env.local',
          'For Gmail: Enable 2FA and use App Password',
          'Check SMTP_PORT (587 for TLS, 465 for SSL)',
          'Verify SMTP_SECURE matches your port',
        ]
      }
    }, { status: 500 });
  }
}


