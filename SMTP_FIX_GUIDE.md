# SMTP Authentication Fix Guide

## 🔴 Current Issue
**Error:** `535 Incorrect authentication data`  
**Status:** Email service is accessible, but SMTP credentials are incorrect

## ✅ What's Working
- ✅ Email service is deployed and accessible
- ✅ API secret authentication is working (no more 401 errors)
- ✅ Health check returns 200 OK

## ❌ What's Not Working
- ❌ SMTP authentication failing (535 error)
- ❌ Emails cannot be sent

## 🔧 How to Fix

### Step 1: Get Your SMTP Credentials
You need the following information from your email provider:
- **SMTP Host** (e.g., `mail.spana.co.za`, `smtp.gmail.com`, `smtp.office365.com`)
- **SMTP Port** (usually `587` for TLS or `465` for SSL)
- **SMTP Username** (usually your email address)
- **SMTP Password** (app-specific password if using Gmail/Office365)
- **From Email** (the email address that will send emails)

### Step 2: Update Vercel Environment Variables

1. **Go to Vercel Dashboard**
   - Navigate to: https://vercel.com/dashboard
   - Select your project: `email-microservice-pi` (or your project name)

2. **Go to Settings → Environment Variables**

3. **Set/Update these variables:**

   ```
   SMTP_HOST=your-smtp-host.com
   SMTP_PORT=587
   SMTP_USER=your-email@domain.com
   SMTP_PASS=your-smtp-password
   SMTP_FROM=noreply@spana.co.za
   SMTP_SECURE=false
   API_SECRET=e37cf6365bf1daa23bbb4dfd359a978117857dfabb5410478ca0f8c58880cbf3
   ```

4. **Important Notes:**
   - For **Gmail**: Use an "App Password" (not your regular password)
     - Go to Google Account → Security → 2-Step Verification → App Passwords
   - For **Office365**: May need to enable "Less secure app access" or use app password
   - For **Custom SMTP**: Use your provider's SMTP settings
   - **SMTP_SECURE**: 
     - `false` for port 587 (TLS)
     - `true` for port 465 (SSL)

5. **Redeploy the Service**
   - After updating environment variables, Vercel should auto-redeploy
   - Or manually trigger: Go to Deployments → Redeploy

### Step 3: Test the Fix

After redeploying, test the email service:

```bash
# Test from backend
curl -X POST https://email-microservice-pi.vercel.app/api/welcome \
  -H "Content-Type: application/json" \
  -d '{
    "to": "your-email@gmail.com",
    "name": "Test User",
    "role": "service_provider",
    "apiSecret": "e37cf6365bf1daa23bbb4dfd359a978117857dfabb5410478ca0f8c58880cbf3"
  }'
```

Or register a new service provider and check if the email arrives.

## 📋 Common SMTP Providers

### Gmail
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password (16 characters)
SMTP_FROM=your-email@gmail.com
SMTP_SECURE=false
```

### Office365 / Outlook
```
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
SMTP_FROM=your-email@outlook.com
SMTP_SECURE=false
```

### Custom Domain (cPanel, etc.)
```
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=your-password
SMTP_FROM=noreply@yourdomain.com
SMTP_SECURE=false
```

## 🔍 Troubleshooting

### Still getting 535 error?
1. **Double-check credentials** - Username and password must be exact
2. **Check if app password is needed** - Gmail/Office365 require app passwords
3. **Verify SMTP host and port** - Contact your email provider
4. **Check firewall** - Some providers block SMTP from certain IPs
5. **Try different port** - Try 465 with `SMTP_SECURE=true`

### Getting connection timeout?
- Check if SMTP port is blocked
- Try alternative port (2525, 25, 465)
- Verify SMTP host is correct

### Getting "relay access denied"?
- Your SMTP server may require authentication from specific IPs
- Contact your email provider to whitelist Vercel IPs
- Or use a relay service that allows any IP

## ✅ Success Indicators

After fixing, you should see in Vercel logs:
- ✅ `200` status codes (not 500)
- ✅ `[Email Service] Email sent successfully` messages
- ✅ No more `535 Incorrect authentication data` errors

## 📝 Next Steps

Once SMTP is working:
1. Test registration flow end-to-end
2. Verify emails arrive in inbox (check spam folder too)
3. Test all email types (welcome, verification, OTP, etc.)
