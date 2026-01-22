# Sentinel AI – Disaster Early-Help Platform

AI-assisted emergency intake with live map visualization. Submit a request, get an AI-prioritized score, and see it plotted on an interactive Leaflet map. Optional Python geocoder provides accurate coordinates; a deterministic fallback keeps the demo fully offline-friendly.

## Features
- Emergency form with AI-like priority scoring and status messaging.
- Live Leaflet map with urgency-colored markers; auto-bounds to show new incidents.
- Dual geocoding: FastAPI + geopy (preferred) with deterministic hash fallback.
- Mobile-friendly UI with CTA buttons, hero, features, and stats.

## Quickstart
1) **Install frontend deps:** none (vanilla HTML/CSS/JS).
2) **Install backend deps (optional, for real geocoding):**
   ```bash
   pip install fastapi uvicorn geopy
   ```
3) **Run geocoder API:**
   ```bash
   cd d:\Hackathon\Hackathon#4\Disaster-Early-Help-Platform
   python -m uvicorn geocoder_service:app --host 0.0.0.0 --port 8000 --app-dir .
   ```
4) **Serve frontend (any static server works):**
   ```bash
   cd d:\Hackathon\Hackathon#4\Disaster-Early-Help-Platform
   python -m http.server 8001
   ```
5) Open http://localhost:8001, submit an emergency, then click "View on Map" to see your marker.

## File map
- `index.html` – layout, sections, map container.
- `styles.css` – theming, marker styles, overlay card.
- `script.js` – form handling, priority calc, map init, geocode + fallback, marker creation.
- `geocoder_service.py` – FastAPI geocoder (geopy + Nominatim) with CORS enabled.
- `HACKATHON_MAP_LINK.md` – deeper notes on the map-link flow and API contract.

## API (geocoder)
- POST `/geocode` body: `{ "query": "Hattiban, Lalitpur" }`
- Response: `{ "lat": <float>, "lng": <float>, "formatted": "..." }`
- Errors: 400 empty query; 404 not found.

## Deployment notes
- Frontend is static and can be hosted on any static host.
- Backend is optional; if omitted, the pseudo-geocoder keeps markers working for demo scenarios.

## Credits / License
Built for hackathon demonstration. Uses Leaflet, CARTO Voyager tiles, geopy/Nominatim for geocoding. Replace or attribute tiles/providers as needed for production use.
