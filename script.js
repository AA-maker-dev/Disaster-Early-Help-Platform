// ==========================================
// Performance Optimization - Throttle Function
// ==========================================

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ==========================================
// Custom Cursor
// ==========================================

const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

let cursorX = 0;
let cursorY = 0;
let outlineX = 0;
let outlineY = 0;

document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    
    if (cursorDot) {
        cursorDot.style.left = cursorX + 'px';
        cursorDot.style.top = cursorY + 'px';
    }
});

function animateCursorOutline() {
    const ease = 0.15;
    outlineX += (cursorX - outlineX) * ease;
    outlineY += (cursorY - outlineY) * ease;
    
    if (cursorOutline) {
        cursorOutline.style.left = outlineX + 'px';
        cursorOutline.style.top = outlineY + 'px';
    }
    
    requestAnimationFrame(animateCursorOutline);
}

animateCursorOutline();

// Cursor hover effects
document.querySelectorAll('a, button, .btn, .map-pin, .feature-card, input, select, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (cursorOutline) cursorOutline.classList.add('hover');
    });
    
    el.addEventListener('mouseleave', () => {
        if (cursorOutline) cursorOutline.classList.remove('hover');
    });
});

// ==========================================
// Loading Screen
// ==========================================

window.addEventListener('load', () => {
    setTimeout(() => {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 1500);
});

// ==========================================
// Scroll Progress Bar
// ==========================================

window.addEventListener('scroll', () => {
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (progressBar) {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight);
        progressBar.style.transform = `scaleX(${scrolled})`;
    }
});

// ==========================================
// Floating Emergency Button
// ==========================================

const floatingBtn = document.querySelector('.floating-emergency-btn');
if (floatingBtn) {
    floatingBtn.addEventListener('click', () => {
        scrollToSection('request');
        setTimeout(() => {
            document.getElementById('location').focus();
        }, 500);
    });
    
    // Hide on scroll down, show on scroll up
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll < 100) {
            floatingBtn.style.transform = 'scale(0)';
        } else if (currentScroll > lastScroll) {
            floatingBtn.style.transform = 'scale(0.8)';
        } else {
            floatingBtn.style.transform = 'scale(1)';
        }
        
        lastScroll = currentScroll;
    });
}

// ==========================================
// 3D Tilt Effect on Feature Cards
// ==========================================

document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

// ==========================================
// Navigation & Scroll Effects
// ==========================================

const navbar = document.querySelector('.navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scroll function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// ==========================================
// Stats Counter Animation
// ==========================================

function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Trigger counter animation when in view
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.target);
            animateCounter(entry.target, target);
            statsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.stat-number').forEach(stat => {
    statsObserver.observe(stat);
});

// ==========================================
// Emergency Map (Leaflet) + AI-ish mapping
// ==========================================

let emergencyMap;
let emergencyBounds;
let incidentMarkers = [];
const liveIncidentCountEl = document.getElementById('liveIncidentCount');
const formStatusEl = document.getElementById('formStatus');
const STORAGE_KEY = 'disasterPlatformIncidents';

const GEO_API_ENDPOINT = 'http://localhost:8000/geocode'; // FastAPI geocoder endpoint (see docs)

