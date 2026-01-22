# Contributing

## Setup
1) Clone repo
2) (Optional) Create venv and install backend deps: `pip install -r requirements.txt`
3) Run geocoder (optional): `python -m uvicorn geocoder_service:app --host 0.0.0.0 --port 8000 --app-dir .`
4) Serve frontend: `python -m http.server 8001`

## Conventions
- Keep frontend vanilla (no build step) unless agreed
- Prefer Leaflet/CARTO for maps
- Use English labels and accessible contrast
- Lint markdown for headings/lists spacing

## PR checklist
- Describe change + screenshots for UI tweaks
- Note if backend is required or optional
- Update docs if API/UX changes
- Keep requirements.txt minimal
