# 📧 Email System Configuration - bfisenquiry@gmail.com

## ✅ System Status

The BFIS Landing Page email system has been configured to send automated Thank You emails from:

**📨 Sender Email:** bfisenquiry@gmail.com  
**👤 Display Name:** Brookfield International School  
**↩️ Reply-To:** info@bfis.in  

---

## 🎯 Quick Start (Just 3 Steps!)

### 1️⃣ Setup Gmail App Password

Login to **bfisenquiry@gmail.com** and:

1. Enable 2FA: https://myaccount.google.com/security
2. Generate App Password: https://myaccount.google.com/apppasswords
   - Select: Mail → Other (Custom name) → "BFIS Landing Page"
3. Copy the 16-character password (remove spaces)

### 2️⃣ Configure Environment Variables

Create **`.env.local`** in project root:

```bash
# Email Configuration (bfisenquiry@gmail.com)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=bfisenquiry@gmail.com
SMTP_PASSWORD=your-16-char-app-password
FROM_EMAIL=bfisenquiry@gmail.com
FROM_NAME=Brookfield International School
REPLY_TO=info@bfis.in

# Zoho CRM (your existing credentials)
ZOHO_CLIENT_ID=your-zoho-client-id
ZOHO_CLIENT_SECRET=your-zoho-client-secret
ZOHO_REDIRECT_URI=http://localhost:3000/api/zoho-callback
ZOHO_API_URL=https://www.zohoapis.in
```

### 3️⃣ Test & Go Live

```bash
# Start server
pnpm dev

# Test SMTP connection
http://localhost:3000/api/test-email

# Test form submission
# Fill out admission form and check inbox
```

---

## 📧 How It Works

### User Journey:

1. **Parent fills admission form** on landing page
2. **Lead created** in Zoho CRM ✅
3. **Email sent automatically** from bfisenquiry@gmail.com 📧
4. **Thank you page** displayed
5. **Email arrives** in parent's inbox within seconds

### Email Details:

```
From: Brookfield International School <bfisenquiry@gmail.com>
Reply-To: info@bfis.in
To: Parent's Email
Subject: Thank You for Your Interest in Brookfield International School

[Beautiful HTML email with school branding, contact info, and brochure link]
```

### Parent Reply Flow:

When parents click **Reply**, the email goes to **info@bfis.in** (not bfisenquiry@gmail.com).

---

## 🔧 Technical Details

### Code Structure (No Changes Needed!)

All email functionality is handled by:

1. **`src/lib/email-sender.js`** - Nodemailer SMTP implementation
2. **`src/lib/email-template.js`** - HTML email template (BFIS branded)
3. **`src/app/api/submit-lead/route.js`** - Form submission handler
4. **`src/app/api/test-email/route.js`** - SMTP connection tester

### Environment Variables Used:

| Variable | Value | Purpose |
|----------|-------|---------|
| SMTP_HOST | smtp.gmail.com | Gmail SMTP server |
| SMTP_PORT | 587 | TLS port (recommended) |
| SMTP_SECURE | false | STARTTLS (secure upgrade) |
| SMTP_USER | bfisenquiry@gmail.com | Gmail account |
| SMTP_PASSWORD | [App Password] | Gmail authentication |
| FROM_EMAIL | bfisenquiry@gmail.com | Sender email address |
| FROM_NAME | Brookfield International School | Display name |
| REPLY_TO | info@bfis.in | Reply address |

---

## 📊 Gmail Limits & Performance

| Metric | Value |
|--------|-------|
| **Daily Limit** | 500 emails/day |
| **Recommended Rate** | 2-3 emails/minute |
| **Attachment Size** | Up to 25 MB |
| **Cost** | FREE |

**Note:** If you need more than 500 emails/day, consider upgrading to Google Workspace or using your hosting provider's SMTP.

---

## 🔐 Security Features

✅ **2-Factor Authentication** required for Gmail  
✅ **App Password** used (not regular password)  
✅ **Environment variables** for credentials (never committed to Git)  
✅ **TLS encryption** for email transmission  
✅ **Separate reply-to** address for better email management  
✅ **Non-blocking** - Form works even if email fails  

---

## 🧪 Testing Checklist

### Pre-Launch Testing:

- [ ] SMTP connection verified: `http://localhost:3000/api/test-email`
- [ ] Console shows: `✅ Thank you email sent successfully`
- [ ] Test email received in inbox
- [ ] Email shows correct sender: "Brookfield International School"
- [ ] Reply-to works: Replies go to info@bfis.in
- [ ] Email design looks good on mobile and desktop
- [ ] Brochure download link works
- [ ] Contact information is correct
- [ ] Spam folder checked (should not be in spam)