// Simple client-side fallback that queries public Nominatim when backend is unavailable
async function clientGeocodeFallback(locationText) {
    try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(locationText)}`;
        const res = await fetch(url, {
            headers: {
                'Accept-Language': 'en'
            }
        });
        if (!res.ok) throw new Error('Client geocode failed');
        const results = await res.json();
        if (Array.isArray(results) && results[0]?.lat && results[0]?.lon) {
            return {
                coords: [parseFloat(results[0].lat), parseFloat(results[0].lon)],
                resolvedName: results[0].display_name
            };
        }
    } catch (err) {
        console.warn('Public Nominatim fallback failed:', err?.message || err);
    }
    return null;
}

// Seed data to pre-populate the map
const baseIncidents = [
    { title: 'Wildfire | Los Angeles, United States', coords: [34.0522, -118.2437], level: 'critical', status: 'Active response' },
    { title: 'Flooding | Manila, Philippines', coords: [14.5995, 120.9842], level: 'high', status: 'Evacuation underway' },
    { title: 'Landslide Risk | Medellin, Colombia', coords: [6.2476, -75.5658], level: 'medium', status: 'Monitoring' },
    { title: 'Road Blockage | Warsaw, Poland', coords: [52.2297, 21.0122], level: 'low', status: 'Clearing crew en route' },
    { title: 'Earthquake Aftershock | Tokyo, Japan', coords: [35.6762, 139.6503], level: 'critical', status: 'Search and rescue' }
];

function mapUrgencyToLevel(urgency) {
    const map = { critical: 'critical', high: 'high', medium: 'medium', low: 'low' };
    return map[urgency] || 'medium';
}

async function geocodeLocation(locationText) {
    if (!locationText) return null;
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2500);
        const res = await fetch(GEO_API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: locationText }),
            signal: controller.signal
        });
        clearTimeout(timeout);
        if (!res.ok) throw new Error('Geocode failed');
        const data = await res.json();
        if (data?.lat && data?.lng) {
            return {
                coords: [data.lat, data.lng],
                resolvedName: data.formatted || locationText
            };
        }
    } catch (err) {
        console.warn('Geocode fallback:', err?.message || err);
    }
    // Try client-side public Nominatim before resorting to pseudo coords
    const nominatimGeo = await clientGeocodeFallback(locationText);
    if (nominatimGeo) return nominatimGeo;
    return null;
}

function pseudoGeocode(locationText) {
    // Deterministic pseudo-geocoder: hashes the location string to lat/lng
    let hash = 0;
    for (let i = 0; i < locationText.length; i++) {
        hash = ((hash << 5) - hash) + locationText.charCodeAt(i);
        hash |= 0;
    }
    const lat = ((hash % 14000) / 100) - 70; // -70 to +70
    const lng = (((hash / 14000) % 34000) / 100) - 170; // -170 to +170
    return [lat, lng];
}

function addIncidentMarker(incident) {
    if (!emergencyMap) return;

    const marker = L.marker(incident.coords, {
        icon: L.divIcon({
            className: 'emergency-marker',
            html: `<div class="marker-dot marker-${incident.level}"></div>`,
            iconSize: [18, 18],
            iconAnchor: [9, 9]
        })
    }).addTo(emergencyMap);

    marker.bindPopup(`
        <strong>${incident.title}</strong><br>
        Urgency: ${incident.level.toUpperCase()}<br>
        Status: ${incident.status}
    `);

    incidentMarkers.push(marker);
    emergencyBounds.extend(incident.coords);
    updateLiveIncidentCount();
}

// ==========================================
// Local Storage Functions
// ==========================================

function saveIncidentsToStorage(incidents) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
        console.log('✓ Incidents saved to local storage');
    } catch (err) {
        console.warn('⚠ Failed to save incidents to storage:', err);
    }
}

function loadIncidentsFromStorage() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const incidents = JSON.parse(stored);
            console.log('✓ Loaded incidents from local storage:', incidents.length, 'items');
            return incidents;
        }
    } catch (err) {
        console.warn('⚠ Failed to load incidents from storage:', err);
    }
    return [];
}

function clearIncidentsStorage() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        console.log('✓ Incidents cleared from local storage');
    } catch (err) {
        console.warn('⚠ Failed to clear storage:', err);
    }
}

function getStoredIncidents() {
    const baseIncidentsData = baseIncidents.map(inc => ({
        title: inc.title,
        coords: inc.coords,
        level: inc.level,
        status: inc.status,
        isBase: true
    }));
    const storedIncidents = loadIncidentsFromStorage();
    // Filter out base incidents that are already in the list to avoid duplicates
    const userIncidents = storedIncidents.filter(stored => 
        !baseIncidentsData.some(base => JSON.stringify(base) === JSON.stringify(stored))
    );
    return [...baseIncidentsData, ...userIncidents];
}

function initEmergencyMap() {
    const mapElement = document.getElementById('liveMap');
    if (!mapElement || typeof L === 'undefined') return;

    emergencyMap = L.map(mapElement, {
        worldCopyJump: true,
        zoomControl: true
    });

    const defaultView = [20, 0];

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors, &copy; CARTO'
    }).addTo(emergencyMap);

    emergencyBounds = L.latLngBounds();

    // Load incidents from storage (base incidents + user-added incidents)
    const allIncidents = getStoredIncidents();
    allIncidents.forEach(addIncidentMarker);

    if (emergencyBounds.isValid()) {
        emergencyMap.fitBounds(emergencyBounds, { padding: [32, 32] });
    } else {
        emergencyMap.setView(defaultView, 2);
    }
}

function updateLiveIncidentCount() {
    if (!liveIncidentCountEl) return;
    const total = incidentMarkers.length;
    liveIncidentCountEl.textContent = `Live incidents: ${total}`;
}

async function addUserIncidentToMap(formData, priorityScore) {
    if (!emergencyMap) return;
    const geo = await geocodeLocation(formData.location.trim());
    const coords = geo?.coords || pseudoGeocode(formData.location.trim());
    const level = mapUrgencyToLevel(formData.urgency);
    const title = `${formData.disasterType || 'Incident'} | ${geo?.resolvedName || formData.location}`;
    const status = `Priority ${priorityScore} • ${formData.message.slice(0, 80)}`;

    const incident = { title, coords, level, status };
    addIncidentMarker(incident);

    // Save the new incident to local storage
    const storedIncidents = loadIncidentsFromStorage();
    storedIncidents.push(incident);
    saveIncidentsToStorage(storedIncidents);

    if (emergencyBounds.isValid()) {
        emergencyMap.fitBounds(emergencyBounds, { padding: [32, 32] });
    }
}

document.addEventListener('DOMContentLoaded', initEmergencyMap);

// ==========================================
// Footer Functionality - Modals
// ==========================================

// Modal management
const modals = {
    docs: document.getElementById('docs-modal'),
    api: document.getElementById('api-modal'),
    support: document.getElementById('support-modal'),
    contact: document.getElementById('contact-modal')
};

// Open modal function
function openModal(modalId) {
    const modal = modals[modalId];
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close modal function
function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Event listeners for footer links
document.getElementById('docs-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    openModal('docs');
});

document.getElementById('api-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    openModal('api');
});

document.getElementById('support-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    openModal('support');
});

document.getElementById('contact-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    openModal('contact');
});

// Close modal when clicking X or outside
Object.values(modals).forEach(modal => {
    if (modal) {
        // Close button
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn?.addEventListener('click', () => closeModal(modal));
        
        // Click outside modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    }
});

// Close modal with ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        Object.values(modals).forEach(modal => {
            if (modal && modal.classList.contains('active')) {
                closeModal(modal);
            }
        });
    }
});

// ==========================================
// Newsletter Form
// ==========================================

const newsletterForm = document.getElementById('newsletter-form');
const newsletterEmail = document.getElementById('newsletter-email');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = newsletterEmail.value;
        
        if (email) {
            // Simulate newsletter subscription
            showNotification('✅ Subscribed! You\'ll receive emergency updates at ' + email, 'success');
            newsletterEmail.value = '';
            
            // Animation effect
            newsletterForm.style.transform = 'scale(0.95)';
            setTimeout(() => {
                newsletterForm.style.transform = 'scale(1)';
            }, 200);
        }
    });
}

// ==========================================
// Contact Form
// ==========================================

const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const subject = document.getElementById('contact-subject').value;
        const message = document.getElementById('contact-message').value;
        
        if (name && email && subject && message) {
            // Simulate sending message
            showNotification(`✅ Thank you ${name}! Your message has been sent. We'll respond within 24 hours.`, 'success');
            
            // Close modal after short delay
            setTimeout(() => {
                closeModal(modals.contact);
                contactForm.reset();
            }, 2000);
        }
    });
}

