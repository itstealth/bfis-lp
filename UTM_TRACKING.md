# 📊 UTM Parameter Tracking - Implementation Guide

## Overview

Your lead form now automatically captures and stores UTM parameters from the landing page URL. This allows you to track which marketing campaigns, sources, and mediums are driving leads.

---

## ✅ What Was Implemented

### 1. **Client-Side UTM Capture** (`Hero.jsx`)
- Automatically extracts UTM parameters from URL on page load
- Stores them in component state
- Parameters persist throughout the user session
- Sends them with form submission

### 2. **Server-Side Processing** (`/api/submit-lead`)
- Receives UTM parameters with form data
- Includes them in Zoho CRM lead description
- Uses `utm_source` as Lead Source field
- Logs UTM data for debugging

---

## 🎯 Supported UTM Parameters

The following UTM parameters are captured:

| Parameter | Purpose | Example |
|-----------|---------|---------|
| `utm_source` | Identifies traffic source | Google, Facebook, Newsletter |
| `utm_medium` | Marketing medium | Search, Social, Email, CPC |
| `utm_campaign` | Campaign name | BFIS-Admissions-2026, Summer-Drive |
| `utm_term` | Keywords (paid search) | international+school, cbse+school |
| `utm_content` | Ad content variation | banner-a, text-link, blue-button |

---

## 🔗 Example URLs

### Basic Campaign Tracking
```
http://localhost:3000?utm_source=Google&utm_medium=Search&utm_campaign=BFIS-Test
```

### Complete Tracking with All Parameters
```
http://localhost:3000?utm_source=Google&utm_medium=CPC&utm_campaign=Admissions-2026&utm_term=international+school+delhi&utm_content=ad-variant-a
```

### Social Media Campaign
```
https://yourdomain.com?utm_source=Facebook&utm_medium=Social&utm_campaign=Back-to-School-2026
```

### Email Campaign
```
https://yourdomain.com?utm_source=Newsletter&utm_medium=Email&utm_campaign=Monthly-Update-Jan
```

---

## 📋 How It Works

### Step 1: User Visits Landing Page
```
User clicks: https://yourdomain.com?utm_source=Google&utm_medium=Search&utm_campaign=BFIS-Test
```

### Step 2: UTM Parameters Captured
```javascript
// Browser console log:
📊 UTM Parameters captured: {
  utm_source: "Google",
  utm_medium: "Search",
  utm_campaign: "BFIS-Test",
  utm_term: "",
  utm_content: ""
}
```

### Step 3: User Fills and Submits Form
UTM parameters are automatically included with submission.

### Step 4: API Receives Data
```javascript
// Server console log:
📊 UTM Parameters received: {
  utm_source: "Google",
  utm_medium: "Search",
  utm_campaign: "BFIS-Test"
}
```

### Step 5: Lead Created in Zoho CRM
**Lead Source:** Google  
**Description:**
```
Student Name: John Doe Jr.
Class Applying For: grade-i

--- Campaign Tracking ---
Source: Google
Medium: Search
Campaign: BFIS-Test
```

---

## 🧪 Testing

### Test 1: Basic UTM Tracking

1. Visit:
   ```
   http://localhost:3000?utm_source=TestSource&utm_medium=TestMedium&utm_campaign=TestCampaign
   ```

2. Open browser console (F12)

3. Look for:
   ```
   📊 UTM Parameters captured: { utm_source: "TestSource", ... }
   ```

4. Fill and submit the form

5. Check browser console for:
   ```
   📤 Submitting lead with UTM data: { ..., utm_source: "TestSource", ... }
   ```

6. Check server terminal for:
   ```
   📊 UTM Parameters received: { utm_source: "TestSource", ... }
   ```

7. Verify in Zoho CRM:
   - Lead Source should be "TestSource"
   - Description should include campaign tracking section

---

### Test 2: No UTM Parameters

1. Visit:
   ```
   http://localhost:3000
   ```

2. Submit form normally

3. Lead should be created with:
   - Lead Source: "Website - Admission Form" (default)
   - Description: Student info only (no campaign tracking section)

---

### Test 3: Partial UTM Parameters

