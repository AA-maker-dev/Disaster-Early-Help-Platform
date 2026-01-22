"""
FastAPI microservice for geocoding emergency locations.
- Uses geopy + Nominatim (OSM) for geocoding.
- Returns lat/lng and a formatted display name.
- Designed for local hackathon use; rate-limit friendly.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from geopy.geocoders import Nominatim
from geopy.extra.rate_limiter import RateLimiter

app = FastAPI(title="Sentinel AI Geocoder", version="0.1")

# Allow browser calls from local demos
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

geolocator = Nominatim(user_agent="sentinel-ai-geocoder")
geocode = RateLimiter(geolocator.geocode, min_delay_seconds=1)

class GeocodeRequest(BaseModel):
    query: str

class GeocodeResponse(BaseModel):
    lat: float
    lng: float
    formatted: str

@app.post("/geocode", response_model=GeocodeResponse)
def geocode_location(body: GeocodeRequest):
    if not body.query or not body.query.strip():
        raise HTTPException(status_code=400, detail="Empty query")

    result = geocode(body.query, language="en", addressdetails=True, exactly_one=True)
    if not result:
        raise HTTPException(status_code=404, detail="Location not found")

    return GeocodeResponse(
        lat=result.latitude,
        lng=result.longitude,
        formatted=result.address
    )

# Run locally: uvicorn geocoder_service:app --host 0.0.0.0 --port 8000
