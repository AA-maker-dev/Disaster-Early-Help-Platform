# Hackathon Submission Packet

## Overview
Emergency intake + live map. Form submissions drop urgency-colored markers on Leaflet with CARTO Voyager tiles (English labels). Optional FastAPI geocoder (geopy/Nominatim + RateLimiter) improves accuracy; a deterministic client fallback keeps the demo working offline.

## What to demo
- Submit an incident; show urgency badge/color on marker and incident counter.
- Start/stop the Python geocoder to show graceful fallback.
- Click markers to view submitted details.

## Run instructions
1) Optional backend (recommended):
   ```bash
   cd d:\Hackathon\Hackathon#4\Disaster-Early-Help-Platform
   python -m venv .venv && .venv\Scripts\activate
   pip install -r requirements.txt
   python -m uvicorn geocoder_service:app --host 0.0.0.0 --port 8000 --app-dir .
   ```
2) Frontend:
   ```bash
   cd d:\Hackathon\Hackathon#4\Disaster-Early-Help-Platform
   python -m http.server 8001
   ```
3) Open http://localhost:8001 and submit an incident.

## Tech stack
- Frontend: HTML, CSS, vanilla JS, Leaflet, CARTO Voyager tiles.
- Backend (optional): FastAPI, geopy (Nominatim), uvicorn; deterministic client fallback.

## Files to include
- README.md, QUICKSTART.md, PROJECT_SUMMARY.md, SETUP.md, READY_TO_RUN.md
- HACKATHON_MAP_LINK.md, INDEX.md, COMPLETION_REPORT.md, FIXES_APPLIED.md, RESOLUTION_REPORT.md, ISSUE_RESOLVED.md
- geocoder_service.py, requirements.txt
- index.html, styles.css, script.js

## Judging highlights
- Single-page, zero build steps; static hosting OK.
- Resilient: backend optional; fallback geocode keeps flow alive.
- English labels; urgency markers; auto-fit bounds; incident counter; inline status UI.
- Clear API contract and quickstart commands.

## Notes
- Respect Nominatim usage policy; requests are rate-limited.
- Lock down CORS and add auth/rate limits if exposed publicly; consider HTTPS in production.
