# 🔍 How to Find Your Render Backend URL

## Step 1: Check Render Dashboard
1. Go to https://dashboard.render.com
2. Look for your backend service (might be named like):
   - towers-of-hanoi-backend
   - towers-hanoi-server  
   - hanoi-api
   - Or similar name

## Step 2: Get Service URL
1. Click on your backend service
2. Copy the service URL (should look like):
   - https://your-service-name-xxxx.onrender.com
   
## Step 3: Test Backend
Open this URL in browser: https://your-service-name-xxxx.onrender.com/api/health
- Should return JSON like: {"status":"OK","timestamp":"..."}

## Step 4: Update Frontend
In your Render FRONTEND service:
1. Go to Environment Variables
2. Set: REACT_APP_API_URL = https://your-service-name-xxxx.onrender.com/api
3. Deploy/restart frontend

## Step 5: Test Mobile
Your mobile app should now work with the deployed backend!

---

## Alternative: Local Network Access (Temporary Testing)

If you want to test with your laptop backend:

1. Update .env to: REACT_APP_API_URL=http://10.242.58.71:5000/api
2. Make sure your laptop firewall allows port 5000
3. Make sure your mobile is on same WiFi as laptop
4. Deploy frontend to Render with this change

**Note:** This only works when your laptop is running and on same network.