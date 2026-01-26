# KonsoleH SMTP Configuration Guide

## 📋 Your `.env` File Should Contain:

```env
# SMTP Configuration for KonsoleH
SMTP_HOST=mail.spana.co.za
SMTP_PORT=587
SMTP_USER=no-reply@spana.co.za
SMTP_PASS=ProjectSpana@2028
SMTP_FROM=no-reply@spana.co.za
SMTP_SECURE=false

# API Security
API_SECRET=e37cf6365bf1daa23bbb4dfd359a978117857dfabb5410478ca0f8c58880cbf3

# Optional: Enable debug logging
SMTP_DEBUG=false

# Optional: Allow self-signed certificates (set to 'false' to allow)
SMTP_REJECT_UNAUTHORIZED=true
```

## 🔧 Configuration Details

### SMTP_HOST
- **Primary:** `mail.spana.co.za`
- **Alternatives to try:**
  - `smtp.spana.co.za`
  - `webmail.spana.co.za`
  - `webmailweb-jnb.konsoleh.co.za` (KonsoleH's webmail server)

### SMTP_PORT
- **Port 587 (STARTTLS)** - Recommended
  ```env
  SMTP_PORT=587
  SMTP_SECURE=false
  ```
- **Port 465 (SSL)** - Alternative
  ```env
  SMTP_PORT=465
  SMTP_SECURE=true
  ```

### SMTP_USER
- Use the **full email address**: `no-reply@spana.co.za`
- Some servers may require just the username: `no-reply` (try if full email doesn't work)

### SMTP_PASS
- **Must be EXACTLY:** `ProjectSpana@2028` (case-sensitive, mixed case)
- Check for:
  - ✅ No leading/trailing spaces
  - ✅ Correct case (passwords are case-sensitive)
  - ✅ Special characters are correct

## 🧪 Testing Your Configuration

### 1. Test SMTP Connection Locally

```bash
npm run test:smtp
```

This will:
- Verify SMTP connection
- Send a test email
- Show detailed error messages if it fails

### 2. Test via Email Service API

```bash
# Make sure the service is running
npm run dev

# In another terminal, test the welcome email
curl -X POST http://localhost:3000/api/welcome \
  -H "Content-Type: application/json" \
  -d '{
    "to": "your-email@gmail.com",
    "name": "Test User",
    "role": "service_provider",
    "apiSecret": "e37cf6365bf1daa23bbb4dfd359a978117857dfabb5410478ca0f8c58880cbf3"
  }'
```

## 🐛 Troubleshooting

### Error: `535 Incorrect authentication data`

**This means the SMTP server rejected your username/password.**

**Solutions:**
1. **Verify credentials:**
   - Double-check `SMTP_USER` and `SMTP_PASS` in `.env`
   - Try logging into webmail with the same credentials
   - Ensure password is exactly `ProjectSpana@2028` (mixed case)

2. **Try different username formats:**
   ```env
   # Option 1: Full email
   SMTP_USER=no-reply@spana.co.za
   
   # Option 2: Just username
   SMTP_USER=no-reply
   ```

3. **Try different ports:**
   ```env
   # Port 587 with STARTTLS
   SMTP_PORT=587
   SMTP_SECURE=false
   
   # OR Port 465 with SSL
   SMTP_PORT=465
   SMTP_SECURE=true
   ```

4. **Check 2FA:**
   - If 2FA is enabled, you may need an app-specific password
   - Or disable 2FA for SMTP access

5. **Contact KonsoleH Support:**
   - Account may be locked due to failed attempts
   - SMTP access may be disabled
   - May need to whitelist IP addresses (for Vercel deployment)

### Error: `ECONNREFUSED` or `ETIMEDOUT`

**Cannot connect to SMTP server.**

**Solutions:**
1. Verify `SMTP_HOST` is correct
2. Check if port is correct (587 or 465)
3. Check firewall/network restrictions
4. Try alternative SMTP hosts (see above)

### Error: `ESOCKET` or TLS errors

**Issue with encryption handshake.**

**Solutions:**
1. Try `SMTP_SECURE=false` with port 587
2. Try `SMTP_SECURE=true` with port 465
3. Set `SMTP_REJECT_UNAUTHORIZED=false` if using self-signed certificate

## 📞 Getting Help from KonsoleH

If you're still having issues, contact KonsoleH support with:

**Subject:** "SMTP Authentication Failing - Need SMTP Settings"

**Message:**
```
Hi,

I'm trying to configure SMTP for no-reply@spana.co.za but getting authentication errors.

Can you provide:
1. SMTP server address
2. SMTP port (587 or 465)
3. Whether to use SSL or STARTTLS
4. Confirm if SMTP access is enabled for this account
5. Check if the account is locked due to failed attempts

Current settings I'm trying:
- Host: mail.spana.co.za
- Port: 587
- Username: no-reply@spana.co.za
- Password: [my password]

Error: 535 Incorrect authentication data

Thank you!
```

## ✅ Quick Checklist

- [ ] `.env` file exists with all required variables
- [ ] `SMTP_PASS` is exactly `ProjectSpana@2028` (mixed case)
- [ ] `SMTP_USER` is `no-reply@spana.co.za` (or try `no-reply`)
- [ ] `SMTP_PORT` is `587` with `SMTP_SECURE=false` (or `465` with `SMTP_SECURE=true`)
- [ ] Tested with `npm run test:smtp`
- [ ] Checked KonsoleH webmail settings
- [ ] Contacted KonsoleH support if still failing

## 🚀 Deployment to Vercel

Once it works locally:

1. **Update Vercel Environment Variables:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add all variables from your `.env` file

2. **Redeploy:**
   - Push to GitHub (if connected)
   - Or manually redeploy from Vercel dashboard

3. **Test Production:**
   ```bash
   curl -X POST https://email-microservice-pi.vercel.app/api/welcome \
     -H "Content-Type: application/json" \
     -d '{
       "to": "your-email@gmail.com",
       "name": "Test User",
       "role": "service_provider",
       "apiSecret": "your-api-secret"
     }'
   ```
