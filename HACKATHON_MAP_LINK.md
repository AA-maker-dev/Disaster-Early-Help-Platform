# Hackathon Map Link & API

## Frontend link (local)
- http://localhost:8001

## Geocoder API (local)
- POST http://localhost:8000/geocode
- Body: `{ "location": "City, Country" }`
- Response: `{ "lat": number, "lng": number, "source": "backend" }`

## Notes
- Frontend auto-falls back to deterministic client geocode if backend offline.
- Uses CARTO Voyager tiles (English labels) and urgency-colored markers.
