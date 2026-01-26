# Resend Email Templates Guide

## 📧 Current Implementation

The email service currently sends HTML emails directly via Resend API. This works perfectly and doesn't require templates.

## 🎨 Template Structure

We have 3 main email types:

### 1. Welcome Email (`spana-welcome-service-provider`)
- **Subject:** `Welcome to SPANA, {{name}}! 🎉`
- **Purpose:** Welcome new service providers
- **Variables:** `name`, `completeProfileLink` (optional)

### 2. Verification Email (`spana-verification`)
- **Subject:** `Verify Your Email Address - SPANA`
- **Purpose:** Email verification for new accounts
- **Variables:** `name`, `verificationLink`

### 3. OTP Email (`spana-otp`)
- **Subject:** `Your SPANA Admin Portal Access Code 🔐`
- **Purpose:** Admin login OTP codes
- **Variables:** `name`, `otp`

## 🚀 Using Resend Templates (Optional)

Resend supports React Email templates for better management. To use templates:

### Option 1: Keep Current Implementation (Recommended)
- ✅ Works perfectly
- ✅ No additional setup needed
- ✅ Full control over HTML
- ✅ Easy to customize

### Option 2: Migrate to React Email Templates

If you want to use Resend's template system:

1. **Install React Email:**
   ```bash
   npm install react-email @react-email/components
   ```

2. **Create template files:**
   - `emails/welcome.tsx`
   - `emails/verification.tsx`
   - `emails/otp.tsx`

3. **Use Resend's template API:**
   ```typescript
   await resend.emails.send({
     from: 'onboarding@resend.dev',
     to: email,
     subject: 'Welcome',
     react: WelcomeEmail({ name, link })
   });
   ```

## 📋 Template Variables

All templates support these variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `name` | User's name | Yes |
| `verificationLink` | Email verification URL | For verification emails |
| `completeProfileLink` | Profile completion URL | For welcome emails (optional) |
| `otp` | One-time password code | For OTP emails |

## 🎯 Current Status

✅ **Emails are working** - Sending HTML directly via Resend  
✅ **No templates needed** - Current implementation is production-ready  
💡 **Templates optional** - Can be added later for better management  

## 📝 Template Documentation

Run the seed script to see template structures:

```bash
npm run seed:templates
```

This will display the template HTML structures and variable requirements.

---

**Note:** The current HTML email implementation works great and doesn't require Resend templates. Templates are optional and mainly useful for:
- Team collaboration
- Version control
- A/B testing
- Centralized management
