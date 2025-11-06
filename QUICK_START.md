# 🚀 Quick Start - Zoho CRM Integration

## Step 1: Create `.env.local` file

Create a new file named `.env.local` in your project root and add:

```env
ZOHO_CLIENT_ID=your_client_id_here
ZOHO_CLIENT_SECRET=your_client_secret_here
ZOHO_REDIRECT_URI=http://localhost:3000/api/zoho-callback
ZOHO_ACCOUNTS_URL=https://accounts.zoho.com
ZOHO_API_URL=https://www.zohoapis.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Replace:**
- `your_client_id_here` → Your Zoho Client ID
- `your_client_secret_here` → Your Zoho Client Secret

**Regional URLs (if not using .com):**
- EU: Change `.com` to `.eu`
- India: Change `.com` to `.in`
- Australia: Change `.com` to `.com.au`

---

## Step 2: Update Zoho API Console

1. Go to [Zoho API Console](https://api-console.zoho.com/)
2. Select your client
3. Add redirect URI: `http://localhost:3000/api/zoho-callback`

---

## Step 3: Start Development Server

```bash
npm run dev
```

---

## Step 4: Authenticate

1. Open: `http://localhost:3000/api/zoho-auth`
2. Login and authorize
3. You'll see a success message
4. A `zoho-tokens.json` file will be created

---

## Step 5: Test

1. Go to your homepage
2. Fill out the admission form
3. Submit
4. Check Zoho CRM → Leads

---

## ✅ Done!

Your form now automatically creates leads in Zoho CRM.

For detailed documentation, see `ZOHO_INTEGRATION.md`

