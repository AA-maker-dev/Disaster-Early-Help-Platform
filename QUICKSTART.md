# Quickstart (60s read)

## Frontend (static)
1) Open index.html in Live Server (VS Code) or `python -m http.server 8001` from repo root.
2) Go to http://localhost:8001 (or Live Server URL). Submit the form → marker drops on the map.

## Backend geocoder (optional, improves accuracy)
1) python -m venv .venv && .venv\Scripts\activate
2) pip install -r requirements.txt
3) python -m uvicorn geocoder_service:app --host 0.0.0.0 --port 8000 --app-dir .
4) Frontend auto-calls http://localhost:8000/geocode; falls back to client geocode if offline.

## Test
- Submit an incident with a city + country; see marker + urgency color.
- Toggle backend on/off to see graceful fallback.

## Deploy tips
- Any static host works for frontend.
- Keep backend protected if public; add a rate limit/proxy if exposed.
