# 🔧 Zoho CRM Integration - Troubleshooting Guide

## Issue: "No tokens found" Error

If you're getting this error when trying to submit a lead:

```json
{
  "error": "Authentication required",
  "message": "Please authenticate with Zoho CRM first by visiting /api/zoho-auth",
  "details": "No tokens found. Please authenticate first by visiting /api/zoho-auth"
}
```

Follow these steps to diagnose and fix the issue:

---

## 📋 Step 1: Check Integration Status

Visit the debug endpoint to see what's happening:

```
http://localhost:3000/api/zoho-debug
```

This will show you:
- Whether the token file exists
- Whether tokens are present
- Whether tokens are expired
- Environment variable status
- Recommendations for fixing issues

---

## 🔍 Step 2: Verify Environment Variables

Make sure your `.env.local` file exists and contains all required variables:

```env
ZOHO_CLIENT_ID=1000.XXXXXXXXXXXXXXXXXXXX
ZOHO_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
ZOHO_REDIRECT_URI=http://localhost:3000/api/zoho-callback
ZOHO_ACCOUNTS_URL=https://accounts.zoho.com
ZOHO_API_URL=https://www.zohoapis.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Common Issues:**
- ❌ File doesn't exist
- ❌ Missing quotes around values (not needed)
- ❌ Extra spaces in variable names
- ❌ Wrong URLs for your region

**Fix:** Create or update `.env.local` with the correct values.

---

## 🔄 Step 3: Restart Development Server

After creating or updating `.env.local`, you **must** restart your dev server:

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

⚠️ **Important:** Next.js only reads environment variables when the server starts!

---

## 🔐 Step 4: Authenticate with Zoho

Visit the OAuth endpoint to authenticate:

```
http://localhost:3000/api/zoho-auth
```

**What should happen:**
1. ✅ Redirects to Zoho login page
2. ✅ You log in to Zoho
3. ✅ Zoho asks for permission
4. ✅ You click "Accept"
5. ✅ Redirects back to success page
6. ✅ Shows "Successfully Connected!" message

**Check your terminal/console for:**
```
✅ Tokens received from Zoho
📝 Writing tokens to: /path/to/your/project/zoho-tokens.json
✅ Token file created successfully
✅ Tokens saved successfully to zoho-tokens.json
✅ Tokens verified and ready to use!
```

---

## 📁 Step 5: Verify Token File Was Created

Check if the token file exists in your project root:

**Windows:**
```bash
dir zoho-tokens.json
```

**Mac/Linux:**
```bash
ls -la zoho-tokens.json
```

**Expected output:**
- File exists
- File has content (not empty)
- File is readable

**To view contents:**
```bash
# Windows
type zoho-tokens.json

# Mac/Linux
cat zoho-tokens.json
```

**Expected content:**
```json
{
  "access_token": "1000.xxxxx...",
  "refresh_token": "1000.yyyyy...",
  "expires_at": 1699999999999,
  "api_domain": "https://www.zohoapis.com",
  "token_type": "Bearer",
  "created_at": "2024-01-01T12:00:00.000Z"
}
```

---

## 🐛 Step 6: Check Console Logs

### During Authentication

When you visit `/api/zoho-auth` and complete OAuth, check your **terminal** for:

```
✅ Tokens received from Zoho: { has_access_token: true, has_refresh_token: true, expires_in: 3600 }
📝 Writing tokens to: D:\StealthDigital\bfis-lp\zoho-tokens.json
📝 Token data: { has_access_token: true, has_refresh_token: true, expires_at: '2024-...' }
✅ Token file created successfully
✅ Tokens saved successfully to zoho-tokens.json
✅ Tokens verified and ready to use!
```

### During Form Submission

When you submit the form, check your **terminal** for:

```
📖 Reading tokens from: D:\StealthDigital\bfis-lp\zoho-tokens.json
✅ Tokens found: { has_access_token: true, has_refresh_token: true, ... }
🔑 Getting valid access token...
✅ Access token obtained successfully
📤 Submitting lead to Zoho CRM...
📥 Zoho API response: { status: 200, ok: true, data: {...} }
```

---

## 🚨 Common Issues and Solutions

### Issue 1: Token File Not Created

**Symptoms:**
- `/api/zoho-debug` shows file doesn't exist
- No `zoho-tokens.json` in project root

**Possible Causes:**
1. File system permissions
2. Incorrect working directory
3. File system errors

**Solutions:**

**A) Check file permissions:**
```bash
# Make sure your project directory is writable
# Windows: Right-click folder → Properties → Security
# Mac/Linux: chmod +w .
```

**B) Manually create the file (temporary test):**
```bash
# Create empty file to test write permissions
echo {} > zoho-tokens.json
```

If this fails, there's a permissions issue.

**C) Check the path:**
Visit `/api/zoho-debug` and note the `tokenFile.path` value. Make sure it's pointing to your project root.

---

### Issue 2: Tokens Not Being Read

**Symptoms:**
- Token file exists
- But `/api/submit-lead` says "No tokens found"

**Solution:**

**A) Check file format:**
```bash
cat zoho-tokens.json
# or
type zoho-tokens.json
```

Make sure it's valid JSON. If it shows `{}` or is empty, re-authenticate.

**B) Check for JSON errors:**
The file must be valid JSON. Use an online JSON validator if needed.

**C) Restart the dev server:**
```bash
# Stop server (Ctrl+C)
npm run dev
```

---

### Issue 3: "ENOENT" Error

**Error Message:**
```
Error: ENOENT: no such file or directory
```

**Cause:** Next.js can't find the token file.

**Solution:**

1. Make sure you're in the project root directory
2. Check `process.cwd()` is correct:
   ```
   Visit: http://localhost:3000/api/zoho-debug
   Look at: "workingDirectory"
   ```
3. The token file should be in the same directory

---

### Issue 4: Token File Exists But Read Returns Null

**Symptoms:**
- File exists
- File has content
- But `readTokens()` returns null

**Solution:**

**A) Check file encoding:**
The file must be UTF-8 encoded.

**B) Check for BOM (Byte Order Mark):**
Some editors add a BOM that can break JSON parsing.

**C) Recreate the file:**
```bash
# Delete the file
rm zoho-tokens.json  # Mac/Linux
del zoho-tokens.json  # Windows

