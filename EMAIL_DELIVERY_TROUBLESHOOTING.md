# Email Delivery Troubleshooting Guide

## ✅ Emails Are Being Sent Successfully

The email service is working and sending emails via Resend. If you're not receiving them, check the following:

## 🔍 Step-by-Step Troubleshooting

### 1. Check Resend Dashboard

Go to: **https://resend.com/emails**

Look for:
- Emails to your address (`eksnxiweni@gmail.com`)
- Delivery status:
  - ✅ **Delivered** - Email reached inbox (check spam if not visible)
  - ⏳ **Sent** - Email sent but not yet delivered
  - ❌ **Bounced** - Email rejected by recipient server
  - ⚠️ **Spam** - Marked as spam by recipient

### 2. Check Gmail Spam/Junk Folder

**Why:** Gmail filters emails from new sender domains like `onboarding@resend.dev`

**How to check:**
1. Open Gmail
2. Click "Spam" in left sidebar
3. Look for emails from `onboarding@resend.dev`
4. If found, mark as "Not Spam" to train Gmail

### 3. Search Gmail

**Search queries:**
- `from:onboarding@resend.dev`
- `spana`
- `welcome`
- `subject:"Welcome to SPANA"`

### 4. Check Email Delivery Delay

**Gmail may delay emails from:**
- New sender domains
- Domains not verified with SPF/DKIM
- High-volume senders

**Wait time:** 5-10 minutes, sometimes up to 24 hours

### 5. Check Resend Email Logs

In Resend dashboard, click on an email to see:
- **Status:** Sent, Delivered, Bounced, etc.
- **Events:** Open, click, bounce, spam reports
- **Error messages:** If delivery failed

## 🎯 Common Issues & Solutions

### Issue: Emails in Spam Folder

**Solution:**
1. Mark as "Not Spam" in Gmail
2. Add `onboarding@resend.dev` to contacts
3. For production: Verify `spana.co.za` domain in Resend

### Issue: Emails Not Arriving

**Check:**
1. Resend dashboard - is email marked as "Delivered"?
2. Gmail spam folder
3. Wait 10-15 minutes (delivery delay)
4. Check Resend logs for bounce/spam reports

### Issue: "Bounced" Status in Resend

**Possible causes:**
- Invalid email address
- Recipient server blocking
- Email address doesn't exist

**Solution:**
- Verify email address is correct
- Check if email account exists
- Try a different email address

### Issue: "Spam" Status in Resend

**Possible causes:**
- Content flagged as spam
- Sender reputation
- Domain not verified

**Solution:**
- Verify domain in Resend (add DNS records)
- Use verified domain instead of `onboarding@resend.dev`

## 📊 Check Email Status

### Via Resend Dashboard

1. Go to https://resend.com/emails
2. Find email by:
   - Recipient email
   - Subject line
   - Timestamp
3. Click email to see:
   - Delivery status
   - Events timeline
   - Error messages (if any)

### Via Email Service Logs

Check email service console for:
```
[Email Service] ✅ Email sent successfully via Resend
[Email Service] 📧 Resend Email ID: <id>
[Email Service] 🔗 Check delivery: https://resend.com/emails/<id>
```

## 🚀 For Production

To avoid spam filtering:

1. **Verify Domain in Resend:**
   - Add `spana.co.za` to Resend
   - Add DNS records (SPF, DKIM, DMARC)
   - Wait for verification

2. **Update RESEND_FROM:**
   ```env
   RESEND_FROM=no-reply@spana.co.za
   ```

3. **Warm Up Domain:**
   - Start with low volume
   - Gradually increase
   - Monitor delivery rates

## 📞 Still Not Working?

1. **Check Resend Dashboard** - See actual delivery status
2. **Check Spam Folder** - Most common issue
3. **Wait 10-15 minutes** - Delivery delays
4. **Try Different Email** - Test with another address
5. **Check Email Service Logs** - Look for errors

---

**Last Updated:** January 23, 2026
