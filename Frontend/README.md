## AILORA Frontend (Vite + React)

Development
- Install deps: `npm install`
- Start dev server: `npm run dev`
- The dev server proxies `/api` to the Flask backend at `http://localhost:5000` (see `vite.config.js`).

Environment
- Optionally create `.env` and set `VITE_API_BASE` if you deploy backend elsewhere.
  - Example: `VITE_API_BASE=https://your-backend.example.com/api`

Features
- Symptom input (text + voice via Web Speech API).
- Predictions with confidence, detailed analysis, remedies, and recommendations.
- User health profile management and prediction history.

Structure
- `src/pages/Home.jsx`: main diagnosis flow.
- `src/pages/Profile.jsx`: profile create/update.
- `src/pages/History.jsx`: past predictions.
- `src/api/client.js`: API client.