// ==========================================
// API Key Request
// ==========================================

const getApiKeyBtn = document.getElementById('get-api-key');

if (getApiKeyBtn) {
    getApiKeyBtn.addEventListener('click', () => {
        const apiKey = 'SK-' + Math.random().toString(36).substr(2, 9).toUpperCase() + 
                       '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        
        showNotification(`🔑 Your API Key: ${apiKey} (Demo only - not functional)`, 'success');
        
        // Copy to clipboard
        navigator.clipboard.writeText(apiKey).then(() => {
            setTimeout(() => {
                showNotification('📋 API Key copied to clipboard!', 'success');
            }, 1500);
        });
    });
}

// ==========================================
// Live Chat Support
// ==========================================

const startChatBtn = document.getElementById('start-chat');

if (startChatBtn) {
    startChatBtn.addEventListener('click', () => {
        showNotification('💬 Live chat feature coming soon! Please use email or hotline for now.', 'info');
    });
}

// ==========================================
// Social Media Share Functions
// ==========================================

const twitterLink = document.getElementById('twitter-link');
const linkedinLink = document.getElementById('linkedin-link');

if (twitterLink) {
    twitterLink.addEventListener('click', (e) => {
        e.preventDefault();
        const text = 'Check out Sentinel AI - AI-powered disaster management platform! 🚨';
        const url = window.location.href;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    });
}

