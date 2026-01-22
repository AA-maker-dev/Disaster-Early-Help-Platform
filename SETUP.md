# Setup Notes

## Prereqs
- Python 3.10+
- Node not required (frontend is static)
- VS Code Live Server extension helps for local preview

## Install backend deps
```
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## Run geocoder service
```
python -m uvicorn geocoder_service:app --host 0.0.0.0 --port 8000 --app-dir .
```

## Run frontend locally
- Easiest: `python -m http.server 8001` then open http://localhost:8001
- Or use Live Server on index.html

## Environment vars (optional)
- `GEOCODER_USER_AGENT`: override default user agent for Nominatim
- `PORT`: change uvicorn port (if you alter command)

## Notes
- Frontend auto-falls back to client-side geocode if backend is offline.
- CARTO Voyager tiles provide English labels out of the box.