1. Visit:
   ```
   http://localhost:3000?utm_source=Google&utm_campaign=Test
   ```

2. Submit form

3. Lead should include:
   - Only the parameters that were present
   - Empty parameters are not shown

---

## 📊 Data Flow Diagram

```
URL with UTM params
    ↓
Hero Component (useEffect)
    ↓
Extract URLSearchParams
    ↓
Store in utmParams state
    ↓
User fills form
    ↓
Form submission
    ↓
Combine formData + utmParams
    ↓
POST to /api/submit-lead
    ↓
API extracts UTM parameters
    ↓
Build description with UTM data
    ↓
Set Lead Source = utm_source (if present)
    ↓
Create lead in Zoho CRM
```

---

## 🔧 Customization

### Option 1: Add UTM Parameters as Custom Fields in Zoho

If you create custom fields in Zoho CRM for UTM parameters:

1. Go to Zoho CRM → Settings → Modules and Fields
2. Select "Leads"
3. Create custom fields:
   - `UTM_Source` (Single Line)
   - `UTM_Medium` (Single Line)
   - `UTM_Campaign` (Single Line)
   - `UTM_Term` (Single Line)
   - `UTM_Content` (Single Line)

4. Update `src/app/api/submit-lead/route.js`:

```javascript
const leadData = {
  data: [
    {
      Last_Name: parentName,
      // ... other fields ...
      
      // Uncomment these lines:
      UTM_Source: utm_source,
      UTM_Medium: utm_medium,
      UTM_Campaign: utm_campaign,
      UTM_Term: utm_term,
      UTM_Content: utm_content,
    }
  ]
};
```

This will store UTM parameters as separate filterable/reportable fields in Zoho.

---

### Option 2: Change Lead Source Mapping

Currently, `utm_source` is used as the Lead Source. You can change this:

```javascript
// Current (uses utm_source):
Lead_Source: utm_source || 'Website - Admission Form',

// Alternative 1: Always use default
Lead_Source: 'Website - Admission Form',

// Alternative 2: Create descriptive source
Lead_Source: utm_source 
  ? `Website - ${utm_source} (${utm_medium})` 
  : 'Website - Direct',

// Alternative 3: Map to specific values
Lead_Source: utm_source === 'Google' ? 'Google Ads' 
  : utm_source === 'Facebook' ? 'Facebook Ads'
  : 'Website - Admission Form',
```

---

### Option 3: Add Landing Page URL

Capture the full landing page URL:

**In `Hero.jsx`:**
```javascript
useEffect(() => {
  if (typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search);
    
    const capturedUtmParams = {
      utm_source: urlParams.get("utm_source") || "",
      utm_medium: urlParams.get("utm_medium") || "",
      utm_campaign: urlParams.get("utm_campaign") || "",
      utm_term: urlParams.get("utm_term") || "",
      utm_content: urlParams.get("utm_content") || "",
      landing_url: window.location.href, // Add this
    };
    
    setUtmParams(capturedUtmParams);
  }
}, []);
```

**In `submit-lead/route.js`:**
```javascript
const { 
  parentName, 
  // ... other fields ...
  landing_url
} = body;

// Add to description:
if (landing_url) {
  description += `\nLanding URL: ${landing_url}`;
}
```

---

## 📈 Analytics & Reporting

### In Zoho CRM

Once leads are created with UTM parameters, you can:

1. **Filter Leads by Source:**
   - Go to Leads
   - Filter by "Lead Source"
   - See which campaigns are driving leads

2. **Create Reports:**
   - Reports → New Report
   - Group by Lead Source, UTM Campaign
   - See lead volume by campaign

3. **Search in Description:**
   - Use global search
   - Search for specific campaign names
   - Find all leads from that campaign

### With Custom Fields (Recommended)

If you add custom UTM fields:

1. **Advanced Filtering:**
   - Filter by multiple UTM parameters
   - Example: All leads from Google + Search

2. **Detailed Reports:**
   - Report showing: Source, Medium, Campaign, Lead Count, Conversion Rate
   - Compare campaign performance

