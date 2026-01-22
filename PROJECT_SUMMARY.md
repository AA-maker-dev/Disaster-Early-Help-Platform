# Project Summary

- What: Emergency incident intake + live map. Form submissions drop geocoded markers with urgency coloring.
- Why: Fast triage during disasters with minimal setup.
- Frontend: Vanilla HTML/CSS/JS, Leaflet map, CARTO Voyager tiles (English labels), urgency markers, incident counter, inline status and live chip.
- Backend (optional): FastAPI geocoder using geopy/Nominatim with RateLimiter; CORS on; deterministic client fallback when offline.
- Files: index.html, styles.css, script.js, geocoder_service.py, requirements.txt, docs listed in INDEX.md.
- Run: `python -m http.server 8001` (frontend) + `python -m uvicorn geocoder_service:app --host 0.0.0.0 --port 8000 --app-dir .` (geocoder).
- Status: Ready for demo; resilience via dual geocode paths and UI feedback.
