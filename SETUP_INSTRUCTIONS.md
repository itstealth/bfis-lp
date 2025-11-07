# 🚀 Quick Setup Instructions - BFIS Email System

## Current Configuration: bfisenquiry@gmail.com

Follow these steps to get the email system working:

---

## ✅ Step 1: Setup Gmail Account (5 minutes)

### A. Enable 2-Factor Authentication

1. **Login** to Gmail with `bfisenquiry@gmail.com`
2. Go to: https://myaccount.google.com/security
3. Find **"2-Step Verification"**
4. Click **"Get Started"** or **"Turn On"**
5. Follow prompts (you'll need a phone number)
6. Complete verification

### B. Generate App Password

1. After enabling 2FA, go to: https://myaccount.google.com/apppasswords
2. Sign in again if prompted
3. Create App Password:
   - App: **Mail**
   - Device: **Other (Custom name)**
   - Name: `BFIS Landing Page`
   - Click **Generate**
4. **Copy the 16-character password** (remove spaces)
   - Example: `abcd efgh ijkl mnop` → `abcdefghijklmnop`

---

## ✅ Step 2: Configure Environment Variables

1. **Copy the template file**:
   ```bash
   cp .env.local.template .env.local
   ```
   
   Or create `.env.local` manually in project root

2. **Add your credentials**:

```bash
# EMAIL CONFIGURATION
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=bfisenquiry@gmail.com
SMTP_PASSWORD=paste-your-16-char-app-password-here
FROM_EMAIL=bfisenquiry@gmail.com
FROM_NAME=Brookfield International School
REPLY_TO=info@bfis.in

# ZOHO CONFIGURATION (add your existing values)
ZOHO_CLIENT_ID=your-zoho-client-id
ZOHO_CLIENT_SECRET=your-zoho-client-secret
ZOHO_REDIRECT_URI=http://localhost:3000/api/zoho-callback
ZOHO_API_URL=https://www.zohoapis.in
```

3. **Save the file**

---

## ✅ Step 3: Test the Setup

### Test 1: Verify SMTP Connection

```bash
# Start dev server
pnpm dev

# Open browser and visit:
http://localhost:3000/api/test-email
```

**Expected Response:**
```json
{
  "success": true,
  "message": "✅ SMTP connection verified successfully!",
  "details": {
    "host": "smtp.gmail.com",
    "port": "587",
    "user": "bfisenquiry@gmail.com",
    "fromEmail": "bfisenquiry@gmail.com"
  }
}
```

### Test 2: Send Test Email

1. **Fill out the admission form** on your landing page
2. **Check console** for logs:
   ```
   📧 Attempting to send thank you email...
   📤 Using SMTP: { host: 'smtp.gmail.com', port: 587, from: 'bfisenquiry@gmail.com' }
   ✅ Thank you email sent successfully
   📬 Message ID: <unique-id>
   ```
3. **Check recipient's inbox** (and spam folder)
4. **Verify sender**: Should show "Brookfield International School <bfisenquiry@gmail.com>"

---

## 🎯 What Parents Will See

**Email Details:**
- **From:** Brookfield International School <bfisenquiry@gmail.com>
- **Reply-To:** info@bfis.in
- **Subject:** Thank You for Your Interest in Brookfield International School

**When they reply:** Email goes to info@bfis.in (not bfisenquiry@gmail.com)

---

## ⚠️ Troubleshooting

### Error: "Invalid login: 535-5.7.8 Username and Password not accepted"

**Cause:** Using wrong password or 2FA not enabled

**Solution:**
1. Enable 2FA: https://myaccount.google.com/security
2. Generate new App Password: https://myaccount.google.com/apppasswords
3. Copy password WITHOUT spaces
4. Paste in `.env.local` as SMTP_PASSWORD

---

### Error: "Missing SMTP configuration"

**Cause:** Environment variables not set

**Solution:**
1. Check `.env.local` file exists in project root
2. Verify all SMTP_* variables are set
3. Restart dev server: `pnpm dev`

---

### Error: "Connection timeout"

**Cause:** Network/firewall blocking SMTP

**Solution:**
1. Check internet connection
2. Try different port: Change SMTP_PORT to 465 and SMTP_SECURE to true
3. Disable VPN temporarily
4. Check firewall settings

---

### Emails going to spam?

**Solutions:**
1. Send test email to yourself first
2. Mark as "Not Spam" in Gmail
3. Ask recipients to add bfisenquiry@gmail.com to contacts
4. Send a few test emails manually from the Gmail account first (warm up)

---

## 📊 Gmail Limits

| Metric | Limit |
|--------|-------|
| Daily sending limit | 500 emails/day |
| Recommended rate | ~2-3 emails/minute |
| Attachment size | 25 MB |

**Tip:** For production with higher volume, consider using your hosting provider's SMTP

---

## 🔐 Security Checklist

- ✅ 2FA enabled on bfisenquiry@gmail.com
- ✅ Using App Password (not regular password)
- ✅ `.env.local` is in `.gitignore` (never commit)
- ✅ App Password is not shared
- ✅ Environment variables set correctly

---

## 📁 Files to Check

1. **`.env.local`** - Contains your credentials (never commit!)
2. **`src/lib/email-sender.js`** - Email sending logic (no changes needed)
3. **`src/app/api/submit-lead/route.js`** - Form submission handler (no changes needed)
4. **`src/app/api/test-email/route.js`** - Test endpoint

---

## 🚀 Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. **Add environment variables** in platform dashboard:
   - SMTP_HOST = `smtp.gmail.com`
   - SMTP_PORT = `587`
   - SMTP_SECURE = `false`
   - SMTP_USER = `bfisenquiry@gmail.com`
   - SMTP_PASSWORD = `[your-app-password]`
   - FROM_EMAIL = `bfisenquiry@gmail.com`
   - FROM_NAME = `Brookfield International School`
   - REPLY_TO = `info@bfis.in`

2. **Add Zoho variables** (your existing ones)

3. **Deploy** the application

4. **Test** live form submission

---

## 📚 Documentation

- **Quick Start**: `EMAIL_QUICK_START.md`
- **Gmail Setup**: `GMAIL_SETUP_BFIS.md` ⭐ **Most Important**
- **Detailed Guide**: `EMAIL_SETUP.md`
- **Provider Configs**: `NODEMAILER_SETUP.md`
- **Migration Details**: `NODEMAILER_MIGRATION_SUMMARY.md`

---

## ✅ Quick Checklist

Before testing, verify:

- [ ] Logged into bfisenquiry@gmail.com
- [ ] 2FA enabled
- [ ] App Password generated and copied
- [ ] `.env.local` file created in project root
- [ ] SMTP_USER = bfisenquiry@gmail.com
- [ ] SMTP_PASSWORD = your-app-password (no spaces)
- [ ] All other SMTP variables set
- [ ] Dev server running: `pnpm dev`
- [ ] Test endpoint works: http://localhost:3000/api/test-email
- [ ] Form submission sends email
- [ ] Email received with correct sender

---

## 🎉 You're Ready!

Once all steps are complete:
1. ✅ SMTP connection verified
2. ✅ Test email sent successfully
3. ✅ Emails appear from "Brookfield International School <bfisenquiry@gmail.com>"
4. ✅ Replies go to info@bfis.in

**Your automated email system is live!** 🚀

---

**Need Help?** See `GMAIL_SETUP_BFIS.md` for detailed troubleshooting or check console logs for specific error codes.

