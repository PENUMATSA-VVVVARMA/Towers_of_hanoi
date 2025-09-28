# Render Deployment Configuration Guide

## Frontend (Static Site) Configuration

Your frontend is already deployed at: `https://towers-of-hanoi-staticsite.onrender.com`

## Backend (Web Service) Configuration

To fix the "route not found" error, you need to:

### 1. Find Your Backend Service URL
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your backend service
3. Copy the service URL (e.g., `https://your-service-name.onrender.com`)

### 2. Update Environment Variable
In your **Frontend Service** on Render:
1. Go to your frontend service settings
2. Find "Environment Variables" section
3. Add or update: `REACT_APP_API_URL = https://your-backend-service-url.onrender.com/api`

### 3. Common Backend Service URL Patterns
- `https://towers-of-hanoi-api.onrender.com/api`
- `https://towers-hanoi-server.onrender.com/api` 
- `https://hanoi-backend.onrender.com/api`

### 4. Test Your Backend
Open your backend URL in browser: `https://your-backend-url.onrender.com/api/health`
- Should return: `{"status":"OK",...}`
- If not working, your backend service needs to be deployed

### 5. Redeploy Frontend
After updating the environment variable, trigger a redeploy of your frontend service.

## Troubleshooting

### "Route not found" error:
- ❌ Wrong API URL in environment variable
- ❌ Backend service not deployed
- ❌ Backend service sleeping (free tier)

### Backend service sleeping (Free tier limitation):
- Render free services sleep after 15 minutes of inactivity
- First request may take 30-60 seconds to wake up
- Consider upgrading to paid plan for production use

## Quick Fix Commands

If you're unsure of your backend URL, update `.env.production`:

```bash
# Replace with your actual backend URL
REACT_APP_API_URL=https://YOUR-ACTUAL-BACKEND-URL.onrender.com/api
```