# Ready-to-Run Checklist

- [ ] Python 3.10+ installed
- [ ] `pip install -r requirements.txt` completed
- [ ] geocoder running: `python -m uvicorn geocoder_service:app --host 0.0.0.0 --port 8000 --app-dir .`
- [ ] Static server running for frontend: `python -m http.server 8001` (or Live Server)
- [ ] Visit frontend URL and submit a test incident
- [ ] Marker appears with correct urgency color and increments counter
- [ ] Fallback works if geocoder is stopped
