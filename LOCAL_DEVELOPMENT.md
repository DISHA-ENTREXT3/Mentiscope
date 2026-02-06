# Local Development Setup

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Firebase project created
- Git installed

## Step 1: Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/DISHA-ENTREXT3/Mentiscope.git
cd Mentiscope

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend-node
npm install
```

## Step 2: Environment Configuration

### Frontend (.env.local)
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Backend (.env)
Create `backend-node/.env`:
```env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_service_account_email
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_REFERER=http://localhost:3000
PORT=5000
NODE_ENV=development
```

## Step 3: Start Development Servers

### Terminal 1 - Backend
```bash
cd backend-node
npm start
# Server runs on http://localhost:5000
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

## Step 4: Access the App

Open http://localhost:3000 in your browser.

## Available Scripts

### Frontend
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # ESLint checks
npm test         # Run tests
```

### Backend
```bash
npm start        # Start server
npm test         # Run tests
npm run lint     # Check code
```

## Features to Test

1. **Authentication**
   - Sign up with email
   - Google OAuth login
   - Password reset

2. **Onboarding**
   - Multi-stage form
   - Data validation
   - Student profile creation

3. **Dashboard**
   - Student overview
   - Assessment history
   - AI analysis results

4. **Support Chat**
   - 6 ticket categories
   - Message submission
   - Email integration

5. **Blog**
   - Blog listing with filters
   - Individual post rendering
   - Proper text formatting

6. **Pricing**
   - 3 tier plans
   - Billing toggle (monthly/yearly)
   - Plan comparison

## API Endpoints to Test

```bash
# Health check
curl http://localhost:5000

# Create student
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "grade_level": "10",
    "parent_id": "test_parent",
    "school_type": "Public"
  }'

# Submit assessment
curl -X POST http://localhost:5000/api/assessments/submit \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "student_123",
    "data": {"test": "data"}
  }'

# Trigger AI analysis
curl -X POST http://localhost:5000/api/students/student_123/analyze \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_token" \
  -d '{
    "prompt": "Analyze this student learning pattern"
  }'
```

## Debugging

### Enable Debug Logging
```bash
# Frontend
export DEBUG=*
npm run dev

# Backend
export DEBUG=mentiscope:*
npm start
```

### Common Issues

**Firebase Connection Error**
- Check FIREBASE_PROJECT_ID is correct
- Verify private key is properly formatted
- Ensure Firestore database exists

**CORS Issues**
- Check ALLOWED_ORIGINS in backend .env
- Ensure frontend URL matches CORS config
- Test with curl to verify backend response

**OpenRouter API Not Working**
- Verify API key is valid
- Check you haven't exceeded free tier limits
- Test with curl directly to OpenRouter API

## Database Schema

### Students Collection
```javascript
{
  id: string,
  name: string,
  grade_level: string,
  parent_id: string,
  school_type: string,
  created_at: timestamp
}
```

### Assessments Collection
```javascript
{
  id: string,
  student_id: string,
  parent_id: string,
  type: string, // 'onboarding'
  data: object,
  ai_analysis: string,
  analysis_results: object,
  created_at: timestamp
}
```

### Support Requests Collection
```javascript
{
  id: string,
  product: string,
  category: string,
  message: string,
  user_email: string,
  created_at: timestamp
}
```

## Next Steps

1. Configure Firebase rules for production
2. Set up error tracking (Sentry)
3. Configure email service for notifications
4. Set up CI/CD with GitHub Actions
5. Deploy to Vercel and Render
