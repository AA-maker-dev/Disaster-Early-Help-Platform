# YouTube Demo Script – Sentinel AI: Disaster Early-Help Platform
**Duration:** 2–3 minutes  
**Tone:** Confident, clear, hackathon-ready  
**Format:** Screen-recorded demo with voiceover

---

## 🎬 SCRIPT

### [0:00–0:07] HOOK
*[Show news footage or text overlay: "Every second counts during a disaster"]*

When disaster strikes, emergency responders are flooded with calls. But how do they know which areas need help first?

---

### [0:08–0:15] QUICK INTRO
*[Show project landing page]*

I'm presenting **Sentinel AI** – an AI-assisted emergency intake platform that helps responders prioritize and visualize disaster requests in real time.

---

### [0:16–0:35] PROBLEM STATEMENT
*[Show cluttered spreadsheet or chaotic phone logs on screen]*

During floods, earthquakes, or wildfires, emergency teams struggle with unorganized data. Calls come in fast, but there's no clear way to see which locations are critical, where the injuries are, or what resources are needed most urgently.

This delays response times. And in disasters, delays cost lives.

---

### [0:36–0:55] SOLUTION OVERVIEW
*[Show platform homepage with hero section]*

Sentinel AI solves this. It's a zero-setup web platform where victims or volunteers can submit emergency requests through a simple form. Our system instantly calculates a priority score based on urgency, injury severity, and resource needs.

Then, it plots each incident on a live interactive map with color-coded markers – red for critical, yellow for moderate, green for low urgency.

---

### [0:56–1:45] LIVE DEMO WALKTHROUGH
*[Screen recording: Fill out the form]*

Let me show you how it works.

Here's our emergency intake form. I'll submit a request from Pokhara Lakeside, Nepal.

*[Fill fields: Name, Location, Contact, Emergency Type = "Flood", Urgency = "Critical", Injuries = "Yes", Resources Needed = "Medical supplies"]*

Notice how the form captures all essential details – name, location, emergency type, urgency level, injury status, and resources needed.

*[Click Submit]*

The moment I hit submit, watch what happens.

*[Show success message and "View on Map" button]*

Our AI scoring engine processes the submission and returns a priority score. This incident scores 89 out of 100 – high priority.

*[Click "View on Map"]*

Now it appears on our live map as a **red marker**, indicating critical urgency.

*[Zoom in on marker, click it]*

When I click the marker, we see all the details – the reporter's name, contact, emergency type, urgency level, and resources needed.

*[Submit another request with lower urgency, show green marker]*

Let me add another request from Los Angeles with lower urgency.

Notice how this one appears as a **green marker** – our system automatically color-codes based on priority.

*[Show counter updating]*

The incident counter updates in real time. Responders can see the total number of active incidents at a glance.

---

### [1:46–2:05] TECH STACK
*[Show code editor or tech stack diagram briefly]*

Here's what powers Sentinel AI.

The frontend is built with vanilla HTML, CSS, and JavaScript – zero build steps, fully static, works anywhere.

For the map, we use Leaflet with CARTO Voyager tiles for clear, English-labeled visuals.

The backend is a lightweight FastAPI service using geopy and Nominatim for accurate geocoding. And here's the smart part – if the backend goes down, our system has a deterministic fallback that keeps the demo running offline.

It's resilient by design.

---

### [2:06–2:20] IMPACT & USE CASES
*[Show icons or text: Red Cross, Local Authorities, NGOs]*

This platform is built for disaster response teams, NGOs, local authorities, and volunteers.

Imagine a flood in Kathmandu. Instead of sifting through hundreds of calls, responders open Sentinel AI and instantly see where the critical cases are. They can dispatch resources faster, prioritize the injured, and save more lives.

---

### [2:21–2:35] WHY THIS STANDS OUT
*[Show UI again with map in action]*

What makes Sentinel AI different?

One – it's a zero-config solution. No complex setup. Just open the browser and start.

Two – it's resilient. Even without the backend, the platform keeps working with a client-side fallback.

Three – it's real-time. Every submission updates the map instantly, giving responders a live operational picture.

And four – it's mobile-friendly. Victims can submit requests from their phones in the middle of a crisis.

---

### [2:36–2:45] FUTURE IMPROVEMENTS
*[Show text overlay or slide]*

Looking ahead, we plan to integrate real-time SMS alerts for responders, add multi-language support for global use, and connect with drone footage for live disaster zone monitoring.

We're also exploring AI-powered clustering to identify the hardest-hit areas automatically.

---

### [2:46–2:55] STRONG CLOSING
*[Show logo or landing page one last time]*

Sentinel AI isn't just a hackathon project. It's a tool that could save lives.

When every second matters, we make sure help gets to the right place, at the right time.

Thank you.

---

## 📝 DELIVERY TIPS
- **Speak clearly and confidently** – avoid rushing
- **Pause after key points** (problem, solution, demo transitions)
- **Let the screen do the talking** during the demo – don't over-explain
- **Smile with your voice** – sound passionate but professional
- **Practice 2–3 times** to hit 2:30–3:00 minutes

---

## 🎯 REHEARSAL CHECKLIST
- [ ] Backend running (`python -m uvicorn geocoder_service:app --host 0.0.0.0 --port 8000 --app-dir .`)
- [ ] Frontend running (`python -m http.server 8001`)
- [ ] Test form submission before recording
- [ ] Check map markers display correctly
- [ ] Clear browser cache for clean demo
- [ ] Close unnecessary tabs/windows
- [ ] Use full-screen mode during recording
- [ ] Test audio levels

---

**Good luck! You've got this. 🚀**
