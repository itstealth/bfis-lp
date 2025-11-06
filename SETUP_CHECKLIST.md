# ✅ Zoho CRM Integration - Setup Checklist

Follow this checklist to complete your Zoho CRM integration:

---

## 📝 Pre-Setup

- [ ] You have a Zoho CRM account
- [ ] You have your Zoho Client ID
- [ ] You have your Zoho Client Secret
- [ ] You know your Zoho region (.com, .eu, .in, .com.au)

---

## ⚙️ Configuration (5 minutes)

### Step 1: Environment Variables
- [ ] Create `.env.local` file in project root
- [ ] Add `ZOHO_CLIENT_ID`
- [ ] Add `ZOHO_CLIENT_SECRET`
- [ ] Add `ZOHO_REDIRECT_URI=http://localhost:3000/api/zoho-callback`
- [ ] Add `ZOHO_ACCOUNTS_URL` (with correct region)
- [ ] Add `ZOHO_API_URL` (with correct region)
- [ ] Add `NEXT_PUBLIC_SITE_URL=http://localhost:3000`

**Template:**
```env
ZOHO_CLIENT_ID=1000.XXXXXXXXXXXXXXXXXXXX
ZOHO_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
ZOHO_REDIRECT_URI=http://localhost:3000/api/zoho-callback
ZOHO_ACCOUNTS_URL=https://accounts.zoho.com
ZOHO_API_URL=https://www.zohoapis.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 2: Zoho API Console
- [ ] Go to [Zoho API Console](https://api-console.zoho.com/)
- [ ] Select your client/application
- [ ] Click "Edit" or settings
- [ ] Add redirect URI: `http://localhost:3000/api/zoho-callback`
- [ ] Save changes

---

## 🚀 Authentication (2 minutes)

### Step 3: Start Development Server
- [ ] Open terminal in project directory
- [ ] Run: `npm run dev`
- [ ] Wait for server to start

### Step 4: Authenticate with Zoho
- [ ] Open browser
- [ ] Visit: `http://localhost:3000/api/zoho-auth`
- [ ] Log in to Zoho (if not already logged in)
- [ ] Review permissions
- [ ] Click "Accept" or "Authorize"
- [ ] Wait for redirect to success page
- [ ] Verify `zoho-tokens.json` file was created in project root

---

## ✨ Testing (3 minutes)

### Step 5: Test Form Submission
- [ ] Go to: `http://localhost:3000`
- [ ] Scroll to admission form
- [ ] Fill in all fields:
  - [ ] Parent's Name
  - [ ] Student's Name
  - [ ] Email
  - [ ] Phone
  - [ ] Class Applying For
- [ ] Click "Submit"
- [ ] Wait for success message
- [ ] Form should reset after submission

### Step 6: Verify in Zoho CRM
- [ ] Open [Zoho CRM](https://crm.zoho.com/)
- [ ] Go to: Leads
- [ ] Find your test lead
- [ ] Verify all fields are populated correctly:
  - [ ] Last Name (Parent's Name)
  - [ ] Email
  - [ ] Phone
  - [ ] Lead Source: "Website - Admission Form"
  - [ ] Description contains student name and class

---

## 🔧 Troubleshooting

If something doesn't work, check:

- [ ] All environment variables are set correctly
- [ ] No typos in `.env.local`
- [ ] Redirect URI matches exactly in both places
- [ ] Development server is running
- [ ] Browser console for errors
- [ ] Terminal for error logs
- [ ] Zoho region is correct (.com, .eu, .in, etc.)

---

## 🎉 Success Indicators

You've successfully integrated when:

- ✅ No errors during authentication
- ✅ `zoho-tokens.json` file exists
- ✅ Form submits without errors
- ✅ Success message appears after submission
- ✅ Lead appears in Zoho CRM
- ✅ All data maps correctly

---

## 📋 Production Deployment Checklist

When ready for production:

- [ ] Add environment variables to hosting platform (Vercel/Netlify/etc.)
- [ ] Update `ZOHO_REDIRECT_URI` to production URL
- [ ] Update `NEXT_PUBLIC_SITE_URL` to production URL
- [ ] Add production redirect URI in Zoho API Console
- [ ] Deploy application
- [ ] Visit `https://yourdomain.com/api/zoho-auth` to authenticate in production
- [ ] Test form submission on production site
- [ ] Verify lead creation in Zoho CRM
- [ ] Monitor for any errors

---

## 📚 Need Help?

Stuck? Check these resources:

1. **Quick Start**: `QUICK_START.md` - Fast setup guide
2. **Full Guide**: `ZOHO_INTEGRATION.md` - Complete documentation
3. **Flow Diagram**: `INTEGRATION_FLOW.md` - Visual explanation
4. **Summary**: `SETUP_SUMMARY.md` - Overview of changes

---

## 🎯 Quick Reference

| Task | URL |
|------|-----|
| Authenticate | `http://localhost:3000/api/zoho-auth` |
| Zoho API Console | `https://api-console.zoho.com/` |
| Zoho CRM | `https://crm.zoho.com/` |
| Your Form | `http://localhost:3000/` |

---

**Estimated Total Setup Time: ~10 minutes**

🎊 Once you check all boxes, your integration is complete!