if (linkedinLink) {
    linkedinLink.addEventListener('click', (e) => {
        e.preventDefault();
        const url = window.location.href;
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    });
}

// ==========================================
// Emergency Form Handling
// ==========================================

const emergencyForm = document.getElementById('emergencyForm');
const priorityCard = document.getElementById('priorityCard');

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function setFormStatus(state, text) {
    if (!formStatusEl) return;
    formStatusEl.classList.remove('pending', 'error');
    if (state === 'pending') formStatusEl.classList.add('pending');
    if (state === 'error') formStatusEl.classList.add('error');
    const dot = formStatusEl.querySelector('.status-dot');
    if (dot && state === 'pending') {
        dot.classList.add('spin');
    } else if (dot) {
        dot.classList.remove('spin');
    }
    const label = formStatusEl.querySelector('.status-text');
    if (label) label.textContent = text;
}

emergencyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form values
    const formData = {
        name: document.getElementById('name').value || 'Anonymous',
        location: document.getElementById('location').value,
        disasterType: document.getElementById('disasterType').value,
        urgency: document.getElementById('urgency').value,
        message: document.getElementById('message').value
    };
    
    // Validate required fields
    if (!formData.location || !formData.disasterType || !formData.urgency || !formData.message) {
        showNotification('Please fill in all required fields', 'error');
        setFormStatus('error', 'Missing required fields');
        return;
    }
    
    // Show loading state
    const submitBtn = emergencyForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    setFormStatus('pending', 'Geocoding & prioritizing...');
    
    // Simulate AI processing
    await delay(1200);

    // Calculate priority score based on urgency and disaster type
    const priorityScore = calculatePriorityScore(formData);
    
    // Display priority card
    displayPriorityCard(formData, priorityScore);

    // Drop marker on map using backend geocode if available
    await addUserIncidentToMap(formData, priorityScore);
    
    // Reset button
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    setFormStatus('ready', 'Mapped successfully');
    
    // Show success notification
    showNotification('Emergency request submitted successfully!', 'success');
    
    // Scroll to priority card to show the AI analysis
    setTimeout(() => {
        priorityCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
});

// ==========================================
// Priority Score Calculation (AI Simulation)
// ==========================================

function calculatePriorityScore(data) {
    let score = 0;
    
    // Base score by urgency
    const urgencyScores = {
        'low': 25,
        'medium': 50,
        'high': 75,
        'critical': 95
    };
    score = urgencyScores[data.urgency] || 50;
    
    // Add randomness for AI simulation (±10)
    score += Math.floor(Math.random() * 20) - 10;
    
    // Boost for high-risk disasters
    const highRiskDisasters = ['fire', 'earthquake', 'hurricane', 'tornado'];
    if (highRiskDisasters.includes(data.disasterType)) {
        score += 5;
    }
    
    // Ensure score is within bounds
    score = Math.max(0, Math.min(100, score));
    
    return score;
}

// ==========================================
// Display Priority Card
// ==========================================

function displayPriorityCard(data, score) {
    // Update urgency badge
    const urgencyElement = document.getElementById('priorityUrgency');
    urgencyElement.textContent = data.urgency.toUpperCase();
    urgencyElement.className = `urgency-badge ${data.urgency}`;
    
    // Animate score bar
    const scoreBar = document.getElementById('scoreBar');
    const scoreValue = document.getElementById('scoreValue');
    
    setTimeout(() => {
        scoreBar.style.width = score + '%';
        animateCounter(scoreValue, score, 1000);
    }, 100);
    
    // Update status message
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.textContent = generateStatusMessage(data, score);
    
    // Show the card
    priorityCard.classList.remove('hidden');
}

// ==========================================
// Generate Status Message
// ==========================================

