/**
 * Email Sender using Nodemailer with SMTP
 * Supports Gmail, custom SMTP servers, and any email provider
 */

import nodemailer from 'nodemailer';
import { getThankYouEmailHTML, getThankYouEmailText } from './email-template';

/**
 * Create and configure email transporter
 * Supports multiple SMTP providers based on environment variables
 */
function createEmailTransporter() {
  const SMTP_HOST = process.env.SMTP_HOST;
  const SMTP_PORT = process.env.SMTP_PORT || 465;
  const SMTP_SECURE = process.env.SMTP_SECURE === 'true' || SMTP_PORT == 465;
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASSWORD = process.env.SMTP_PASSWORD;

  // Validate required SMTP credentials
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
    const missing = [];
    if (!SMTP_HOST) missing.push('SMTP_HOST');
    if (!SMTP_USER) missing.push('SMTP_USER');
    if (!SMTP_PASSWORD) missing.push('SMTP_PASSWORD');
    
    console.error('❌ Missing SMTP configuration:', missing.join(', '));
    throw new Error(`Email service is not configured. Please set ${missing.join(', ')} in environment variables.`);
  }

  // Create transporter with SMTP configuration
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT),
    secure: SMTP_SECURE, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
    // Additional options for better reliability
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 5000,
    socketTimeout: 10000,
  });

  return transporter;
}

/**
 * Send Thank You email using Nodemailer
 * @param {string} toEmail - Recipient email address
 * @param {string} parentName - Parent's name
 * @param {string} studentName - Student's name (optional)
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function sendThankYouEmail(toEmail, parentName, studentName = '') {
  const FROM_EMAIL = process.env.FROM_EMAIL || process.env.SMTP_USER || 'info@bfis.in';
  const FROM_NAME = process.env.FROM_NAME || 'Brookfield International School';
  const REPLY_TO = process.env.REPLY_TO || 'info@bfis.in';

  try {
    // Create email transporter
    const transporter = createEmailTransporter();

    // Prepare email content
    const htmlContent = getThankYouEmailHTML(parentName, studentName);
    const textContent = getThankYouEmailText(parentName, studentName);

    // Email options
    const mailOptions = {
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: `"${parentName}" <${toEmail}>`,
      replyTo: REPLY_TO,
      subject: 'Thank You for Your Interest in Brookfield International School',
      text: textContent,
      html: htmlContent,
      // Email headers for better deliverability
      headers: {
        'X-Priority': '3',
        'X-Mailer': 'BFIS Admission System',
      },
    };

    console.log('📧 Sending thank you email to:', toEmail);
    console.log('📤 Using SMTP:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 465,
      from: FROM_EMAIL,
    });

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Thank you email sent successfully to:', toEmail);
    console.log('📬 Message ID:', info.messageId);
    console.log('📨 Response:', info.response);

    return {
      success: true,
      message: 'Email sent successfully',
      messageId: info.messageId,
    };

  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    
    // Provide more specific error messages
    if (error.code === 'EAUTH') {
      console.error('❌ Authentication failed. Check SMTP_USER and SMTP_PASSWORD.');
    } else if (error.code === 'ECONNECTION') {
      console.error('❌ Connection failed. Check SMTP_HOST and SMTP_PORT.');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('❌ Connection timeout. Check your network or SMTP settings.');
    }
    
    throw error;
  }
}

/**
 * Verify SMTP connection (useful for testing)
 * Call this to check if SMTP credentials are working
 */
export async function verifyEmailConnection() {
  try {
    const transporter = createEmailTransporter();
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully');
    return { success: true, message: 'SMTP connection verified' };
  } catch (error) {
    console.error('❌ SMTP verification failed:', error.message);
    return { success: false, message: error.message };
  }
}

/**
 * Alternative: Send email using Gmail SMTP (if you prefer Gmail)
 * Requires nodemailer package: pnpm add nodemailer
 * 
 * Setup:
 * 1. Enable 2FA on your Gmail account
 * 2. Generate an App Password: https://myaccount.google.com/apppasswords
 * 3. Set environment variables:
 *    - GMAIL_USER=your-email@gmail.com
 *    - GMAIL_APP_PASSWORD=your-app-password
 */

/**
 * Alternative: Send email using custom SMTP
 * Can be used with any SMTP provider (Hostinger, GoDaddy, etc.)
 * 
 * export async function sendEmailViaSMTP(toEmail, parentName, studentName) {
 *   const nodemailer = require('nodemailer');
 *   
 *   const transporter = nodemailer.createTransport({
 *     host: process.env.SMTP_HOST, // e.g., smtp.hostinger.com
 *     port: process.env.SMTP_PORT || 465,
 *     secure: true,
 *     auth: {
 *       user: process.env.SMTP_USER,
 *       pass: process.env.SMTP_PASSWORD
 *     }
 *   });
 *   
 *   await transporter.sendMail({
 *     from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
 *     to: toEmail,
 *     subject: 'Thank You for Your Interest in Brookfield International School',
 *     text: getThankYouEmailText(parentName, studentName),
 *     html: getThankYouEmailHTML(parentName, studentName)
 *   });
 * }
 */

