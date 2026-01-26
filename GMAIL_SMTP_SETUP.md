# Gmail SMTP Setup Guide

This guide will help you configure the email service to use Gmail SMTP.

## Gmail SMTP Configuration

### Step 1: Enable 2-Factor Authentication (Recommended)

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security**
3. Enable **2-Step Verification** (if not already enabled)

### Step 2: Generate App-Specific Password

1. Go to: https://myaccount.google.com/apppasswords
2. Select **Mail** as the app
3. Select **Other (Custom name)** as the device
4. Enter a name like "Spana Email Service"
5. Click **Generate**
6. **Copy the 16-character password** (you won't see it again!)

### Step 3: Configure Environment Variables

Add these to your `.env` file in `spana-email-service/`:

```env
# Gmail SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
SMTP_FROM=your-email@gmail.com

# Optional: Disable Resend (comment out or remove RESEND_API_KEY)
# RESEND_API_KEY=

# API Secret (for securing the email service)
API_SECRET=your-api-secret-here
```

### Gmail SMTP Settings Summary

- **Host:** `smtp.gmail.com`
- **Port:** `587` (TLS/STARTTLS) or `465` (SSL)
- **Secure:** `false` for port 587, `true` for port 465
- **Username:** Your full Gmail address (e.g., `your-email@gmail.com`)
- **Password:** App-specific password (16 characters, no spaces)

### Port Options

**Port 587 (Recommended - STARTTLS):**
```env
SMTP_PORT=587
SMTP_SECURE=false
```

**Port 465 (SSL):**
```env
SMTP_PORT=465
SMTP_SECURE=true
```

## Testing Gmail SMTP

Run the test script:

```bash
cd spana-email-service
npm run test:smtp
```

Or test directly:

```bash
node -r ts-node/register scripts/test-smtp-connection.ts
```

## Troubleshooting

### "Invalid login: 535 Incorrect authentication data"

**Causes:**
1. **2FA not enabled** - Gmail requires 2FA for app passwords
2. **Wrong password** - Using regular password instead of app-specific password
3. **App password not generated** - Need to generate a new app-specific password

**Solution:**
1. Enable 2FA on your Google Account
2. Generate a new app-specific password
3. Use the 16-character app password (not your regular Gmail password)

### "Connection timeout"

**Causes:**
1. Firewall blocking port 587/465
2. Network restrictions
3. Gmail blocking the connection

**Solution:**
1. Try port 465 (SSL) instead of 587
2. Check firewall settings
3. Allow "Less secure app access" (not recommended, use app passwords instead)

### "Connection refused"

**Causes:**
1. Wrong SMTP host
2. Port blocked by ISP/hosting provider

**Solution:**
1. Verify `SMTP_HOST=smtp.gmail.com`
2. Try both ports (587 and 465)
3. Check if your hosting provider allows SMTP connections

## Security Notes

- ✅ **Use app-specific passwords** - More secure than regular passwords
- ✅ **Enable 2FA** - Required for app-specific passwords
- ✅ **Keep API_SECRET secure** - Don't commit to git
- ❌ **Don't use regular Gmail password** - Will fail with 2FA enabled
- ❌ **Don't disable 2FA** - Less secure

## Example .env File

```env
# Gmail SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=spana.service@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
SMTP_FROM=spana.service@gmail.com

# API Security
API_SECRET=e37cf6365bf1daa23bbb4dfd359a978117857dfabb5410478ca0f8c58880cbf3

# Disable Resend (optional)
# RESEND_API_KEY=
```

## Next Steps

1. Update `.env` with your Gmail credentials
2. Test SMTP connection: `npm run test:smtp`
3. Restart email service: `npm run dev`
4. Test sending an email via the API
