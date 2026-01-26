# 🚀 Quick Start: Resend Setup (5 Minutes)

## Step 1: Get Resend API Key

1. Go to **https://resend.com** and sign up (free)
2. Go to **API Keys** → **Create API Key**
3. Copy the key (starts with `re_...`)

## Step 2: Add to .env

Add this line to `spana-email-service/.env`:

```env
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM=no-reply@spana.co.za
```

**For testing**, you can use Resend's test domain:
```env
RESEND_FROM=onboarding@resend.dev
```

## Step 3: Test It

```bash
cd spana-email-service
npm run test:resend
```

## Step 4: Done! ✅

That's it! The email service will now:
- ✅ Use Resend automatically (if API key is set)
- ✅ Fall back to SMTP if Resend fails
- ✅ Work immediately - no code changes needed

## 📧 Verify Domain (Optional - for production)

To send from `no-reply@spana.co.za`:

1. Go to Resend dashboard → **Domains**
2. Click **Add Domain** → Enter `spana.co.za`
3. Add the DNS records Resend provides
4. Wait 5-10 minutes for verification

Until verified, use `onboarding@resend.dev` for testing.

---

**Need help?** See `RESEND_SETUP.md` for detailed instructions.
