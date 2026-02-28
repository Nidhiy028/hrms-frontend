# HRMS Lite – Frontend

React-based admin dashboard for HRMS Lite.

## Tech Stack
- React 18 + React Router v6
- react-hot-toast (notifications)
- date-fns (date formatting)
- Custom CSS design system (no UI framework)

## Project Structure

```
src/
├── api/         # All backend API calls
├── components/  # Sidebar, Modal, AddEmployeeModal, MarkAttendanceModal, ConfirmDialog
├── hooks/       # useFetch custom hook
└── pages/       # Dashboard, Employees, Attendance
```

## Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Set backend URL in .env
echo "REACT_APP_API_URL=http://localhost:8000" > .env

# 3. Start dev server
npm start
# App runs at http://localhost:3000
```

Make sure the backend is running at `http://localhost:8000`.

---

## Deploy on Vercel (Recommended)

### Step 1 – Push to GitHub
```bash
cd hrms-frontend
git init
git add .
git commit -m "initial frontend"
git remote add origin https://github.com/YOUR_NAME/hrms-frontend.git
git push -u origin main
```

### Step 2 – Import to Vercel
1. Go to https://vercel.com → **New Project**
2. Import your `hrms-frontend` GitHub repo
3. Framework Preset: **Create React App**
4. Click **Environment Variables** and add:
   ```
   REACT_APP_API_URL = https://YOUR-RENDER-BACKEND-URL.onrender.com
   ```
5. Click **Deploy**

Vercel gives you a URL like: `https://hrms-lite.vercel.app`

### Step 3 – Update Backend CORS (if needed)
Your FastAPI backend already allows all origins (`allow_origins=["*"]`), so no changes are needed.

---

## Deploy on Netlify (Alternative)

```bash
# Build the app
npm run build

# Then drag-and-drop the /build folder to https://app.netlify.com/drop
# Or use Netlify CLI:
npx netlify-cli deploy --prod --dir=build
```

Add env var `REACT_APP_API_URL` in Netlify → Site Settings → Environment Variables before building.

---

## Features

| Page        | Features                                                      |
|-------------|---------------------------------------------------------------|
| Dashboard   | Stats cards, present/absent today, department bar chart       |
| Employees   | Add, search, filter by dept, delete, quick-mark attendance    |
| Attendance  | Mark/update, filter by employee+date, delete, per-employee summary |
