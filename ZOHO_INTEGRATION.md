# Zoho CRM Integration Guide

This guide will help you set up the complete Zoho CRM integration for automatically capturing form submissions as leads.

## 📋 Prerequisites

Before starting, make sure you have:
- A Zoho CRM account
- Admin access to Zoho CRM
- Your Zoho Client ID and Client Secret from the [Zoho API Console](https://api-console.zoho.com/)

---

## 🚀 Setup Instructions

### Step 1: Configure Environment Variables

Create a `.env.local` file in your project root with the following content:

```env
# Zoho CRM Configuration
ZOHO_CLIENT_ID=your_zoho_client_id_here
ZOHO_CLIENT_SECRET=your_zoho_client_secret_here
ZOHO_REDIRECT_URI=http://localhost:3000/api/zoho-callback

# For production, update this to your production domain:
# ZOHO_REDIRECT_URI=https://yourdomain.com/api/zoho-callback

# Zoho API endpoints (change .com to your region: .eu, .in, .com.au, etc.)
ZOHO_ACCOUNTS_URL=https://accounts.zoho.com
ZOHO_API_URL=https://www.zohoapis.com

# Security
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Important Notes:**
- Replace `your_zoho_client_id_here` and `your_zoho_client_secret_here` with your actual credentials
- If you're in a different region (EU, India, Australia), update the URLs:
  - EU: `https://accounts.zoho.eu` and `https://www.zohoapis.eu`
  - India: `https://accounts.zoho.in` and `https://www.zohoapis.in`
  - Australia: `https://accounts.zoho.com.au` and `https://www.zohoapis.com.au`

### Step 2: Update Redirect URI in Zoho API Console

1. Go to [Zoho API Console](https://api-console.zoho.com/)
2. Select your client/app
3. Add the following redirect URI:
   - Development: `http://localhost:3000/api/zoho-callback`
   - Production: `https://yourdomain.com/api/zoho-callback`

### Step 3: Authenticate with Zoho CRM

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open your browser and visit:
   ```
   http://localhost:3000/api/zoho-auth
   ```

3. You'll be redirected to Zoho's authorization page
4. Log in with your Zoho account and grant permissions
5. After authorization, you'll be redirected back with a success message
6. A `zoho-tokens.json` file will be created in your project root (this file is gitignored)

### Step 4: Test the Integration

1. Visit your website homepage
2. Fill out the admission form
3. Submit the form
4. Check your Zoho CRM → Leads section
5. You should see a new lead created with all the form data

---

## 📁 Project Structure

```
src/
├── app/
│   └── api/
│       ├── zoho-auth/
│       │   └── route.js          # Step 1: Initiate OAuth flow
│       ├── zoho-callback/
│       │   └── route.js          # Step 2: Handle OAuth callback
│       └── submit-lead/
│           └── route.js          # Step 3: Submit lead to Zoho
├── components/
│   └── Hero.jsx                  # Updated form with submission handler
└── lib/
    └── zoho-token-manager.js     # Token storage and refresh logic
```

---

## 🔄 How It Works

### 1. OAuth Authentication Flow
- User visits `/api/zoho-auth`
- Redirected to Zoho for authorization
- After approval, Zoho redirects to `/api/zoho-callback`
- Access token and refresh token are stored in `zoho-tokens.json`

### 2. Form Submission Flow
- User fills out the form on your website
- Form data is sent to `/api/submit-lead`
- API route validates and formats the data
- Lead is created in Zoho CRM using the API
- Success/error message is displayed to the user

### 3. Token Management
- Access tokens expire after 1 hour
- The system automatically refreshes tokens using the refresh token
- Refresh tokens are valid for a long time (years)
- All token operations are handled transparently

---

## 🛠️ Customization

### Custom Fields in Zoho CRM

If you have custom fields in your Zoho CRM, you can map them in `src/app/api/submit-lead/route.js`:

```javascript
const leadData = {
  data: [
    {
      Last_Name: parentName,
      Company: 'BFIS Admission',
      Email: email,
      Phone: phone,
      Lead_Source: 'Website - Admission Form',
      Description: `Student Name: ${studentName}\nClass: ${classApplyingFor}`,
      
      // Add your custom fields here
      Student_Name: studentName,
      Class_Applying_For: classApplyingFor,
      // Custom_Field_API_Name: value,
    }
  ]
};
```

To find your custom field API names:
1. Go to Zoho CRM → Setup → Modules and Fields
2. Select "Leads"
3. Click on the field to see its API name

### Modifying Form Fields

To add or modify form fields:

1. Update the form state in `src/components/Hero.jsx`
2. Add/modify input fields in the form JSX
3. Update the API payload in `src/app/api/submit-lead/route.js`

---

## 🔒 Security Best Practices

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Never commit `zoho-tokens.json`** - It's also gitignored
3. **Use different credentials** for development and production
4. **Rotate your tokens** periodically from the Zoho API Console
5. **Limit API scopes** to only what you need

---

## 🐛 Troubleshooting

### "No tokens found" Error
- **Solution**: Visit `/api/zoho-auth` to authenticate first

### "Token refresh failed" Error
- **Solution**: Re-authenticate by visiting `/api/zoho-auth` again
- This can happen if the refresh token expires or is revoked

### "Invalid redirect URI" Error
- **Solution**: Make sure the redirect URI in your `.env.local` matches exactly what's configured in Zoho API Console

### Lead not appearing in Zoho CRM
- **Solution**: 
  1. Check the browser console for errors
  2. Verify your Zoho API URL matches your region
  3. Ensure you have permission to create leads in your CRM
  4. Check if there are any required fields in your Zoho CRM that aren't being populated

### "CORS" or "Network" Errors
- **Solution**: These are API routes (server-side), so CORS shouldn't be an issue. Check:
  1. Your environment variables are loaded correctly
  2. Your Next.js dev server is running
  3. The API endpoint URLs are correct

---

## 📊 Monitoring

### Check Token Status
The `zoho-tokens.json` file contains:
- `access_token`: Used for API calls (expires in 1 hour)
- `refresh_token`: Used to get new access tokens (long-lived)
- `expires_at`: Timestamp when access token expires
- `api_domain`: Your Zoho API domain

### View Logs
Check your terminal/console for:
- Token refresh events
- API request/response logs
- Form submission status

---

## 🚀 Production Deployment

Before deploying to production:

1. **Update Environment Variables**:
   - Set production Zoho credentials
   - Update `ZOHO_REDIRECT_URI` to your production domain
   - Update `NEXT_PUBLIC_SITE_URL` to your production URL

2. **Re-authenticate in Production**:
   - After deployment, visit `https://yourdomain.com/api/zoho-auth`
   - Complete the OAuth flow in production

3. **Secure Token Storage**:
   - For production, consider using a database or secure storage service
   - The file-based approach works but isn't ideal for multi-instance deployments

4. **Test Thoroughly**:
   - Submit test leads to verify the integration
   - Check that leads appear correctly in Zoho CRM

---

## 📝 Additional Resources

- [Zoho CRM API Documentation](https://www.zoho.com/crm/developer/docs/api/v2/)
- [Zoho OAuth 2.0 Guide](https://www.zoho.com/crm/developer/docs/api/v2/oauth-overview.html)
- [Zoho API Console](https://api-console.zoho.com/)

---

## 💡 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the Zoho CRM API documentation
3. Check your browser's console and network tab
4. Verify all environment variables are set correctly

---

## ✅ Integration Checklist

- [ ] Created `.env.local` with Zoho credentials
- [ ] Updated redirect URI in Zoho API Console
- [ ] Authenticated via `/api/zoho-auth`
- [ ] `zoho-tokens.json` file created successfully
- [ ] Tested form submission
- [ ] Verified lead appears in Zoho CRM
- [ ] Customized field mappings (if needed)
- [ ] Configured for production (when ready)

