# Email Setup Guide - BFIS Landing Page

This guide will help you set up automated Thank You emails that are sent to users after they submit the admission form.

## 📧 Email Service: Nodemailer with SMTP

We're using **Nodemailer** with SMTP because:
- ✅ **Universal compatibility** - Works with any email provider (Gmail, Hostinger, GoDaddy, Office365, etc.)
- ✅ **Secure** - Industry-standard SMTP protocol
- ✅ **Reliable delivery** - Works with all email clients (Gmail, Outlook, Apple Mail, etc.)
- ✅ **Full control** - Use your own email server and domain
- ✅ **Production-ready** - Enterprise-grade email sending

---

## 🚀 Quick Setup Options

Choose the SMTP provider that works best for you:

### Option 1: Gmail (Recommended for Testing) ⭐

**Best for**: Testing and small-scale use (up to 500 emails/day)

#### Setup Steps:

1. **Enable 2-Factor Authentication on Gmail**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification

2. **Generate App Password**
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Other (Custom name)"
   - Enter: `BFIS Landing Page`
   - Click **Generate**
   - Copy the 16-character password

3. **Add to `.env.local`**:
   ```bash
   # Gmail SMTP Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-16-char-app-password
   FROM_EMAIL=your-email@gmail.com
   FROM_NAME=Brookfield International School
   REPLY_TO=info@bfis.in
   ```

---

### Option 2: Custom SMTP (Recommended for Production) ⭐⭐⭐

**Best for**: Production use with your own domain (e.g., info@bfis.in)

Works with:
- **Hostinger** (smtp.hostinger.com)
- **GoDaddy** (smtp.secureserver.net)
- **Namecheap** (mail.privateemail.com)
- **cPanel** (mail.yourdomain.com)
- **Office365** (smtp.office365.com)
- **Any other SMTP provider**

#### Setup Steps:

1. **Get SMTP Credentials from your hosting provider**
   - Login to your hosting control panel (cPanel, Plesk, etc.)
   - Find "Email Accounts" or "SMTP Settings"
   - Note down:
     - SMTP Host (e.g., `smtp.bfis.in` or `mail.bfis.in`)
     - SMTP Port (usually 465 or 587)
     - Email address and password

2. **Common SMTP Settings by Provider**:

   **Hostinger:**
   - Host: `smtp.hostinger.com`
   - Port: `465` (SSL) or `587` (TLS)

   **GoDaddy:**
   - Host: `smtp.secureserver.net`
   - Port: `465` (SSL) or `587` (TLS)

   **Office365:**
   - Host: `smtp.office365.com`
   - Port: `587` (TLS)

3. **Add to `.env.local`**:
   ```bash
   # Custom SMTP Configuration
   SMTP_HOST=mail.bfis.in
   SMTP_PORT=465
   SMTP_SECURE=true
   SMTP_USER=info@bfis.in
   SMTP_PASSWORD=your-email-password
   FROM_EMAIL=info@bfis.in
   FROM_NAME=Brookfield International School
   REPLY_TO=info@bfis.in
   ```

---

### Step 4: Test the Setup

1. **Restart your development server**:
   ```bash
   pnpm dev
   ```

2. **Submit a test form** on your landing page

3. **Check the console** for:
   ```
   📧 Attempting to send thank you email...
   📤 Using SMTP: { host: 'smtp.gmail.com', port: 587, from: 'your@email.com' }
   ✅ Thank you email sent successfully
   📬 Message ID: <unique-message-id>
   ```

4. **Check the recipient's inbox** (including spam folder)

---

## 🎨 Email Template Features

The thank you email includes:
- ✅ **Personalized greeting** with parent's name
- ✅ **Student name** mention (if provided)
- ✅ **Responsive design** - Looks great on mobile, tablet, and desktop
- ✅ **Brand colors** - Blue, white, and gold matching BFIS branding
- ✅ **Download brochure button** with direct link
- ✅ **Contact information** with clickable links
- ✅ **Professional footer** with school details
- ✅ **Plain text fallback** for email clients that don't support HTML

---

## 🔍 Troubleshooting

### Email not sending?

1. **Check SMTP Credentials**:
   - Verify `SMTP_HOST`, `SMTP_USER`, and `SMTP_PASSWORD` are set in `.env.local`
   - Ensure credentials are correct (no typos)
   - Check that the email account is active

