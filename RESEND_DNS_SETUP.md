# Resend DNS Records Setup for spana.co.za

## 📋 DNS Records to Add in KonsoleH

You need to add these DNS records to your domain's DNS settings in KonsoleH.

### 1. Domain Verification (DKIM) - REQUIRED

**Type:** `TXT`  
**Name:** `resend._domainkey`  
**Content:** `p=MIGfMA@GCSqGSIb3DQEB...` (full value from Resend dashboard)  
**TTL:** `3600` (or Auto)

**Purpose:** Verifies domain ownership

---

### 2. Enable Sending - SPF Records - REQUIRED

#### Record 1: MX Record
**Type:** `MX`  
**Name:** `send`  
**Content:** `feedback-smtp.eu-west-1.amazonses.com` (full value from Resend)  
**Priority:** `10`  
**TTL:** `3600` (or Auto)

#### Record 2: SPF TXT Record
**Type:** `TXT`  
**Name:** `send`  
**Content:** `v=spf1 include:amazonses.com ~all` (full value from Resend)  
**TTL:** `3600` (or Auto)

**Purpose:** Enables sending emails from your domain

---

### 3. DMARC (Optional but Recommended)

**Type:** `TXT`  
**Name:** `_dmarc`  
**Content:** `v=DMARC1; p=none;`  
**TTL:** `3600` (or Auto)

**Purpose:** Email authentication policy

---

## 🔧 How to Add in KonsoleH

1. **Log into KonsoleH Control Panel**
2. **Go to DNS Management** (or "DNS Zone Editor" or "DNS Records")
3. **Select domain:** `spana.co.za`
4. **Add each record:**
   - Click "Add Record" or "+"
   - Select the Type (TXT, MX)
   - Enter the Name (exactly as shown above)
   - Enter the Content/Value (from Resend dashboard)
   - Set TTL to 3600 or Auto
   - Save

## ⚠️ Important Notes

- **Copy exact values** from Resend dashboard (they're unique to your account)
- **Name format:** 
  - For `resend._domainkey` → enter exactly as `resend._domainkey`
  - For `send` → enter exactly as `send`
  - For `_dmarc` → enter exactly as `_dmarc`
- **DNS Propagation:** Can take 5 minutes to 48 hours (usually 10-30 minutes)
- **Check Status:** Refresh Resend dashboard to see when records are detected

## ✅ After Adding Records

1. Wait 10-30 minutes for DNS propagation
2. Go back to Resend dashboard
3. Click "Restart" button (if available) to re-check DNS
4. Status should change from "Pending" to "Verified" ✅

## 🧪 Verify DNS Records

You can check if records are live using:

```bash
# Check DKIM record
nslookup -type=TXT resend._domainkey.spana.co.za

# Check SPF record
nslookup -type=TXT send.spana.co.za

# Check MX record
nslookup -type=MX send.spana.co.za

# Check DMARC record
nslookup -type=TXT _dmarc.spana.co.za
```

Or use online tools:
- https://mxtoolbox.com/
- https://dnschecker.org/

---

**Status:** Waiting for DNS records to propagate  
**Next Step:** Add records in KonsoleH, then wait for verification
