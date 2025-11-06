# 🔄 Zoho CRM Integration Flow

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      USER INTERACTION                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Hero Component (Form)                     │
│  • Collects: Parent Name, Student Name, Email, Phone, Class │
│  • Validates input                                           │
│  • Submits to /api/submit-lead                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│               API Route: /api/submit-lead                    │
│  • Receives form data                                        │
│  • Calls getValidAccessToken()                              │
│  • Formats data for Zoho CRM                                │
│  • Creates lead via Zoho API                                │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│           Token Manager (zoho-token-manager.js)             │
│  • Reads tokens from zoho-tokens.json                       │
│  • Checks if token is expired                               │
│  • Auto-refreshes if needed                                 │
│  • Returns valid access token                               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Zoho CRM API                            │
│  • Receives lead data                                       │
│  • Creates new lead                                         │
│  • Returns success/failure                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 OAuth Authentication Flow

### First-Time Setup (One Time Only)

```
1. Admin visits /api/zoho-auth
         │
         ▼
2. Redirected to Zoho Login
         │
         ▼
3. Admin authorizes app
         │
         ▼
4. Zoho redirects to /api/zoho-callback
         │
         ▼
5. Exchange code for tokens
         │
         ▼
6. Save to zoho-tokens.json
         │
         ▼
7. Display success message
```

### File: `zoho-tokens.json`
```json
{
  "access_token": "1000.xxx...",
  "refresh_token": "1000.yyy...",
  "expires_at": 1699999999999,
  "api_domain": "https://www.zohoapis.com",
  "token_type": "Bearer"
}
```

---

## 📋 Form Submission Flow

```
User fills form
     │
     ▼
User clicks "Submit"
     │
     ▼
handleSubmit() called
     │
     ├─ setIsSubmitting(true)
     │
     ├─ POST to /api/submit-lead
     │      │
     │      └─ Body: { parentName, studentName, email, phone, classApplyingFor }
     │
     ▼
API validates data
     │
     ▼
Get valid access token
     │
     ├─ Read zoho-tokens.json
     │
     ├─ Is token expired?
     │      │
     │      ├─ YES → Refresh token → Save new token
     │      │
     │      └─ NO → Use existing token
     │
     ▼
Format data for Zoho
     │
     └─ Last_Name: parentName
     └─ Email: email
     └─ Phone: phone
     └─ Company: "BFIS Admission"
     └─ Lead_Source: "Website - Admission Form"
     └─ Description: student info + class
     │
     ▼
POST to Zoho CRM API
     │
     ▼
Response received
     │
     ├─ SUCCESS → Show success message
     │           → Reset form
     │
     └─ ERROR → Show error message
```

---

## 🗂️ File Structure

```
bfis-lp/
├── .env.local                          # Your Zoho credentials (create this)
├── zoho-tokens.json                    # Auto-generated on first auth
│
├── src/
│   ├── app/
│   │   └── api/
│   │       ├── zoho-auth/
│   │       │   └── route.js           # [NEW] Initiate OAuth
│   │       ├── zoho-callback/
│   │       │   └── route.js           # [NEW] Handle callback
│   │       └── submit-lead/
│   │           └── route.js           # [NEW] Submit to CRM
│   │
│   ├── components/
│   │   └── Hero.jsx                   # [UPDATED] Form with handler
│   │
│   └── lib/
│       ├── zoho-token-manager.js      # [NEW] Token management
│       └── zoho-tokens.js             # [OLD] Can be removed
│
└── docs/
    ├── QUICK_START.md                 # [NEW] Quick setup
    ├── ZOHO_INTEGRATION.md            # [NEW] Full guide
    ├── SETUP_SUMMARY.md               # [NEW] Overview
    ├── INTEGRATION_FLOW.md            # [NEW] This file
    └── ZOHO_SETUP.md                  # [DEPRECATED]
```

---

## 🔄 Token Lifecycle

