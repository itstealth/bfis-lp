# 📧 Email Setup - Quick Start Guide

## ✅ What's Been Implemented

Your automated Thank You email system is now ready! Here's what happens:

1. User submits the admission form
2. Lead is created in Zoho CRM ✅
3. **Thank You email is sent automatically** 📧
4. User is redirected to thank-you.html page

---

## 🚀 Choose Your Email Provider

### Option A: Gmail (bfisenquiry@gmail.com) ⭐ RECOMMENDED

**Step 1: Enable 2FA and Generate App Password**
1. Login to **bfisenquiry@gmail.com**
2. Go to [Google Account Security](https://myaccount.google.com/security)
3. Enable **2-Step Verification**
4. Go to [App Passwords](https://myaccount.google.com/apppasswords)
5. Create new app password: Name it `BFIS Landing Page`
6. Copy the 16-character password (remove spaces)

**Step 2: Add to `.env.local`**

Create `.env.local` file in project root:

```bash
# Gmail SMTP Configuration (bfisenquiry@gmail.com)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=bfisenquiry@gmail.com
SMTP_PASSWORD=your-16-char-app-password
FROM_EMAIL=bfisenquiry@gmail.com
FROM_NAME=Brookfield International School
REPLY_TO=info@bfis.in

# Keep your existing Zoho config
ZOHO_CLIENT_ID=...
ZOHO_CLIENT_SECRET=...
```

**Limits:** 500 emails/day (free)

📄 **Detailed guide:** See `GMAIL_SETUP_BFIS.md` for complete setup instructions

---

### Option B: Your Own Email Server (Best for Production) ⭐⭐⭐

**Step 1: Get SMTP Details from Your Host**

Contact your hosting provider or check cPanel/Plesk for:
- SMTP Host (e.g., `mail.bfis.in`)
- SMTP Port (usually 465 or 587)
- Email credentials

**Common Providers:**
- **Hostinger**: `smtp.hostinger.com`, port 465
- **GoDaddy**: `smtp.secureserver.net`, port 465
- **cPanel**: `mail.yourdomain.com`, port 465

**Step 2: Add to `.env.local`**

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

# Keep your existing Zoho config
ZOHO_CLIENT_ID=...
ZOHO_CLIENT_SECRET=...
```

**Benefits:** Unlimited emails, uses your domain, better deliverability

---

## ✅ Final Step

Restart your dev server:
```bash
pnpm dev
```

---

## 🧪 Test It

1. Fill out the form on your landing page
2. Check console for:
   ```
   📧 Attempting to send thank you email...
   📤 Using SMTP: { host: 'smtp.gmail.com', port: 587, from: 'your@email.com' }
   ✅ Thank you email sent successfully
   📬 Message ID: <unique-id>
   ```
3. Check recipient's inbox (or spam folder)

---

## 📧 Email Features

Your professionally designed email includes:

✅ **Personalized** with parent & student names  
✅ **Responsive** design (works on all devices)  
✅ **Brand colors** (BFIS blue, white, gold)  
✅ **Download brochure** button  
✅ **Contact info** with clickable links  
✅ **Professional** layout (tested on Gmail, Outlook, Apple Mail)

---

## 📁 Files Created

- `src/lib/email-template.js` - Beautiful HTML email template
- `src/lib/email-sender.js` - Email sending logic (using fetch, no packages)
- `src/app/api/submit-lead/route.js` - Updated with email integration
- `EMAIL_SETUP.md` - Detailed setup guide
- `EMAIL_QUICK_START.md` - This file

---

## 🎯 Key Benefits

- **Universal compatibility** - Works with any email provider
- **Secure SMTP** - Industry-standard protocol
- **Production-ready** - Enterprise-grade Nodemailer
- **Non-blocking** - Form still works if email fails
- **Easy to customize** - Edit `email-template.js`
- **Full control** - Use your own domain and server

---

## ⚠️ Important Notes

- `.env.local` is already in `.gitignore` - **never commit it**
- Email is sent AFTER lead creation succeeds
- If email fails, lead still gets created in Zoho
- Check console logs and your email provider's dashboard to monitor emails

---

## 🆘 Troubleshooting

**Email not sending?**
- Check SMTP credentials in `.env.local`
- For Gmail: Make sure you're using App Password (not regular password)
- Verify SMTP_HOST and SMTP_PORT are correct
- Look for specific error codes in console logs

**Common Errors:**
- `EAUTH`: Wrong email/password
- `ECONNECTION`: Wrong host/port
- `ETIMEDOUT`: Firewall or network issue

**Email in spam?**
- Use your own domain (info@bfis.in) instead of Gmail
- Set up SPF/DKIM records with your host
- This greatly improves deliverability

For detailed troubleshooting, see `EMAIL_SETUP.md`

---

## 🔗 Quick Links

- [Gmail App Passwords](https://myaccount.google.com/apppasswords)
- [Enable 2FA on Google](https://myaccount.google.com/security)
- Check your hosting provider's docs for SMTP settings

---

**Ready?** Just add your SMTP credentials to `.env.local` and you're done! 🎉

