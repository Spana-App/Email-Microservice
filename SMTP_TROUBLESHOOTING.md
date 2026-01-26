# SMTP Authentication Troubleshooting

## Current Error
```
535 Incorrect authentication data
```

This error means the SMTP server (`mail.spana.co.za`) is rejecting the username/password combination.

## Step-by-Step Fix

### 1. Verify Service Was Redeployed
- Go to Vercel Dashboard → Your Project → Deployments
- Check if there's a recent deployment after you updated environment variables
- If not, manually trigger a redeploy:
  - Click "..." menu on latest deployment
  - Select "Redeploy"
  - Wait for deployment to complete (1-2 minutes)

### 2. Double-Check Credentials
In Vercel Dashboard → Settings → Environment Variables, verify:

**SMTP_USER:**
- Current: `no-reply@spana.co.za`
- Try alternatives:
  - `noreply@spana.co.za` (no hyphen)
  - `no-reply` (just username, no domain)
  - Full email address format

**SMTP_PASS:**
- Current: `ProjectSpana@2028`
- Check for:
  - ✅ No leading/trailing spaces
  - ✅ Correct case (passwords are case-sensitive)
  - ✅ Special characters are correct
  - ✅ No hidden characters

**SMTP_HOST:**
- Current: `mail.spana.co.za`
- Verify this is the correct SMTP server for your domain

**SMTP_PORT:**
- Current: `587`
- Alternative: Try `465` with `SMTP_SECURE=true`

### 3. Test Different Configurations

#### Option A: Port 465 with SSL
```
SMTP_PORT=465
SMTP_SECURE=true
```

#### Option B: Port 587 with STARTTLS
```
SMTP_PORT=587
SMTP_SECURE=false
```

#### Option C: Try Port 25 (if allowed)
```
SMTP_PORT=25
SMTP_SECURE=false
```

### 4. Contact Your Email Provider
If you manage `mail.spana.co.za`, check:
- Is SMTP enabled for `no-reply@spana.co.za`?
- Are there IP restrictions? (Vercel IPs need to be whitelisted)
- Does the account require app-specific passwords?
- Is there a firewall blocking SMTP connections?

### 5. Test with Alternative Email Provider
To verify the email service code works, temporarily test with Gmail:

**Gmail Configuration:**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password (16 chars from Google)
SMTP_FROM=your-email@gmail.com
SMTP_SECURE=false
```

**To get Gmail App Password:**
1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Go to App Passwords
4. Generate password for "Mail"
5. Use the 16-character password

### 6. Check Vercel Logs
1. Go to Vercel Dashboard → Your Project → Logs
2. Filter for recent `POST /api/welcome` requests
3. Look for the exact error message
4. Check if it's:
   - `535 Incorrect authentication data` → Wrong credentials
   - `Connection timeout` → Network/firewall issue
   - `Relay access denied` → IP not whitelisted

## Quick Test Commands

After updating credentials and redeploying:

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

## Success Indicators

When working, you'll see in Vercel logs:
- ✅ `200` status code
- ✅ `[Email Service] Email sent successfully` message
- ✅ No `535` errors

## Next Steps

1. **Redeploy** the Vercel service after any credential changes
2. **Check logs** for the exact error
3. **Verify credentials** with your email provider
4. **Test with Gmail** to confirm the service code works
5. **Contact support** for `mail.spana.co.za` if needed
