# Gmail SMTP Quick Start

## ✅ Changes Made

1. **Email service now prioritizes SMTP (Gmail) over Resend**
2. **Resend is now a fallback** (only used if SMTP fails)
3. **Health check updated** to show SMTP as primary provider

## 🚀 Setup Steps

### 1. Get Gmail App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Select **Mail** → **Other (Custom name)**
3. Name it: "Spana Email Service"
4. **Copy the 16-character password**

### 2. Update `.env` File

In `spana-email-service/.env`, add/update:

```env
# Gmail SMTP (Primary)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
SMTP_FROM=your-email@gmail.com

# API Secret
API_SECRET=e37cf6365bf1daa23bbb4dfd359a978117857dfabb5410478ca0f8c58880cbf3

# Optional: Comment out Resend to disable fallback
# RESEND_API_KEY=
```

### 3. Test Gmail SMTP

```bash
cd spana-email-service
npm run test:gmail
```

### 4. Restart Email Service

```bash
npm run dev
```

## 📧 How It Works Now

1. **Primary:** Tries Gmail SMTP first
2. **Fallback:** If SMTP fails, tries Resend (if configured)
3. **Error:** If both fail, returns error

## 🔍 Verify It's Working

Check health endpoint:
```bash
curl http://localhost:3000/api/health
```

You should see:
```json
{
  "providers": {
    "smtp": {
      "enabled": true,
      "status": "connected",
      "host": "smtp.gmail.com"
    },
    "resend": {
      "enabled": false
    }
  }
}
```

## ⚠️ Important Notes

- **Use app-specific password** (not your regular Gmail password)
- **2FA must be enabled** on your Google Account
- **Port 587** (STARTTLS) is recommended
- **Port 465** (SSL) is alternative if 587 is blocked

## 🐛 Troubleshooting

### "535 Incorrect authentication data"
→ Use app-specific password, not regular password

### "Connection timeout"
→ Try port 465 instead of 587

### "Connection refused"
→ Check firewall/ISP restrictions

See `GMAIL_SMTP_SETUP.md` for detailed troubleshooting.