2. **Check Console Logs**:
   ```bash
   # Look for these logs:
   📧 Attempting to send thank you email...
   📤 Using SMTP: { host: 'smtp.gmail.com', port: 587, from: 'your@email.com' }
   ✅ Thank you email sent successfully
   📬 Message ID: <unique-message-id>
   
   # Or errors:
   ❌ Error sending email: [error message]
   ❌ Authentication failed. Check SMTP_USER and SMTP_PASSWORD.
   ❌ Connection failed. Check SMTP_HOST and SMTP_PORT.
   ❌ Connection timeout. Check your network or SMTP settings.
   ```

3. **Common Error Solutions**:

   **EAUTH - Authentication Failed:**
   - Double-check your email and password
   - For Gmail: Make sure you're using an App Password (not your regular password)
   - Verify 2FA is enabled for Gmail
   
   **ECONNECTION - Connection Failed:**
   - Verify SMTP_HOST is correct
   - Check SMTP_PORT (465 for SSL, 587 for TLS)
   - Try changing SMTP_SECURE to `true` or `false`
   
   **ETIMEDOUT - Connection Timeout:**
   - Check your internet connection
   - Verify firewall isn't blocking SMTP ports
   - Try using port 587 instead of 465

4. **Test SMTP Connection**:
   - Create a test endpoint to verify SMTP settings
   - The code includes a `verifyEmailConnection()` function

### Email going to spam?

1. **Use Your Own Domain** (Recommended):
   - Use `info@bfis.in` instead of Gmail
   - This improves trust and deliverability

2. **SPF and DKIM Records**:
   - Add SPF record to your domain's DNS
   - Enable DKIM in your email provider
   - These authenticate your emails

3. **Content Best Practices**:
   - Email template is already optimized
   - Avoid spam trigger words
   - Include physical address (already in footer)
   - Provide unsubscribe option (for marketing emails)

### Port Configuration

**Port 465 (SSL/TLS):**
```bash
SMTP_PORT=465
SMTP_SECURE=true
```

**Port 587 (STARTTLS):**
```bash
SMTP_PORT=587
SMTP_SECURE=false
```

### Gmail-Specific Issues

**"Less secure app access" error:**
- Gmail removed this feature in 2022
- You MUST use App Passwords with 2FA enabled
- Regular password won't work

**Daily sending limit:**
- Gmail: 500 emails/day (free accounts)
- Gmail Workspace: 2,000 emails/day
- For more, use a dedicated SMTP provider

---

## 📊 Monitoring Email Activity

### Console Logs

The system provides detailed logging:
- ✅ Successful email sends with message IDs
- ❌ Failed attempts with specific error codes
- 📤 SMTP configuration being used
- ⚠️ Lead creation always succeeds even if email fails

### Email Provider Dashboard

Most email providers offer:
- Sent mail logs
- Delivery status
- Bounce tracking
- Check your email provider's control panel for these features

### SMTP Verification Tool

Use the built-in verification function to test your SMTP setup:

```javascript
// Add this to test endpoint (optional)
import { verifyEmailConnection } from '@/lib/email-sender';

const result = await verifyEmailConnection();
console.log(result); // { success: true, message: 'SMTP connection verified' }
```

---

## 🎯 What Happens When User Submits Form

1. **Form submission** → Validated
2. **Lead created** in Zoho CRM ✅
3. **Email sent** automatically 📧
4. **Thank you page** displays
5. User receives email within **seconds**

---

## 📝 Customizing the Email

To modify the email template:

1. Open: `src/lib/email-template.js`
2. Edit the HTML content in `getThankYouEmailHTML()` function
3. Update colors, text, or add new sections
4. Save and test

---

## ✅ Production Checklist

Before going live:

- [ ] SendGrid API key added to production environment variables
- [ ] Sender email (`FROM_EMAIL`) verified in SendGrid
- [ ] Domain authentication configured (recommended)
- [ ] Test email sent and received successfully
- [ ] Check spam folder handling
- [ ] Verify brochure download link works
- [ ] Confirm all contact information is correct

---

## 🆘 Need Help?

If you encounter any issues:

1. Check the troubleshooting section above
2. Review SendGrid Activity Feed
3. Check console logs for error messages
4. Verify all environment variables are set correctly

---

## 🔐 Security Notes

- ⚠️ **Never commit `.env.local` to git** (already in .gitignore)
- ⚠️ **Keep API keys secret**
- ⚠️ Use environment variables for all credentials
- ⚠️ Regenerate API key if accidentally exposed

---

**Ready to test?** Follow the Quick Setup above and submit a test form! 🚀

