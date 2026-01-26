# How to Get Gmail App Password

## Step-by-Step Instructions

### Step 1: Navigate to Security Settings
1. From the Google Account page (where you are now)
2. Click **"Security & sign-in"** in the left sidebar (blue lock icon)

### Step 2: Enable 2-Step Verification (if not already enabled)
1. In the Security page, look for **"2-Step Verification"**
2. If it says "Off", click it and follow the prompts to enable it
3. **Note:** App passwords require 2-Step Verification to be enabled

### Step 3: Generate App Password
1. Still in the Security page, scroll down to find **"App passwords"**
   - OR go directly to: https://myaccount.google.com/apppasswords
2. You may need to sign in again for security
3. Under "Select app", choose **"Mail"**
4. Under "Select device", choose **"Other (Custom name)"**
5. Type a name like: **"Spana Email Service"**
6. Click **"Generate"**

### Step 4: Copy the Password
1. Google will show you a **16-character password**
2. It looks like: `abcd efgh ijkl mnop` (with spaces) or `abcdefghijklmnop` (without spaces)
3. **Copy this password immediately** - you won't see it again!
4. Click **"Done"**

### Step 5: Use in .env File
Remove any spaces from the password and add to your `.env`:

```env
SMTP_USER=noreply.spana@gmail.com
SMTP_PASS=abcdefghijklmnop
```

**Important:** 
- Use the password WITHOUT spaces
- This is NOT your regular Gmail password
- It's a special app-specific password for applications

## Quick Link
Direct link to App Passwords:
👉 **https://myaccount.google.com/apppasswords**

## Troubleshooting

### "App passwords" option not showing?
- **2-Step Verification must be enabled first**
- Go to Security → 2-Step Verification → Turn it on
- Then App passwords will appear

### Can't find "App passwords"?
- Make sure you're signed in to the correct account
- Try the direct link: https://myaccount.google.com/apppasswords
- It's under Security → App passwords (scroll down)

### Password not working?
- Make sure you copied it correctly (no spaces)
- Generate a new one if needed
- Verify 2-Step Verification is still enabled
