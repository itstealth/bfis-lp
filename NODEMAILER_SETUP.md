# 📧 Nodemailer SMTP Configuration Guide

## Environment Variables Required

Add these to your `.env.local` file:

```bash
# ========================================
# SMTP EMAIL CONFIGURATION (Required)
# ========================================

# SMTP Server Settings
SMTP_HOST=smtp.gmail.com                    # Your SMTP host
SMTP_PORT=587                               # 587 for TLS, 465 for SSL
SMTP_SECURE=false                           # true for port 465, false for port 587

# SMTP Authentication
SMTP_USER=your-email@gmail.com              # Your email address
SMTP_PASSWORD=your-app-password             # Your email password or app password

# Email Sender Details
FROM_EMAIL=your-email@gmail.com             # Email address to send from
FROM_NAME=Brookfield International School  # Display name for sender
REPLY_TO=info@bfis.in                      # Reply-to email address

# ========================================
# ZOHO CRM CONFIGURATION (Existing)
# ========================================
ZOHO_CLIENT_ID=your-zoho-client-id
ZOHO_CLIENT_SECRET=your-zoho-client-secret
ZOHO_REDIRECT_URI=http://localhost:3000/api/zoho-callback
ZOHO_API_URL=https://www.zohoapis.in
```

---

## 📋 Provider-Specific Configuration

### Gmail (bfisenquiry@gmail.com) ⭐ RECOMMENDED

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=bfisenquiry@gmail.com
SMTP_PASSWORD=your-16-char-app-password    # NOT your regular password!
FROM_EMAIL=bfisenquiry@gmail.com
FROM_NAME=Brookfield International School
REPLY_TO=info@bfis.in
```

**Requirements:**
- Enable 2-Factor Authentication on bfisenquiry@gmail.com
- Generate App Password: https://myaccount.google.com/apppasswords
- Remove spaces from App Password when pasting
- Limit: 500 emails/day

**📄 Complete Setup Guide:** See `GMAIL_SETUP_BFIS.md`

---

### Hostinger

```bash
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@bfis.in
SMTP_PASSWORD=your-email-password
FROM_EMAIL=info@bfis.in
FROM_NAME=Brookfield International School
REPLY_TO=info@bfis.in
```

---

### GoDaddy

```bash
SMTP_HOST=smtp.secureserver.net
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@bfis.in
SMTP_PASSWORD=your-email-password
FROM_EMAIL=info@bfis.in
FROM_NAME=Brookfield International School
REPLY_TO=info@bfis.in
```

---

### Office 365

```bash
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yourdomain.com
SMTP_PASSWORD=your-password
FROM_EMAIL=your-email@yourdomain.com
FROM_NAME=Brookfield International School
REPLY_TO=info@bfis.in
```

---

### cPanel / WHM (Generic Hosting)

```bash
SMTP_HOST=mail.bfis.in                     # Usually mail.yourdomain.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@bfis.in
SMTP_PASSWORD=your-email-password
FROM_EMAIL=info@bfis.in
FROM_NAME=Brookfield International School
REPLY_TO=info@bfis.in
```

---

## 🔐 Security Best Practices

1. **Never commit `.env.local`** - Already in `.gitignore`
2. **Use App Passwords** - For Gmail and services that support it
3. **Enable 2FA** - On all email accounts
4. **Rotate passwords** - Change passwords periodically
5. **Use environment variables** - Never hardcode credentials

---

## 🧪 Testing Your Configuration

### Method 1: Test Form Submission

1. Start dev server: `pnpm dev`
2. Fill out the admission form
3. Check console for email logs
4. Verify email arrived in inbox

### Method 2: Create Test Endpoint (Optional)

Create `src/app/api/test-email/route.js`:

```javascript
import { NextResponse } from 'next/server';
import { verifyEmailConnection, sendThankYouEmail } from '@/lib/email-sender';

export async function GET() {
  try {
    // Verify SMTP connection
    const verifyResult = await verifyEmailConnection();
    
    if (!verifyResult.success) {
      return NextResponse.json({
        success: false,
        message: 'SMTP connection failed',
        error: verifyResult.message
      }, { status: 500 });
    }

    // Send test email
    await sendThankYouEmail(
      'test@example.com',  // Replace with your test email
      'Test Parent',
      'Test Student'
    );

    return NextResponse.json({
      success: true,
      message: 'SMTP connection verified and test email sent!'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}
```

Then visit: `http://localhost:3000/api/test-email`

---

## ⚠️ Common Issues

### EAUTH - Authentication Failed
```
❌ Authentication failed. Check SMTP_USER and SMTP_PASSWORD.
```

**Solutions:**
- For Gmail: Use App Password, not regular password
- Verify email and password are correct
- Check if 2FA is enabled (required for Gmail)
- Ensure no extra spaces in credentials

---

### ECONNECTION - Connection Failed
```
❌ Connection failed. Check SMTP_HOST and SMTP_PORT.
```

**Solutions:**
- Verify SMTP_HOST is correct
- Try port 587 instead of 465 (or vice versa)
- Toggle SMTP_SECURE between true/false
- Check if firewall is blocking SMTP ports

---

### ETIMEDOUT - Connection Timeout
```
❌ Connection timeout. Check your network or SMTP settings.
```

**Solutions:**
- Check internet connection
- Verify firewall allows SMTP ports
- Try different port (587 vs 465)
- Contact hosting provider about SMTP access

---

### Self-signed certificate error
```
Error: self signed certificate in certificate chain
```

**Solution:**
Add to transporter config (for development only):
```javascript
tls: {
  rejectUnauthorized: false
}
```

---

## 📊 Port Reference

| Port | Type       | SMTP_SECURE | Use Case                    |
|------|------------|-------------|-----------------------------|
| 25   | SMTP       | false       | Legacy, often blocked       |
| 465  | SMTP SSL   | true        | Encrypted from start        |
| 587  | SMTP TLS   | false       | STARTTLS, recommended       |
| 2525 | Alternative| false       | When 25/587 are blocked     |

**Recommended:** Port 587 with SMTP_SECURE=false (STARTTLS)

---

## 🚀 Production Deployment

### Vercel / Netlify / Other Platforms

Add environment variables in platform dashboard:

1. Go to project settings
2. Find "Environment Variables"
3. Add all SMTP_* variables
4. Redeploy application

### Security Considerations

- ✅ Use your own domain email (info@bfis.in)
- ✅ Enable SPF records in DNS
- ✅ Enable DKIM if available
- ✅ Monitor bounce rates
- ✅ Keep credentials secure

---

## 📞 Support

If you need help:
1. Check console logs for specific error codes
2. Review provider's SMTP documentation
3. Test SMTP credentials using email client
4. Contact hosting provider support

---

**Status:** ✅ Nodemailer integration complete and production-ready!


