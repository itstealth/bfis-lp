# 🧪 UTM Tracking - Quick Test Guide

## ⚡ Quick Test (2 minutes)

### Step 1: Visit URL with UTM Parameters

Open your browser to:

```
http://localhost:3000?utm_source=Google&utm_medium=Search&utm_campaign=BFIS-Test
```

### Step 2: Open Developer Console

Press **F12** (or Right-click → Inspect → Console)

Look for this log:
```
📊 UTM Parameters captured: {
  utm_source: "Google",
  utm_medium: "Search",
  utm_campaign: "BFIS-Test",
  utm_term: "",
  utm_content: ""
}
```

✅ **If you see this, UTM capture is working!**

---

### Step 3: Fill Out the Form

Fill in all form fields:
- Parent's Name: Test Parent
- Student's Name: Test Student
- Email: test@example.com
- Phone: 1234567890
- Class: Any class

---

### Step 4: Submit Form

Click "Submit"

**In Browser Console**, look for:
```
📤 Submitting lead with UTM data: {
  parentName: "Test Parent",
  studentName: "Test Student",
  email: "test@example.com",
  phone: "1234567890",
  classApplyingFor: "grade-i",
  utm_source: "Google",        ← UTM data included!
  utm_medium: "Search",
  utm_campaign: "BFIS-Test",
  utm_term: "",
  utm_content: ""
}
```

**In Terminal/Server Console**, look for:
```
📊 UTM Parameters received: {
  utm_source: "Google",
  utm_medium: "Search",
  utm_campaign: "BFIS-Test"
}
```

✅ **If you see both, UTM parameters are being sent and received!**

---

### Step 5: Check Zoho CRM

1. Go to [Zoho CRM](https://crm.zoho.com/)
2. Navigate to **Leads**
3. Find your test lead
4. Check these fields:

**Lead Source:** Should be "Google" (from utm_source)

**Description:** Should include:
```
Student Name: Test Student
Class Applying For: grade-i

--- Campaign Tracking ---
Source: Google
Medium: Search
Campaign: BFIS-Test
```

✅ **If this looks right, everything is working perfectly!**

---

## 🔬 Additional Test Scenarios

### Test 2: No UTM Parameters

Visit: `http://localhost:3000` (no UTM params)

- Browser console should NOT show "UTM Parameters captured"
- Form submission should work normally
- Lead Source in Zoho: "Website - Admission Form" (default)
- No campaign tracking section in description

---

### Test 3: Partial UTM Parameters

Visit: `http://localhost:3000?utm_source=Facebook&utm_campaign=Social-Campaign`

- Only source and campaign should be captured
- Medium, term, content should be empty
- Description should only show the parameters that exist

---

### Test 4: All UTM Parameters

Visit:
```
http://localhost:3000?utm_source=Google&utm_medium=CPC&utm_campaign=Summer-2026&utm_term=international+school&utm_content=ad-variant-a
```

- All 5 parameters should be captured
- All should appear in the description
- Lead Source: "Google"

---

## ✅ Success Checklist

After testing, you should have confirmed:

- [ ] Browser console shows "📊 UTM Parameters captured" when URL has UTM params
- [ ] Browser console shows "📤 Submitting lead with UTM data" on form submit
- [ ] Server console shows "📊 UTM Parameters received"
- [ ] Lead created successfully in Zoho CRM
- [ ] Lead Source field shows utm_source value
- [ ] Description includes "Campaign Tracking" section
- [ ] All UTM parameters appear in description
- [ ] Works without UTM parameters (default behavior)

---

## 🐛 Troubleshooting

### UTM Parameters Not Captured

**Issue:** No "UTM Parameters captured" log in console

**Solutions:**
1. Make sure URL includes `?` before parameters
2. Check spelling: `utm_source` not `utmsource`
3. Refresh the page after adding UTM params
4. Clear browser cache if needed

---

### UTM Parameters Not in Zoho

**Issue:** Lead created but no campaign tracking in description

**Solutions:**
1. Check browser console - were UTM params sent?
2. Check server logs - were they received?
3. Verify the lead was created AFTER the code update
4. Check the correct lead in Zoho (by email or time)

---

### Lead Source Still Shows "Website - Admission Form"

**Issue:** Lead Source not showing utm_source value

**Check:**
1. Was utm_source parameter in the URL?
2. Browser console should show: `utm_source: "YourValue"`
3. If utm_source is empty/missing, default is used (expected behavior)

---

## 📊 Expected Logs Flow

When everything works correctly:

**1. Page Load (Browser Console):**
```
📊 UTM Parameters captured: { utm_source: "Google", ... }
```

**2. Form Submit (Browser Console):**
```
📤 Submitting lead with UTM data: { ..., utm_source: "Google", ... }
```

**3. API Receive (Server Console):**
```
📊 UTM Parameters received: { utm_source: "Google", ... }
🔑 Getting valid access token...
✅ Access token obtained successfully
📤 Submitting lead to Zoho CRM...
📥 Zoho API response: { status: 200, ok: true, ... }
```

**4. Zoho CRM (Web Interface):**
- New lead appears
- Lead Source = "Google"
- Description contains campaign tracking

---

## 🎯 Quick Test URLs

Copy-paste these for quick testing:

### Google Search Campaign
```
http://localhost:3000?utm_source=Google&utm_medium=Search&utm_campaign=Admissions-Test
```

### Facebook Social Campaign
```
http://localhost:3000?utm_source=Facebook&utm_medium=Social&utm_campaign=Back-to-School
```

### Email Newsletter
```
http://localhost:3000?utm_source=Newsletter&utm_medium=Email&utm_campaign=Monthly-Update
```

### Complete Example (All Parameters)
```
http://localhost:3000?utm_source=Google&utm_medium=CPC&utm_campaign=Summer-2026&utm_term=cbse+school+delhi&utm_content=blue-banner
```

---

## 🚀 Ready for Production

Once local testing passes, the same URLs work in production:

```
https://yourdomain.com?utm_source=Google&utm_medium=Search&utm_campaign=BFIS-Test
```

No code changes needed! 🎉

---

## 📚 Full Documentation

For complete details, see: **`UTM_TRACKING.md`**

---

**Estimated Test Time:** 5 minutes

**Start here:** Copy the first test URL and let's verify it works! ✨