```
┌─────────────────────────────────────────────┐
│  Access Token (Expires in 1 hour)           │
│  ↓                                           │
│  Used for API calls                         │
│  ↓                                           │
│  Checked before each request                │
│  ↓                                           │
│  Expired? → Use Refresh Token               │
│             ↓                                │
│             Get new Access Token            │
│             ↓                                │
│             Save to zoho-tokens.json        │
│             ↓                                │
│             Continue with API call          │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Refresh Token (Long-lived, ~years)         │
│  ↓                                           │
│  Used only to get new Access Tokens         │
│  ↓                                           │
│  Never expires unless revoked               │
│  ↓                                           │
│  If invalid → Re-authenticate               │
└─────────────────────────────────────────────┘
```

---

## 🎯 Data Mapping

### Form Field → Zoho CRM Lead Field

| Form Input | Variable | Zoho Field | Notes |
|------------|----------|------------|-------|
| Parent's Name | `parentName` | `Last_Name` | Required |
| Student's Name | `studentName` | `Description` | Part of description |
| Email | `email` | `Email` | Required |
| Phone | `phone` | `Phone` | Required |
| Class Applying For | `classApplyingFor` | `Description` | Part of description |
| - | - | `Company` | Fixed: "BFIS Admission" |
| - | - | `Lead_Source` | Fixed: "Website - Admission Form" |

---

## 🔧 API Endpoints

### 1. GET `/api/zoho-auth`
**Purpose**: Start OAuth flow  
**Access**: Admin only (one-time setup)  
**Response**: Redirects to Zoho authorization page

### 2. GET `/api/zoho-callback?code=xxx`
**Purpose**: Handle OAuth callback  
**Access**: Called by Zoho after authorization  
**Response**: Success page or error

### 3. POST `/api/submit-lead`
**Purpose**: Create lead in Zoho CRM  
**Access**: Public (called by form)  
**Body**:
```json
{
  "parentName": "John Doe",
  "studentName": "Jane Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "classApplyingFor": "grade-i"
}
```
**Response**:
```json
{
  "success": true,
  "message": "Lead created successfully",
  "leadId": "123456789"
}
```

---

## 🚦 Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Lead created |
| 400 | Bad Request | Check form data |
| 401 | Unauthorized | Run `/api/zoho-auth` |
| 500 | Server Error | Check logs |

---

## 🔍 Debugging

### Check Token Status
```bash
cat zoho-tokens.json
```

### Test Authentication
```bash
curl http://localhost:3000/api/zoho-auth
```

### Test Form Submission
```bash
curl -X POST http://localhost:3000/api/submit-lead \
  -H "Content-Type: application/json" \
  -d '{
    "parentName": "Test Parent",
    "studentName": "Test Student",
    "email": "test@example.com",
    "phone": "1234567890",
    "classApplyingFor": "grade-i"
  }'
```

### Check Logs
- Browser Console: Form submission errors
- Terminal: API route logs
- Zoho CRM: Verify leads are created

---

## 📊 Success Metrics

✅ Form submits without errors  
✅ Success message displays to user  
✅ Lead appears in Zoho CRM within seconds  
✅ All form fields map correctly  
✅ Tokens refresh automatically  
✅ No manual intervention needed  

---

## 🎓 Key Concepts

**OAuth 2.0**: Industry-standard authorization protocol  
**Access Token**: Short-lived token for API calls  
**Refresh Token**: Long-lived token to get new access tokens  
**Token Expiration**: Automatic refresh prevents interruption  
**Server-Side Routes**: Keeps credentials secure  
**Client Component**: Handles user interaction  

---

## 🔗 Related Documentation

- `QUICK_START.md` - Get started in 5 minutes
- `ZOHO_INTEGRATION.md` - Complete integration guide
- `SETUP_SUMMARY.md` - What was created
- [Zoho CRM API Docs](https://www.zoho.com/crm/developer/docs/api/v2/)