3. **Automation:**
   - Assign leads based on UTM parameters
   - Different workflows for different campaigns

---

## 🌐 Production Considerations

### Works Automatically on Vercel

No special configuration needed! The implementation works on any domain:

```
// Local
http://localhost:3000?utm_source=Google

// Production
https://yourdomain.com?utm_source=Google
```

### URL Encoding

If UTM parameters contain special characters, they'll be automatically URL-encoded:

```
// Spaces become +
utm_campaign=Back to School → utm_campaign=Back+to+School

// Special chars encoded
utm_term=schools in delhi → utm_term=schools+in+delhi
```

The code automatically decodes these.

---

## 🔍 Debugging

### Browser Console

Check if UTM parameters are captured:

```javascript
// Open DevTools (F12) → Console
// Look for:
📊 UTM Parameters captured: { ... }
📤 Submitting lead with UTM data: { ... }
```

### Server Logs

Check terminal for:

```
📊 UTM Parameters received: { utm_source: "...", utm_medium: "..." }
```

### Zoho CRM

Check the lead:
- Lead Source field
- Description field (should include Campaign Tracking section)

---

## ⚠️ Important Notes

1. **UTM Parameters Persist Until Submission**
   - Once captured, they're stored in component state
   - They persist even if user navigates within the page
   - They're cleared when form is successfully submitted

2. **Case Sensitive**
   - `utm_source=google` ≠ `utm_source=Google`
   - Maintain consistent casing in your campaigns

3. **URL Changes**
   - UTM parameters are only captured on initial page load
   - If URL changes (SPA navigation), they won't update
   - This is intentional - we want the initial landing page params

4. **Empty Parameters**
   - If a parameter is not in the URL, it's stored as empty string
   - Empty parameters are not included in Zoho description
   - This keeps the data clean

---

## 📚 Campaign URL Builder

Use Google's Campaign URL Builder to create UTM-tagged URLs:

https://ga-dev-tools.google/campaign-url-builder/

**Example Setup:**

- **Website URL:** https://yourdomain.com
- **Campaign Source:** Facebook
- **Campaign Medium:** Social
- **Campaign Name:** Admissions-2026
- **Campaign Term:** (optional)
- **Campaign Content:** blue-ad

**Generated URL:**
```
https://yourdomain.com?utm_source=Facebook&utm_medium=Social&utm_campaign=Admissions-2026&utm_content=blue-ad
```

---

## ✅ Best Practices

### 1. Naming Conventions

**Use consistent, descriptive names:**

✅ Good:
- `utm_source=Google`, `utm_source=Facebook`, `utm_source=Email`
- `utm_medium=CPC`, `utm_medium=Social`, `utm_medium=Email`
- `utm_campaign=Admissions-2026-Spring`

❌ Avoid:
- `utm_source=g`, `utm_source=fb`
- Inconsistent casing: `Google`, `google`, `GOOGLE`
- Special characters that need encoding

### 2. Campaign Structure

Organize campaigns logically:

```
utm_source=Google
utm_medium=CPC
utm_campaign=Admissions-2026
utm_content=ad-variant-a

utm_source=Google
utm_medium=CPC
utm_campaign=Admissions-2026
utm_content=ad-variant-b
```

This lets you compare ad variants within the same campaign.

### 3. Documentation

Keep a spreadsheet of all your campaigns:

| Campaign Name | Source | Medium | Term | Content | URL | Start Date |
|---------------|--------|--------|------|---------|-----|------------|
| Admissions-2026 | Google | CPC | international school | ad-a | ... | Jan 1 |

---

## 🎉 Summary

Your lead form now:

✅ Automatically captures UTM parameters from URL  
✅ Stores them throughout user session  
✅ Sends them with form submission  
✅ Includes them in Zoho CRM leads  
✅ Works on localhost and production  
✅ Handles all standard UTM parameters  
✅ Logs everything for debugging  

You can now track which marketing campaigns are generating leads! 🚀

---

**Next Steps:**

1. Test with sample UTM URLs
2. Create campaigns with UTM parameters
3. Monitor leads in Zoho CRM
4. Optionally: Add custom UTM fields in Zoho for better reporting

