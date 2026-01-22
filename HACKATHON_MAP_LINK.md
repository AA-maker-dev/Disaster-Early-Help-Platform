# Sentinel AI – Emergency Map Linkage (Hackathon Notes)

## What changed

- Live Leaflet map auto-drops markers for every emergency request.
- Primary geocoder: FastAPI service (`geocoder_service.py`) using geopy + Nominatim (English labels).
- Fallback: deterministic pseudo-geocoder in `script.js` (offline/demo-safe) so locations always plot.
- Markers are urgency-colored; popups show location, urgency, and a message snippet with the computed priority.

## How it works (flow)

1) User submits the emergency form.
2) Frontend computes priority and renders the AI analysis card.
3) Frontend calls the Python geocoder (`/geocode`); if it fails, it falls back to the pseudo-geocoder.
4) A Leaflet marker is added; bounds auto-fit so the newest incident is visible. "View on Map" recenters if needed.

## Files

- `index.html` – map container + assets.
- `styles.css` – marker dot styling and overlay card.
- `script.js` – form handler, priority calc, map init, geocode (API + fallback), marker creation.
- `geocoder_service.py` – FastAPI geocoder microservice.

## Running the geocoder API (local)

1) Install deps (in a venv): `pip install fastapi uvicorn geopy`.
2) Start service: `uvicorn geocoder_service:app --host 0.0.0.0 --port 8000`.
3) Frontend expects `http://localhost:8000/geocode` and will auto-fallback if unreachable.

### API contract

- POST `/geocode` body: `{ "query": "Hattiban, Lalitpur" }`
- Response: `{ "lat": <float>, "lng": <float>, "formatted": "Hattiban, Lalitpur, Bagmati, Nepal" }`
- Errors: 400 for empty query, 404 if not found.

## Demo steps

1) Open the page, submit an emergency (fill location/disaster/urgency/message).
2) After the card renders, click "View on Map" to jump to the marker.
3) Run the Python geocoder for real coordinates; stop it to see the deterministic fallback.

## Notes

- Base layer uses CARTO Voyager for English map labels.
- Seed incidents remain for context; user submissions append to the map.
