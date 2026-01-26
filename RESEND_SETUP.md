# Resend Email Setup Guide

## 🚀 Quick Setup (5 minutes)

Resend is a modern email API service that's reliable, fast, and doesn't require SMTP configuration.

### Step 1: Sign Up for Resend

1. Go to **https://resend.com**
2. Sign up for a free account (no credit card required)
3. Verify your email address

### Step 2: Get Your API Key

1. Log into Resend dashboard
2. Go to **API Keys** section
3. Click **Create API Key**
4. Give it a name (e.g., "Spana Production")
5. Copy the API key (starts with `re_...`)
   - ⚠️ **Save it now** - you won't see it again!

### Step 3: Add Domain (Optional but Recommended)

For production, you should verify your domain:

1. Go to **Domains** in Resend dashboard
2. Click **Add Domain**
3. Enter `spana.co.za`
4. Add the DNS records Resend provides:
   - **SPF record** (TXT)
   - **DKIM records** (CNAME)
   - **DMARC record** (TXT) - optional but recommended
5. Wait for verification (usually 5-10 minutes)

**Note:** Until your domain is verified, you can use Resend's test domain:
- `onboarding@resend.dev` (for testing only)

### Step 4: Configure Environment Variables

Add to your `.env` file in `spana-email-service`:

```env
# Resend Configuration (Primary)
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM=no-reply@spana.co.za

# SMTP Configuration (Fallback - optional)
# Keep these if you want SMTP as backup
SMTP_HOST=mail.spana.co.za
SMTP_PORT=587
SMTP_USER=no-reply@spana.co.za
SMTP_PASS=your_password
SMTP_FROM=no-reply@spana.co.za
```

### Step 5: Test It

Run the test script:

```bash
npm run test:resend
```

Or test via the API:

```bash
curl -X POST http://localhost:3000/api/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "your-email@gmail.com",
    "subject": "Test from Resend",
    "html": "<h1>Hello from Resend!</h1>",
    "apiSecret": "your-api-secret"
  }'
```

## ✅ How It Works

1. **Resend is primary**: If `RESEND_API_KEY` is set, emails go through Resend API
2. **SMTP is fallback**: If Resend fails, it automatically falls back to SMTP
3. **No code changes needed**: The email service automatically detects and uses Resend

## 📊 Resend Pricing

- **Free Tier**: 3,000 emails/month, 100 emails/day
- **Pro Tier**: $20/month for 50,000 emails
- **No credit card required** for free tier

## 🔒 Security

- API keys are stored in environment variables (never commit to git)
- Resend uses HTTPS for all API calls
- Domain verification ensures emails come from your domain

## 🐛 Troubleshooting

### "Invalid API key"
- Check that `RESEND_API_KEY` starts with `re_`
- Make sure there are no extra spaces in the `.env` file
- Restart the service after changing `.env`

### "Domain not verified"
- If using `spana.co.za`, make sure DNS records are added
- For testing, use `onboarding@resend.dev` as sender

### "Rate limit exceeded"
- Free tier: 100 emails/day
- Check your Resend dashboard for usage
- Upgrade to Pro for higher limits

## 📚 Resources

- **Resend Docs**: https://resend.com/docs
- **API Reference**: https://resend.com/docs/api-reference
- **Dashboard**: https://resend.com/emails

## 🎯 Next Steps

1. ✅ Set up Resend account
2. ✅ Add API key to `.env`
3. ✅ Test email sending
4. ✅ Verify domain (for production)
5. ✅ Update Vercel environment variables (if deployed)

---

**Status**: Ready to use! 🚀