# Re-authenticate
# Visit: http://localhost:3000/api/zoho-auth
```

---

### Issue 5: Tokens Expire Immediately

**Symptoms:**
- Authentication succeeds
- But tokens show as expired immediately

**Solution:**

Check your system clock! Zoho tokens use timestamps.

```bash
# Windows
date && time

# Mac/Linux
date
```

Make sure your system time is correct.

---

## 🔄 Complete Reset Procedure

If nothing works, follow this complete reset:

### 1. Stop the Server
```bash
# Ctrl+C in terminal
```

### 2. Delete Token File
```bash
# Windows
del zoho-tokens.json

# Mac/Linux
rm zoho-tokens.json
```

### 3. Verify Environment Variables
```bash
# Windows
type .env.local

# Mac/Linux
cat .env.local
```

Make sure all values are correct.

### 4. Restart Dev Server
```bash
npm run dev
```

### 5. Check Debug Status
```
Visit: http://localhost:3000/api/zoho-debug
```

Should show "NOT AUTHENTICATED" status.

### 6. Authenticate
```
Visit: http://localhost:3000/api/zoho-auth
```

Complete the OAuth flow.

### 7. Verify Again
```
Visit: http://localhost:3000/api/zoho-debug
```

Should now show "AUTHENTICATED" status.

### 8. Test Form
1. Fill out form
2. Submit
3. Check terminal for logs
4. Verify lead in Zoho CRM

---

## 📊 Debug Checklist

Use this checklist to diagnose issues:

- [ ] `.env.local` file exists
- [ ] All environment variables are set
- [ ] Dev server has been restarted after creating `.env.local`
- [ ] Visited `/api/zoho-auth` and completed OAuth
- [ ] Saw "Successfully Connected!" page
- [ ] Terminal shows "Tokens saved successfully"
- [ ] `zoho-tokens.json` file exists in project root
- [ ] File contains valid JSON
- [ ] File has `access_token` and `refresh_token`
- [ ] `/api/zoho-debug` shows "AUTHENTICATED" status
- [ ] `/api/zoho-debug` shows `fileExists: true`
- [ ] No errors in terminal
- [ ] System clock is correct

---

## 🆘 Still Not Working?

If you've tried everything above:

### 1. Enable Verbose Logging

The code already has detailed logging. Watch your terminal during:
- Authentication: `/api/zoho-auth`
- Callback: `/api/zoho-callback`
- Form submission: `/api/submit-lead`

### 2. Check Browser Console

Open browser DevTools (F12) and check:
- Network tab for API calls
- Console tab for errors

### 3. Verify Zoho API Console Settings

Go to [Zoho API Console](https://api-console.zoho.com/):
- Client ID matches `.env.local`
- Client Secret matches `.env.local`
- Redirect URI is: `http://localhost:3000/api/zoho-callback`
- Application is active (not disabled)

### 4. Test Token Manually

Create a test endpoint to manually check tokens:

Visit `/api/zoho-debug` and look at the detailed output.

---

## 📞 Additional Resources

- **Quick Start**: `QUICK_START.md`
- **Full Guide**: `ZOHO_INTEGRATION.md`
- **Flow Diagram**: `INTEGRATION_FLOW.md`
- **Zoho API Docs**: https://www.zoho.com/crm/developer/docs/api/v2/

---

## 💡 Pro Tips

1. **Always check `/api/zoho-debug` first** - It tells you exactly what's wrong
2. **Watch the terminal** - All important logs appear there
3. **Restart after env changes** - Environment variables need a restart
4. **Check file permissions** - Make sure your project directory is writable
5. **Use correct region URLs** - .com, .eu, .in, .com.au must match your Zoho account

---

## ✅ Success Indicators

You'll know everything works when:

1. ✅ `/api/zoho-debug` shows "AUTHENTICATED"
2. ✅ Token file exists and has content
3. ✅ Form submission shows success message
4. ✅ Lead appears in Zoho CRM
5. ✅ No errors in terminal or browser console

---

**Need more help?** Check the logs carefully - they're designed to tell you exactly what's wrong!

