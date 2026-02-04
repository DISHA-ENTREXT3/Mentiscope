# Deployment Configuration Guide

## Environment Variables Setup

### Frontend (Vercel)

Add these environment variables in your Vercel project settings:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-actual-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Backend API URL (REQUIRED - No localhost fallback)
NEXT_PUBLIC_API_URL=https://your-backend-api.railway.app/api/v1
```

### Backend (Railway/Render)

Add these environment variables in your backend deployment:

```env
# Frontend URL for CORS
FRONTEND_URL=https://mentiscope.vercel.app

# Database (if using PostgreSQL)
DATABASE_URL=postgresql://user:password@host:port/database

# OpenAI API Key (for AI analysis)
OPENAI_API_KEY=your-openai-api-key
```

---

## Local Development Setup

For local development, create a `.env.local` file in the `frontend` directory:

```env
# Firebase Configuration (same as production)
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Local Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

For backend local development, create a `.env` file in the `backend` directory:

```env
# Local Frontend URL for CORS
FRONTEND_URL=http://localhost:3000

# Local Database
DATABASE_URL=sqlite+aiosqlite:///./test.db

# OpenAI API Key
OPENAI_API_KEY=your-openai-api-key
```

---

## Deployment Checklist

### Frontend Deployment (Vercel)

- [ ] All Firebase environment variables added
- [ ] `NEXT_PUBLIC_API_URL` points to production backend
- [ ] Vercel domain added to Firebase authorized domains
- [ ] Build completes successfully
- [ ] Authentication works in production

### Backend Deployment (Railway/Render)

- [ ] `FRONTEND_URL` set to production frontend URL
- [ ] Database configured (PostgreSQL recommended)
- [ ] `OPENAI_API_KEY` configured
- [ ] Health check endpoint accessible
- [ ] CORS configured correctly

### Firebase Configuration

- [ ] Google authentication enabled
- [ ] Production domain added to authorized domains
- [ ] Firebase project in production mode

---

## Important Notes

⚠️ **No Localhost Fallbacks**: The application now requires explicit configuration of API URLs. This prevents accidental localhost usage in production.

⚠️ **Environment Variables Required**: The app will throw errors if required environment variables are missing, ensuring proper configuration.

✅ **Security**: All sensitive data (API keys, database URLs) must be configured via environment variables, never hardcoded.

---

## Testing Deployment

### Frontend

1. Visit your Vercel URL
2. Test sign-in with Google
3. Verify API calls work
4. Check browser console for errors

### Backend

1. Visit `https://your-backend-api.com/health`
2. Should return `{"status": "healthy"}`
3. Test API endpoints
4. Verify CORS allows frontend requests

---

## Troubleshooting

### "NEXT_PUBLIC_API_URL environment variable is not set"

→ Add the API URL to your Vercel environment variables and redeploy

### "CORS policy" errors

→ Ensure `FRONTEND_URL` in backend matches your Vercel domain exactly

### Firebase authentication not working

→ Verify your Vercel domain is in Firebase authorized domains

### API calls failing

→ Check that backend is deployed and accessible
→ Verify `NEXT_PUBLIC_API_URL` is correct

---

## Development vs Production

| Environment     | Frontend URL                  | Backend URL                  | Database   |
| --------------- | ----------------------------- | ---------------------------- | ---------- |
| **Development** | http://localhost:3000         | http://localhost:8000        | SQLite     |
| **Production**  | https://mentiscope.vercel.app | https://your-api.railway.app | PostgreSQL |

---

For more details, see:

- `FIREBASE_SETUP.md` - Firebase configuration
- `README.md` - Project overview