function generateStatusMessage(data, score) {
    const messages = {
        critical: [
            `🚨 CRITICAL ALERT: Emergency teams are being dispatched immediately to ${data.location}. This is a life-threatening situation requiring urgent response.`,
            `🚨 HIGHEST PRIORITY: Your ${data.disasterType} emergency has been flagged as critical. First responders are being mobilized now.`,
            `🚨 IMMEDIATE ACTION: Critical emergency detected at ${data.location}. All available resources are being allocated to this incident.`
        ],
        high: [
            `⚠️ HIGH PRIORITY: Your emergency request for ${data.disasterType} has been prioritized. Response team will arrive within 15-30 minutes.`,
            `⚠️ URGENT: Emergency teams have been notified of your situation at ${data.location}. Help is on the way.`,
            `⚠️ PRIORITY RESPONSE: Your high-urgency ${data.disasterType} report is being actively monitored and addressed.`
        ],
        medium: [
            `📋 MEDIUM PRIORITY: Your ${data.disasterType} emergency has been logged. Expected response time: 30-60 minutes.`,
            `📋 ACKNOWLEDGED: Your emergency request is in queue. Local response teams have been notified.`,
            `📋 PROCESSING: Your situation at ${data.location} is being assessed. Updates will follow shortly.`
        ],
        low: [
            `✓ LOW PRIORITY: Your ${data.disasterType} report has been received and logged for monitoring.`,
            `✓ RECORDED: Your emergency request is being tracked. Response time may vary based on resource availability.`,
            `✓ MONITORED: Your situation at ${data.location} is under observation. No immediate danger detected.`
        ]
    };
    
    const messageArray = messages[data.urgency] || messages.medium;
    return messageArray[Math.floor(Math.random() * messageArray.length)];
}

// ==========================================
// Helper Functions
// ==========================================

function viewOnMap() {
    scrollToSection('map');
    setTimeout(() => {
        if (emergencyMap) {
            emergencyMap.invalidateSize();
            if (emergencyBounds?.isValid()) {
                emergencyMap.fitBounds(emergencyBounds, { padding: [32, 32] });
            }
        }
    }, 350);
    showNotification('Emergency map centered on active incidents', 'info');
}

function resetForm() {
    emergencyForm.reset();
    priorityCard.classList.add('hidden');
    scrollToSection('request');
}

// ==========================================
// Notification System
// ==========================================

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    
    const colors = {
        success: '#4caf50',
        error: '#dc143c',
        info: '#2196f3'
    };
    
    notification.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .notification {
        font-weight: 600;
        font-size: 0.95rem;
    }
    
    .notification i {
        font-size: 1.3rem;
    }