### Console Log Example (Success):

```
📧 Attempting to send thank you email...
📤 Using SMTP: {
  host: 'smtp.gmail.com',
  port: 587,
  from: 'bfisenquiry@gmail.com'
}
✅ Thank you email sent successfully to: parent@example.com
📬 Message ID: <abc123@mail.gmail.com>
📨 Response: 250 2.0.0 OK 1234567890 x1234567890abc.123
```

---

## ⚠️ Common Issues & Solutions

### Issue: "Invalid login: 535-5.7.8 Username and Password not accepted"

**Solution:**
- Enable 2FA on bfisenquiry@gmail.com
- Use App Password (NOT regular Gmail password)
- Remove spaces from App Password when pasting

### Issue: "Missing SMTP configuration"

**Solution:**
- Create `.env.local` file in project root
- Verify all SMTP_* variables are set
- Restart server: `pnpm dev`

### Issue: "Connection timeout"

**Solution:**
- Check internet connection
- Try port 465: Set SMTP_PORT=465 and SMTP_SECURE=true
- Check firewall settings

### Issue: Emails going to spam

**Solution:**
- Send test emails to yourself first
- Mark as "Not Spam" in Gmail
- Warm up account (send a few manual emails first)
- Ask recipients to add bfisenquiry@gmail.com to contacts

---

## 🚀 Production Deployment

### Vercel / Netlify / Other Platforms:

1. **Go to project settings** → Environment Variables
2. **Add all variables**:
   - SMTP_HOST
   - SMTP_PORT
   - SMTP_SECURE
   - SMTP_USER
   - SMTP_PASSWORD
   - FROM_EMAIL
   - FROM_NAME
   - REPLY_TO
   - (Plus your Zoho variables)
3. **Redeploy** application
4. **Test** live form submission

### Production Checklist:

- [ ] All environment variables added to production
- [ ] Application deployed successfully
- [ ] Test form submission on live site
- [ ] Email received from bfisenquiry@gmail.com
- [ ] Zoho lead created successfully
- [ ] Thank you page displays correctly
- [ ] Monitor for 24 hours

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **GMAIL_SETUP_BFIS.md** | 📄 Complete Gmail setup guide (START HERE) |
| **SETUP_INSTRUCTIONS.md** | 🚀 Quick setup instructions |
| **EMAIL_QUICK_START.md** | ⚡ Quick reference guide |
| **EMAIL_SETUP.md** | 📖 Detailed email system documentation |
| **NODEMAILER_SETUP.md** | 🔧 Provider-specific configurations |
| **NODEMAILER_MIGRATION_SUMMARY.md** | 📝 Technical migration details |
| **README_EMAIL_SETUP.md** | 📋 This file - Overview |

---

## 📞 Support

### Need Help?

1. **Check console logs** for specific error messages
2. **Review** `GMAIL_SETUP_BFIS.md` for detailed troubleshooting
3. **Test SMTP** at: `http://localhost:3000/api/test-email`
4. **Verify credentials** by logging into Gmail manually

### Error Code Reference:

| Code | Meaning | Fix |
|------|---------|-----|
| EAUTH | Wrong password | Use App Password, enable 2FA |
| ECONNECTION | Can't connect | Check host/port/firewall |
| ETIMEDOUT | Timeout | Check network, try different port |

---

## ✅ System Ready!

Once configured:
- ✅ All emails sent from **bfisenquiry@gmail.com**
- ✅ Display name: **Brookfield International School**
- ✅ Replies go to **info@bfis.in**
- ✅ Beautiful branded HTML emails
- ✅ Automatic sending on form submission
- ✅ 500 emails/day capacity
- ✅ Secure, encrypted transmission
- ✅ Non-blocking (doesn't break form if email fails)

---

## 🎯 Next Actions

1. **Setup Gmail App Password** (5 minutes)
   - See: `GMAIL_SETUP_BFIS.md`

2. **Configure `.env.local`** (2 minutes)
   - Use template above

3. **Test Connection** (1 minute)
   - Visit: `http://localhost:3000/api/test-email`

4. **Test Form** (2 minutes)
   - Submit test admission form

5. **Deploy to Production**
   - Add env vars to hosting platform

---

**Total Setup Time:** ~10 minutes

**Status:** ✅ Ready to configure!

**Questions?** Check `GMAIL_SETUP_BFIS.md` for complete step-by-step instructions.

---

**Last Updated:** Configuration optimized for bfisenquiry@gmail.com  
**Package:** Nodemailer v7.0.10  
**Email Limit:** 500/day (Gmail free tier)  
**Production Ready:** ✅ Yes

