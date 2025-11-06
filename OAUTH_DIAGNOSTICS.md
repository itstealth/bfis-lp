# 🔍 Zoho OAuth Diagnostics & Fix Guide

## Your Current Issue

Based on your debug output:

```json
{
  "status": "NOT AUTHENTICATED",
  "tokenFile": { "exists": false },
  "environment": { "all vars": true }
}
```

**Console logs show:**
```
✅ Tokens received from Zoho:
{ has_access_token: false, has_refresh_token: false, expires_in: undefined }
❌ Error writing tokens: RangeError: Invalid time value
```

**Root Cause:** Zoho is returning an **error response** instead of tokens, but the code was treating it as a successful token response.

---

## ✅ I've Fixed the Code

The updated code now:
1. ✅ Validates that tokens exist before trying to save them
2. ✅ Handles `expires_in: undefined` gracefully
3. ✅ Logs the **full Zoho response** for debugging
4. ✅ Shows clear error messages when token exchange fails
5. ✅ Prevents "Invalid time value" errors

---

## 🚀 Follow These Steps to Fix Your OAuth

### Step 1: Restart Your Dev Server

**Critical:** You must restart to load the updated code.

```bash
# Stop the server (Ctrl+C)
npm run dev
```

---

### Step 2: Verify Environment Variables

Check your `.env.local` file has **ALL** these variables:

```env
ZOHO_CLIENT_ID=1000.XXXXXXXXXXXXXXXXXXXX
ZOHO_CLIENT_SECRET=your_secret_here
ZOHO_REDIRECT_URI=http://localhost:3000/api/zoho-callback
ZOHO_ACCOUNTS_URL=https://accounts.zoho.com
ZOHO_API_URL=https://www.zohoapis.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Common Mistakes:**
- ❌ Missing `ZOHO_ACCOUNTS_URL` or `ZOHO_API_URL`
- ❌ Redirect URI has trailing slash (`/callback/` instead of `/callback`)
- ❌ Wrong region (should be `.com`, `.eu`, `.in`, or `.com.au`)
- ❌ Copy-paste errors with quotes or spaces

**After updating `.env.local`, restart your server!**

---

### Step 3: Check Zoho API Console Settings

Go to [Zoho API Console](https://api-console.zoho.com/):

1. **Find your client**
2. **Check "Authorized Redirect URIs"** - Must **EXACTLY** match:
   ```
   http://localhost:3000/api/zoho-callback
   ```
   
   Common issues:
   - ❌ Has `https://` instead of `http://` for localhost
   - ❌ Has trailing slash: `/callback/`
   - ❌ Wrong port number
   - ❌ Missing entirely

3. **Save changes** if you made any updates

---

### Step 4: Start Fresh OAuth Flow

Now try authenticating again. Visit:

```
http://localhost:3000/api/zoho-auth
```

**Watch your terminal carefully!** You should see:

```
🔐 Starting Zoho OAuth flow...
📋 Configuration: { clientId: '1000.XXX...', redirectUri: 'http://localhost:3000/api/zoho-callback', ... }
🌐 Redirecting to Zoho authorization URL
🔗 Auth URL: https://accounts.zoho.com/oauth/v2/auth?...
```

**If you see errors here, your env variables are wrong!**

---

### Step 5: Complete Authorization

1. **Login to Zoho** (if not already logged in)
2. **Review permissions** - Should show CRM access
3. **Click "Accept" or "Authorize"**
4. **Wait for redirect** back to your app

---

### Step 6: Check Callback Logs

After you authorize, watch your terminal for these logs:

**Good logs (Success):**
```
🔄 Exchanging code for tokens...
📤 Token request params: { code: '1000.xxx...', redirect_uri: 'http://localhost:3000/api/zoho-callback', ... }
📥 Token response status: 200
📥 Full Zoho response: {
  "access_token": "1000.xxxxx...",
  "refresh_token": "1000.yyyyy...",
  "expires_in": 3600,
  ...
}
✅ Tokens received from Zoho: { has_access_token: true, has_refresh_token: true, expires_in: 3600 }
📝 Writing tokens to: D:\StealthDigital\bfis-lp\zoho-tokens.json
✅ Token file created successfully
```

