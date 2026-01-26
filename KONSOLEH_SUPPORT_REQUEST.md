# KonsoleH Support Request - SMTP Authentication Issue

## 🔴 Issue Summary

**Email:** `no-reply@spana.co.za`  
**Domain:** `spana.co.za`  
**Error:** `535 Incorrect authentication data`  
**Status:** SMTP authentication failing for all configurations

## ✅ What's Working

- ✅ SMTP server is reachable (`mail.spana.co.za`)
- ✅ Connection established successfully
- ✅ STARTTLS encryption working
- ✅ Server supports AUTH LOGIN and AUTH PLAIN

## ❌ What's Not Working

- ❌ Authentication rejected for ALL combinations:
  - Port 587 with full email (`no-reply@spana.co.za`)
  - Port 587 with username only (`no-reply`)
  - Port 465 with SSL
  - Both PLAIN and LOGIN authentication methods

## 🔍 Technical Details

**SMTP Server:** `mail.spana.co.za` (resolves to `129.232.251.110`)  
**Server Software:** `XNEELO_MTA 1.10`  
**Supported Auth Methods:** LOGIN, PLAIN  
**Connection:** Successful (connects and upgrades to STARTTLS)  
**Authentication:** Fails with `535 Incorrect authentication data`

## 📋 Tested Configurations

All of these failed with the same error:

1. ✅ Port 587, STARTTLS, Full Email, PLAIN auth
2. ✅ Port 587, STARTTLS, Username Only, PLAIN auth
3. ✅ Port 587, STARTTLS, Full Email, LOGIN auth
4. ✅ Port 587, STARTTLS, Username Only, LOGIN auth
5. ✅ Port 465, SSL, Full Email, PLAIN auth
6. ✅ Port 465, SSL, Username Only, PLAIN auth

## 🕐 Timeline

- **Yesterday:** SMTP was working correctly
- **Today:** Started getting `535 Incorrect authentication data` errors
- **No changes made:** No password changes, no configuration changes on our side

## ❓ Questions for KonsoleH Support

1. **Is the account locked?**
   - Have there been too many failed SMTP authentication attempts?
   - If locked, can you unlock it?

2. **Is SMTP access enabled?**
   - Is SMTP access enabled for `no-reply@spana.co.za`?
   - Are there any IP restrictions blocking SMTP access?

3. **Password verification:**
   - Can you confirm the password for `no-reply@spana.co.za` is correct?
   - Has the password been changed on your side?

4. **SMTP settings:**
   - What is the correct SMTP server address?
   - What port should we use (587 or 465)?
   - Should we use full email or username only for authentication?
   - Which authentication method is preferred (PLAIN or LOGIN)?

5. **Account status:**
   - Is the email account active?
   - Are there any security restrictions or alerts?

## 📧 Email Template for KonsoleH Support

**Subject:** `SMTP Authentication Failing - no-reply@spana.co.za`

**Message:**
```
Hi KonsoleH Support,

I'm experiencing SMTP authentication issues with no-reply@spana.co.za.

Issue:
- SMTP authentication is failing with "535 Incorrect authentication data"
- This started today (January 22, 2026)
- It was working correctly yesterday
- No changes were made on our side

Technical Details:
- SMTP Server: mail.spana.co.za (129.232.251.110)
- Ports tested: 587 (STARTTLS) and 465 (SSL)
- Auth methods tested: PLAIN and LOGIN
- Username formats tested: no-reply@spana.co.za and no-reply
- Connection: Successful (connects and upgrades to STARTTLS)
- Authentication: Fails with 535 error

What I need:
1. Check if the account is locked due to failed attempts
2. Verify SMTP access is enabled for this account
3. Confirm the correct SMTP settings (server, port, username format)
4. Check if there are any IP restrictions

Can you please:
- Unlock the account if it's locked
- Verify SMTP access is enabled
- Provide the correct SMTP configuration

Thank you!
```

## 🔧 What to Check in KonsoleH Control Panel

1. **Email Account Settings:**
   - Log into KonsoleH control panel
   - Navigate to Email Accounts
   - Check `no-reply@spana.co.za` account status
   - Look for "SMTP Access" or "Mail Client Access" settings

2. **Security Settings:**
   - Check for account lock/unlock options
   - Look for failed login attempt logs
   - Check for IP restrictions or whitelisting

3. **SMTP Settings:**
   - Look for "Mail Client Configuration" or "SMTP Settings"
   - Note the exact server address and port
   - Check if there are specific username format requirements

## 📞 Contact Information

**KonsoleH Support:**
- Website: https://www.konsoleh.co.za
- Support Email: [Check KonsoleH website for support email]
- Support Phone: [Check KonsoleH website for support phone]

## 🎯 Next Steps

1. **Contact KonsoleH Support** using the email template above
2. **Check KonsoleH Control Panel** for account status
3. **Wait for KonsoleH response** with account unlock/SMTP settings
4. **Update .env file** with correct settings once received
5. **Test again** using `npm run test:smtp`

---

**Last Updated:** January 22, 2026  
**Status:** Waiting for KonsoleH support response
