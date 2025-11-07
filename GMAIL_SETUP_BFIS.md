# 📧 Gmail Setup for BFIS Enquiry Email

## Email Account: bfisenquiry@gmail.com

This guide will help you set up the **bfisenquiry@gmail.com** account to send automated Thank You emails.

---

## 🚀 Step-by-Step Setup

### Step 1: Enable 2-Factor Authentication

1. **Login to Gmail** with `bfisenquiry@gmail.com`
2. Go to **Google Account Settings**: https://myaccount.google.com/security
3. Scroll to **"2-Step Verification"**
4. Click **"Get Started"** or **"Turn On"**
5. Follow the prompts to set up 2FA (you'll need a phone number)
6. Complete the verification

> ⚠️ **Important**: 2FA is REQUIRED to generate App Passwords for Gmail

---

### Step 2: Generate App Password

1. **After enabling 2FA**, go to: https://myaccount.google.com/apppasswords
   
   > If you can't find it, search "App Passwords" in Google Account settings

2. **Sign in again** if prompted

3. **Create App Password**:
   - Under "Select app": Choose **"Mail"**
   - Under "Select device": Choose **"Other (Custom name)"**
   - Enter name: `BFIS Landing Page` or `BFIS Admission System`
   - Click **"Generate"**

4. **Copy the 16-character password** that appears
   - It will look like: `abcd efgh ijkl mnop` (without spaces when you copy)
   - **Save it somewhere safe** - you won't see it again!

---

### Step 3: Configure Environment Variables

Open or create **`.env.local`** file in your project root and add:

```bash
# ========================================
# EMAIL CONFIGURATION - Gmail (bfisenquiry@gmail.com)
# ========================================

# Gmail SMTP Settings
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false

# Gmail Account Credentials
SMTP_USER=bfisenquiry@gmail.com
SMTP_PASSWORD=your-16-char-app-password-here

# Sender Details
FROM_EMAIL=bfisenquiry@gmail.com
FROM_NAME=Brookfield International School
REPLY_TO=info@bfis.in

# ========================================
# ZOHO CRM CONFIGURATION (Keep existing)
# ========================================
ZOHO_CLIENT_ID=your-existing-zoho-client-id
ZOHO_CLIENT_SECRET=your-existing-zoho-client-secret
ZOHO_REDIRECT_URI=http://localhost:3000/api/zoho-callback
ZOHO_API_URL=https://www.zohoapis.in
```

**Replace** `your-16-char-app-password-here` with the actual App Password you copied in Step 2.

> ⚠️ **Remove spaces** from the App Password if they exist

---

### Step 4: Test the Configuration

#### Test 1: Verify SMTP Connection

1. **Start your development server**:
   ```bash
   pnpm dev
   ```

2. **Visit the test endpoint**:
   ```
   http://localhost:3000/api/test-email
   ```

3. **Check for success message**:
   ```json
   {
     "success": true,
     "message": "✅ SMTP connection verified successfully!",
     "details": {
       "host": "smtp.gmail.com",
       "port": "587",
       "user": "bfisenquiry@gmail.com",
       "fromEmail": "bfisenquiry@gmail.com",
       "fromName": "Brookfield International School"
     }
   }
   ```

#### Test 2: Send Test Email

1. **Fill out the admission form** on your landing page
2. **Check the console** for logs:
   ```
   📧 Attempting to send thank you email...
   📤 Using SMTP: { host: 'smtp.gmail.com', port: 587, from: 'bfisenquiry@gmail.com' }
   ✅ Thank you email sent successfully
   📬 Message ID: <unique-message-id>
   ```

3. **Check the recipient's inbox** for the email
4. **Check Gmail Sent folder** (login to bfisenquiry@gmail.com) to see sent emails

---

## 📧 Email Settings Summary

| Setting | Value |
|---------|-------|
| **From Email** | bfisenquiry@gmail.com |
| **From Name** | Brookfield International School |
| **Reply-To** | info@bfis.in |
| **Subject** | Thank You for Your Interest in Brookfield International School |
| **SMTP Host** | smtp.gmail.com |
| **SMTP Port** | 587 (TLS) |
| **Daily Limit** | 500 emails/day (Gmail free account) |

---

## 🔐 Security Best Practices

✅ **Never share** the App Password  
✅ **Never commit** `.env.local` to Git (already in .gitignore)  
✅ **Keep 2FA enabled** at all times  
✅ **Use App Password only** (not your regular Gmail password)  
✅ **Regenerate App Password** if compromised  

---

## ⚠️ Troubleshooting

### Error: "Invalid login: 535-5.7.8 Username and Password not accepted"

**Causes:**
- Using regular password instead of App Password
- 2FA not enabled
- App Password copied with spaces or incorrectly

**Solutions:**
1. Make sure 2FA is enabled on bfisenquiry@gmail.com
2. Generate a new App Password
3. Remove all spaces from the password when pasting
4. Ensure SMTP_USER is exactly: `bfisenquiry@gmail.com`

---

### Error: "Connection timeout" or "ETIMEDOUT"

**Causes:**
- Firewall blocking port 587
- Network issues
- Gmail temporarily blocking access

**Solutions:**
1. Check your internet connection
2. Try port 465 with SMTP_SECURE=true instead
3. Disable any VPN temporarily
4. Check if antivirus/firewall is blocking SMTP

---

### Error: "Authentication failed"

**Solutions:**
1. **Check the App Password** is correct
2. **Verify 2FA** is enabled: https://myaccount.google.com/security
3. **Regenerate App Password** if needed
4. **Check for typos** in SMTP_USER email address

---

### Emails going to spam?

**To improve deliverability:**

1. **Send test emails to yourself first**
2. **Mark as "Not Spam"** in Gmail if it lands there
3. **Send from your domain** (info@bfis.in) in production instead of Gmail
4. **Warm up the account** - send a few emails manually first
5. **Don't send too many emails too quickly** (Gmail may flag as spam)

**Better for Production:** Use your own domain email (info@bfis.in) with your hosting provider's SMTP

---

## 📊 Gmail Sending Limits

| Account Type | Daily Limit |
|-------------|-------------|
| Free Gmail Account | 500 emails/day |
| Google Workspace | 2,000 emails/day |

**Current Setup:** bfisenquiry@gmail.com = 500 emails/day

If you need more, consider:
- Google Workspace (paid)
- Your hosting provider's SMTP (often unlimited)
- Dedicated email service

---

## 🔄 Production Deployment

When deploying to Vercel, Netlify, or other platforms:

1. **Add environment variables** in platform dashboard:
   - `SMTP_HOST` = smtp.gmail.com
   - `SMTP_PORT` = 587
   - `SMTP_SECURE` = false
   - `SMTP_USER` = bfisenquiry@gmail.com
   - `SMTP_PASSWORD` = [your-app-password]
   - `FROM_EMAIL` = bfisenquiry@gmail.com
   - `FROM_NAME` = Brookfield International School
   - `REPLY_TO` = info@bfis.in

2. **Redeploy** the application

3. **Test** the live form submission

---

## 📞 Support Checklist

If emails are not sending:

- [ ] 2FA is enabled on bfisenquiry@gmail.com
- [ ] App Password generated and copied correctly
- [ ] `.env.local` file exists in project root
- [ ] All SMTP_* variables are set in `.env.local`
- [ ] No spaces in the App Password
- [ ] Server restarted after adding environment variables
- [ ] Test endpoint shows success
- [ ] Check console logs for specific error messages

---

## ✅ Quick Verification

Run this checklist after setup:

1. ✅ 2FA enabled on bfisenquiry@gmail.com
2. ✅ App Password generated
3. ✅ `.env.local` configured with all SMTP settings
4. ✅ `pnpm dev` started successfully
5. ✅ `http://localhost:3000/api/test-email` returns success
6. ✅ Test form submission sends email
7. ✅ Email received in inbox (check spam folder)
8. ✅ Email shows "from: bfisenquiry@gmail.com"

---

## 📝 Sample .env.local (Complete)

```bash
# ========================================
# EMAIL CONFIGURATION - Gmail
# ========================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=bfisenquiry@gmail.com
SMTP_PASSWORD=abcdefghijklmnop
FROM_EMAIL=bfisenquiry@gmail.com
FROM_NAME=Brookfield International School
REPLY_TO=info@bfis.in

# ========================================
# ZOHO CRM CONFIGURATION
# ========================================
ZOHO_CLIENT_ID=1000.XXXXXXXXXXXXXXXXXXXXX
ZOHO_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
ZOHO_REDIRECT_URI=http://localhost:3000/api/zoho-callback
ZOHO_API_URL=https://www.zohoapis.in
```

---

## 🎯 What Parents Will See

**From:** Brookfield International School <bfisenquiry@gmail.com>  
**Reply-To:** info@bfis.in  
**Subject:** Thank You for Your Interest in Brookfield International School

When parents reply, it will go to **info@bfis.in** (not bfisenquiry@gmail.com)

---

**Status:** ✅ Ready to configure! Follow the steps above to complete setup.

**Need help?** Check the troubleshooting section or review console logs for specific error codes.

