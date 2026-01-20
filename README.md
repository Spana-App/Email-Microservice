# SPANA Email Microservice

Email microservice for SPANA - handles all email operations (OTP, verifications, registrations, etc.)

## 🚀 Deployment

This service is designed to run on Vercel as serverless functions.

### Prerequisites

- Vercel account
- SMTP credentials (host, user, password)
- API secret for securing the service

### Setup on Vercel

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Link your project**:
   ```bash
   cd spana-email-service
   vercel link
   ```

3. **Set Environment Variables** on Vercel Dashboard:
   - `SMTP_HOST` - Your SMTP host (e.g., `mail.spana.co.za`)
   - `SMTP_PORT` - SMTP port (usually `587`)
   - `SMTP_USER` - SMTP username (e.g., `noreply@spana.co.za`)
   - `SMTP_PASS` - SMTP password
   - `SMTP_FROM` - Default from email (e.g., `noreply@spana.co.za`)
   - `SMTP_SECURE` - Use secure connection (true/false, default: false for port 587)
   - `API_SECRET` - Secret key to secure API calls (generate a random string)

4. **Deploy**:
   ```bash
   vercel --prod
   ```

## 📡 API Endpoints

### Health Check
- **GET** `/api/health` - Check service health

### Send Generic Email
- **POST** `/api/send`
  ```json
  {
    "to": "user@example.com",
    "subject": "Email Subject",
    "text": "Plain text content",
    "html": "<h1>HTML content</h1>",
    "type": "generic",
    "apiSecret": "your-api-secret"
  }
  ```

### Send OTP Email
- **POST** `/api/otp`
  ```json
  {
    "to": "admin@spana.co.za",
    "name": "Admin Name",
    "otp": "123456",
    "apiSecret": "your-api-secret"
  }
  ```

### Send Verification Email
- **POST** `/api/verification`
  ```json
  {
    "to": "user@example.com",
    "name": "User Name",
    "verificationLink": "https://spana.co.za/verify?token=abc123",
    "apiSecret": "your-api-secret"
  }
  ```

### Send Welcome Email
- **POST** `/api/welcome`
  ```json
  {
    "to": "user@example.com",
    "name": "User Name",
    "role": "customer|service_provider|admin",
    "apiSecret": "your-api-secret"
  }
  ```

## 🔒 Security

All endpoints (except health check) require an `API_SECRET` in the request body or as `x-api-secret` header to prevent unauthorized access.

## 🔗 Integration with Main Backend

The main backend on Render will proxy email requests to this Vercel service:

```typescript
// Example usage in main backend
const response = await axios.post('https://your-email-service.vercel.app/api/otp', {
  to: 'admin@spana.co.za',
  name: 'Admin Name',
  otp: '123456',
  apiSecret: process.env.EMAIL_SERVICE_SECRET
});
```

## 📝 Environment Variables

Set these in Vercel Dashboard under Settings > Environment Variables:

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `SMTP_HOST` | Yes | SMTP server host | `mail.spana.co.za` |
| `SMTP_PORT` | Yes | SMTP server port | `587` |
| `SMTP_USER` | Yes | SMTP username | `noreply@spana.co.za` |
| `SMTP_PASS` | Yes | SMTP password | `your-password` |
| `SMTP_FROM` | Yes | Default from address | `noreply@spana.co.za` |
| `SMTP_SECURE` | No | Use secure connection | `false` (for port 587) |
| `API_SECRET` | Yes | API authentication secret | `random-secret-string` |

## 🧪 Testing Locally

```bash
npm run dev
```

This will start Vercel dev server on `http://localhost:3000`

## 📦 Benefits

- ✅ Avoids Render's SMTP port blocking (Vercel allows SMTP)
- ✅ Separation of concerns (email logic isolated)
- ✅ Scalable (serverless functions)
- ✅ Easy to maintain and update
- ✅ Centralized email templates and logic
