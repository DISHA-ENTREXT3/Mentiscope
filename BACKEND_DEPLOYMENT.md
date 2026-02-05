# Backend Deployment Guide

## 🚀 Quick Deploy to Render.com

### Option 1: Using render.yaml (Recommended)

1. **Push to GitHub** (already done ✅)

2. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

3. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `DISHA-ENTREXT3/Mentiscope`
   - Render will auto-detect `render.yaml`

4. **Configure Environment Variables**
   Add these in Render dashboard:

   ```
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=your-service-account-email
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   DODO_PAYMENTS_API_KEY=your-dodo-api-key
   OPENAI_API_KEY=sk-proj-...
   ALLOWED_ORIGINS=http://localhost:3000,https://mentiscope.vercel.app,https://your-vercel-url.vercel.app
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (~2-3 minutes)
   - Copy your backend URL (e.g., `https://mentiscope-backend.onrender.com`)

### Option 2: Manual Configuration

If render.yaml doesn't work:

1. **Build Command:**

   ```bash
   cd backend-node && npm install
   ```

2. **Start Command:**

   ```bash
   cd backend-node && npm start
   ```

3. **Environment:** Node
4. **Region:** Oregon (or closest to you)
5. **Plan:** Free

---

## 🔧 Update Frontend to Use Backend URL

After deploying the backend, update your frontend environment variables:

### In Vercel Dashboard:

Add this environment variable:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

Or if using a different variable name in your code, update accordingly.

---

## 🧪 Test Backend Deployment

After deployment, test these endpoints:

1. **Health Check:**

   ```bash
   curl https://your-backend-url.onrender.com/
   ```

   Should return: `{ "status": "ok", "message": "Mentiscope Neural Backend Online" }`

2. **CORS Test:**
   ```bash
   curl -H "Origin: https://mentiscope.vercel.app" \
        -H "Access-Control-Request-Method: POST" \
        -H "Access-Control-Request-Headers: Content-Type" \
        -X OPTIONS \
        https://your-backend-url.onrender.com/api/payments/checkout
   ```
   Should return CORS headers

---

## 🔐 Environment Variables Checklist

Make sure these are set in Render:

- [ ] `FIREBASE_PROJECT_ID`
- [ ] `FIREBASE_CLIENT_EMAIL`
- [ ] `FIREBASE_PRIVATE_KEY`
- [ ] `DODO_PAYMENTS_API_KEY`
- [ ] `DODO_PAYMENTS_ENDPOINT`
- [ ] `OPENAI_API_KEY`
- [ ] `ALLOWED_ORIGINS`
- [ ] `NODE_ENV=production`
- [ ] `PORT=5000`

---

## 🐛 Troubleshooting

### CORS Errors Persist

1. Check `ALLOWED_ORIGINS` includes your Vercel URL
2. Verify backend is running (check Render logs)
3. Ensure frontend is using correct backend URL

### Backend Not Starting

1. Check Render logs for errors
2. Verify all environment variables are set
3. Check `FIREBASE_PRIVATE_KEY` format (must include `\n`)

### 404 Errors

1. Verify API routes match between frontend and backend
2. Check backend logs for incoming requests
3. Ensure frontend `API_URL` is correct

---

## 📊 Monitor Deployment

**Render Dashboard:**

- View logs: Service → Logs tab
- Check metrics: Service → Metrics tab
- Restart service: Service → Manual Deploy → Deploy latest commit

**Free Tier Limits:**

- Spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- 750 hours/month free

---

## 🔄 Alternative: Deploy to Railway.app

If Render doesn't work:

1. Go to [railway.app](https://railway.app)
2. Connect GitHub repo
3. Select `backend-node` directory
4. Add environment variables
5. Deploy

---

## ✅ Deployment Checklist

- [ ] Backend deployed to Render/Railway
- [ ] All environment variables set
- [ ] Backend URL copied
- [ ] Frontend `NEXT_PUBLIC_API_URL` updated in Vercel
- [ ] Vercel redeployed with new env var
- [ ] CORS errors resolved
- [ ] Payment endpoints working
- [ ] AI analysis endpoints working

---

## 📝 Next Steps After Backend Deployment

1. Update `ALLOWED_ORIGINS` to include all Vercel preview URLs
2. Test all API endpoints
3. Monitor Render logs for errors
4. Set up custom domain (optional)
5. Upgrade to paid plan if needed (for always-on service)

---

**Need Help?**

- Render Docs: https://render.com/docs
- Railway Docs: https://docs.railway.app
- Check backend logs first for any errors

**Last Updated:** 2026-02-06
