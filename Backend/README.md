## AILORA Backend (Flask API)

Run (dev)
- Create and activate a virtual environment.
- Install: `pip install -r requirements.txt`
- Set environment variables in `.env`:
  - `API_KEY` (optional, for Gemini-based detailed analysis)
  - `GOOGLE_MAPS_API_KEY` (optional, for future hospitals search)
- Start: `python app.py` (serves at `http://localhost:5000`)

Endpoints
- `GET /api/health` — health check
- `POST /api/predict` — predict diseases by symptoms

Artifacts
- `latest_model.pkl`, `latest_vectorizer.pkl`, `new_latest_encoder.pkl` must be present in this directory.