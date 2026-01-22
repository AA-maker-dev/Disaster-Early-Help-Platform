# Hackathon Submission Packet – Sentinel AI

## Overview
Sentinel AI is an AI-assisted emergency intake and mapping tool. Users submit emergencies, receive a priority score, and see incidents plotted on a live Leaflet map. A Python geocoder (FastAPI + geopy) provides accurate coordinates; a deterministic fallback keeps the demo functional offline.

## What to demo
- Submit an emergency request.
- Show the AI priority card (urgency badge, score bar, status text).
- Click "View on Map" and show the newly added urgency-colored marker.
- Restart with/without the Python geocoder to demonstrate graceful fallback.

## Run instructions
1) Optional backend (recommended):
   ```bash
   cd d:\Hackathon\Hackathon#4\Disaster-Early-Help-Platform
   pip install fastapi uvicorn geopy
   python -m uvicorn geocoder_service:app --host 0.0.0.0 --port 8000 --app-dir .
   ```
2) Frontend:
   ```bash
   cd d:\Hackathon\Hackathon#4\Disaster-Early-Help-Platform
   python -m http.server 8001
   ```
3) Open http://localhost:8001 and submit an emergency.

## Tech stack
- Frontend: HTML, CSS, vanilla JS, Leaflet, CARTO Voyager tiles.
- Backend (optional): FastAPI, geopy (Nominatim), uvicorn.

## Files to include
- README.md (project + setup)
- HACKATHON_MAP_LINK.md (map/link flow and API contract)
- geocoder_service.py (backend geocoder)
- index.html, styles.css, script.js (frontend)

## Judging highlights
- Lives on a single page; zero build steps.
- Works offline for demos (pseudo-geocoder fallback).
- English map labels; urgency-colored markers; auto-fit bounds.
- Clear API contract and quickstart commands.

## Notes
- Respect Nominatim usage policy; current code rate-limits requests.
- For production, lock down CORS and add API keys/quotas for tile and geocode providers.