`;
document.head.appendChild(style);

// ==========================================
// Map Pin Interactions
// ==========================================

document.querySelectorAll('.map-pin').forEach(pin => {
    pin.addEventListener('click', () => {
        const tooltip = pin.getAttribute('data-tooltip');
        showNotification(`Selected: ${tooltip}`, 'info');
    });
});

// ==========================================
// Feature Card Animations on Scroll
// ==========================================

const featureObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            featureObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.5s ease';
    featureObserver.observe(card);
});

// ==========================================
// Scroll Animations & Parallax Effects (Optimized)
// ==========================================

let ticking = false;
let lastScrollY = 0;

const handleScroll = () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    const particles = document.querySelector('.particles-container');
    const waves = document.querySelector('.animated-waves');
    
    if (scrolled < window.innerHeight) {
        if (heroContent) {
            heroContent.style.transform = `translate3d(0, ${scrolled * 0.4}px, 0)`;
            heroContent.style.opacity = Math.max(0, 1 - (scrolled / 600));
        }
        
        if (particles) {
            particles.style.transform = `translate3d(0, ${scrolled * 0.2}px, 0)`;
        }
        
        if (waves) {
            waves.style.transform = `translate3d(0, ${scrolled * 0.3}px, 0)`;
        }
    }
    
    lastScrollY = scrolled;
    ticking = false;
};

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(handleScroll);
        ticking = true;
    }
});

// Scroll reveal animations (throttled)
const revealElements = throttle(() => {
    const reveals = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, .section-header, .feature-card');
    
    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100 && elementBottom > 0) {
            element.classList.add('active', 'visible', 'scaled');
        }
    });
}, 100);

// Smooth scale on scroll for sections (throttled)
const scaleOnScroll = throttle(() => {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top < windowHeight && rect.bottom > 0) {
            const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
            const scale = 0.98 + (progress * 0.02);
            section.style.transform = `scale(${Math.min(scale, 1)})`;
        }
    });
}, 100);

// Initialize scroll animations
window.addEventListener('scroll', () => {
    revealElements();
    scaleOnScroll();
});

// Initialize on page load
window.addEventListener('load', () => {
    revealElements();
    scaleOnScroll();
    advancedParallax();
    depth3DScroll();
    
    // Animate decorative elements on load
    setTimeout(() => {
        document.querySelectorAll('.deco-circle, .gradient-orb, .float-shape').forEach((el, i) => {
            setTimeout(() => {
                el.style.opacity = '1';
            }, i * 200);
        });
    }, 500);
});

// Add smooth parallax to map pins
window.addEventListener('scroll', () => {
    const mapSection = document.getElementById('map');
    if (mapSection) {
        const rect = mapSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const pins = document.querySelectorAll('.map-pin');
            pins.forEach((pin, index) => {
                const speed = 0.5 + (index * 0.1);
                const yPos = (rect.top - window.innerHeight) * speed * 0.1;
                pin.style.transform = `translateY(${yPos}px)`;
            });
        }
    }
});

// Smooth mouse parallax on hero (optimized)
let mouseX = 0;
let mouseY = 0;
let currentX = 0;
let currentY = 0;

document.addEventListener('mousemove', throttle((e) => {
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
}, 50));

function animateParallax() {
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;
    
    const heroSection = document.querySelector('.hero-section');
    if (heroSection && window.pageYOffset < window.innerHeight) {
        const particles = document.querySelector('.particles-container');
        const waves = document.querySelector('.animated-waves');
        
        if (particles) {
            particles.style.transform = `translate3d(${currentX * 30}px, ${currentY * 30}px, 0)`;
        }
        
        if (waves) {
            waves.style.transform = `translate3d(${currentX * -20}px, ${currentY * -20}px, 0)`;
        }
    }
    
    requestAnimationFrame(animateParallax);
}

animateParallax();

// ==========================================
// Initialize on Page Load
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚨 Sentinel AI Platform Initialized');
    console.log('Platform ready to receive emergency requests');
    
    // Add pulse animation to emergency icons
    setInterval(() => {
        document.querySelectorAll('.pin-critical').forEach(pin => {
            pin.style.animation = 'none';
            setTimeout(() => {
                pin.style.animation = 'pulse 1s ease';
            }, 10);
        });
    }, 5000);
});

// ==========================================
// Keyboard Shortcuts
// ==========================================

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + H: Focus on request form
    if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        scrollToSection('request');
        document.getElementById('location').focus();
    }
    
    // Ctrl/Cmd + M: Jump to map
    if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault();
        scrollToSection('map');
    }
    
    // Escape: Close mobile menu
    if (e.key === 'Escape') {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// ==========================================
// Dummy Data for Demo
// ==========================================

// Sample emergency data (for potential future features)
const sampleEmergencies = [
    {
        id: 1,
        location: '123 Main St, Downtown',
        disasterType: 'fire',
        urgency: 'critical',
        score: 95,
        status: 'active',
        timestamp: Date.now() - 300000
    },
    {
        id: 2,
        location: '456 Oak Ave, Riverside',
        disasterType: 'flood',
        urgency: 'high',
        score: 78,
        status: 'responding',
        timestamp: Date.now() - 600000
    },
    {
        id: 3,
        location: '789 Pine Rd, Hillside',
        disasterType: 'landslide',
        urgency: 'medium',
        score: 55,
        status: 'monitored',
        timestamp: Date.now() - 900000
    },
    {
        id: 4,
        location: '321 Elm St, Uptown',
        disasterType: 'other',
        urgency: 'low',
        score: 32,
        status: 'resolved',
        timestamp: Date.now() - 1200000
    },
    {
        id: 5,
        location: '654 Maple Dr, Westside',
        disasterType: 'earthquake',
        urgency: 'critical',
        score: 92,
        status: 'active',
        timestamp: Date.now() - 180000
    }
];

// Log sample data for demonstration
console.table(sampleEmergencies);

// ==========================================
// Performance Optimization
// ==========================================

// Lazy load animations
if ('IntersectionObserver' in window) {
    console.log('✓ IntersectionObserver supported - Animations optimized');
} else {
    console.warn('⚠ IntersectionObserver not supported - Using fallback');
}

// Preload critical resources
window.addEventListener('load', () => {
    console.log('✓ All resources loaded successfully');
});