**Bad logs (Error):**
```
🔄 Exchanging code for tokens...
📥 Token response status: 400  ← NOT 200!
📥 Full Zoho response: {
  "error": "invalid_code"  ← This tells you what's wrong
}
❌ Token exchange failed with status: 400
```

---

## 🐛 Common Zoho API Errors & Solutions

### Error: `"error": "invalid_code"`

**Meaning:** The authorization code is invalid or expired.

**Causes:**
1. Authorization code was already used (codes are single-use)
2. Code expired (they expire in ~60 seconds)
3. Browser refreshed the callback page

**Solution:**
- Start over from Step 4 (`/api/zoho-auth`)
- Complete the flow **quickly** (don't wait)
- **Don't refresh** the callback page

---

### Error: `"error": "invalid_client"`

**Meaning:** Client ID or Client Secret is wrong.

**Solution:**
1. Go to [Zoho API Console](https://api-console.zoho.com/)
2. Find your client
3. **Copy the Client ID** - make sure you copy it exactly
4. **Copy the Client Secret** (you may need to regenerate it)
5. Update `.env.local`
6. **Restart server**
7. Try again

---

### Error: `"error": "redirect_uri_mismatch"`

**Meaning:** The redirect URI doesn't match Zoho's records.

**Solution:**
1. Check your `.env.local`:
   ```env
   ZOHO_REDIRECT_URI=http://localhost:3000/api/zoho-callback
   ```
2. Go to [Zoho API Console](https://api-console.zoho.com/)
3. Add **EXACT** redirect URI: `http://localhost:3000/api/zoho-callback`
4. Make sure there's **no trailing slash**
5. Use `http` not `https` for localhost
6. **Save** in Zoho console
7. **Restart** your server
8. Try again

---

### Error: `"error": "invalid_scope"`

**Meaning:** The requested scopes are not available for your client.

**Solution:**
1. Go to [Zoho API Console](https://api-console.zoho.com/)
2. Check if your client has CRM API access
3. Make sure your Zoho account has CRM enabled
4. Try reducing scopes if needed (edit `src/app/api/zoho-auth/route.js`)

---

### Error: Status 500 or undefined response

**Meaning:** Network issue or Zoho service problem.

**Solution:**
1. Check your internet connection
2. Verify `ZOHO_ACCOUNTS_URL` is correct for your region
3. Try again in a few minutes
4. Check [Zoho Status Page](https://status.zoho.com/)

---

## 🔍 Detailed Debugging Steps

### Debug Step 1: Check What Zoho Returns

After authorization, check your terminal for:

```
📥 Full Zoho response:
```

This shows **exactly** what Zoho returned. Look for:

**If it's an error:**
```json
{
  "error": "invalid_code",
  "error_description": "The given authorization code is invalid or expired"
}
```
→ **Solution:** The specific error tells you what to fix

**If it's successful:**
```json
{
  "access_token": "1000.xxxxx...",
  "refresh_token": "1000.yyyyy...",
  "expires_in": 3600,
  "api_domain": "https://www.zohoapis.com",
  "token_type": "Bearer"
}
```
→ **This is good!** Tokens should save successfully

---

### Debug Step 2: Verify Environment Variable Region

Make sure your Zoho URLs match your account region:

**US (.com):**
```env
ZOHO_ACCOUNTS_URL=https://accounts.zoho.com
ZOHO_API_URL=https://www.zohoapis.com
```

**Europe (.eu):**
```env
ZOHO_ACCOUNTS_URL=https://accounts.zoho.eu
ZOHO_API_URL=https://www.zohoapis.eu
```

**India (.in):**
```env
ZOHO_ACCOUNTS_URL=https://accounts.zoho.in
ZOHO_API_URL=https://www.zohoapis.in
```

**Australia (.com.au):**
```env
ZOHO_ACCOUNTS_URL=https://accounts.zoho.com.au
ZOHO_API_URL=https://www.zohoapis.com.au
```

**How to check your region:**
1. Log into Zoho CRM
2. Check the URL: `crm.zoho.com`, `crm.zoho.eu`, etc.
3. Use the matching region in your env variables

---

### Debug Step 3: Check Token Request Parameters

The logs now show what's being sent to Zoho:

```
📤 Token request params: {
  code: '1000.xxx...',
  client_id: '1000.yyy...',
  redirect_uri: 'http://localhost:3000/api/zoho-callback',
  grant_type: 'authorization_code'
}
```

Verify:
- ✅ `code` is present and looks like a long string
- ✅ `client_id` matches your Zoho API Console
- ✅ `redirect_uri` **EXACTLY** matches Zoho API Console
- ✅ All values are present (not undefined)

---

## 📋 Complete Diagnostic Checklist

Before trying again, verify:

- [ ] Restarted dev server after code updates
- [ ] `.env.local` exists and has all 6 variables
- [ ] No typos in environment variable names
- [ ] No extra quotes or spaces in `.env.local`
- [ ] Correct region URLs (`.com`, `.eu`, `.in`, or `.com.au`)
- [ ] Restarted server after updating `.env.local`
- [ ] Zoho API Console has exact redirect URI
- [ ] No trailing slash in redirect URI
- [ ] Using `http://` not `https://` for localhost
- [ ] Client ID and Secret are correct in Zoho Console
- [ ] Zoho account has CRM access enabled
- [ ] Not refreshing the callback page during OAuth

---

## 🎯 Expected Successful Flow

When everything works correctly:

1. Visit `/api/zoho-auth`
   ```
   🔐 Starting Zoho OAuth flow...
   🌐 Redirecting to Zoho authorization URL
   ```

2. Login and authorize on Zoho

3. Redirect back to `/api/zoho-callback`
   ```
   🔄 Exchanging code for tokens...
   📥 Token response status: 200
   📥 Full Zoho response: { access_token: ..., refresh_token: ... }
   ✅ Tokens received from Zoho
   📝 Writing tokens to: zoho-tokens.json
   ✅ Token file created successfully
   ✅ Tokens verified and ready to use!
   ```

4. File created: `zoho-tokens.json`

5. Visit `/api/zoho-debug`
   ```json
   { "status": "AUTHENTICATED" }
   ```

6. Form submission works!

---

## 🆘 If Nothing Works

### Last Resort: Create New Zoho Client

Sometimes the Zoho client itself is misconfigured. Create a fresh one:

1. Go to [Zoho API Console](https://api-console.zoho.com/)
2. Click "Add Client"
3. Select "Server-based Applications"
4. Fill in:
   - **Client Name:** BFIS Lead Form
   - **Homepage URL:** http://localhost:3000
   - **Authorized Redirect URIs:** `http://localhost:3000/api/zoho-callback`
5. Click "Create"
6. Copy the **new** Client ID and Client Secret
7. Update `.env.local` with the new values
8. Restart server
9. Try OAuth flow again

---

## 📊 What the Fix Does

The updated code:

1. **Validates tokens before saving** - Won't try to save if access_token is missing
2. **Handles missing expires_in** - Defaults to 1 hour if not provided
3. **Logs full Zoho response** - You can see exactly what Zoho returns
4. **Shows clear errors** - Specific error messages for each failure type
5. **Prevents Invalid time value** - Validates timestamps before using them

---

## ✅ Success Indicators

You'll know it's working when:

1. ✅ Terminal shows "✅ Tokens received from Zoho: { has_access_token: true, has_refresh_token: true }"
2. ✅ File `zoho-tokens.json` is created
3. ✅ `/api/zoho-debug` shows "AUTHENTICATED"
4. ✅ Form submission creates leads in Zoho CRM
5. ✅ No errors in terminal or browser console

---

## 🔗 Quick Reference

- **Auth URL:** http://localhost:3000/api/zoho-auth
- **Debug URL:** http://localhost:3000/api/zoho-debug
- **Zoho Console:** https://api-console.zoho.com/
- **Zoho CRM:** https://crm.zoho.com/

---

**Next Step:** Restart your server and check the terminal logs during OAuth! They'll tell you exactly what's going wrong. 🚀

