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
// Emergency Form Handling
// ==========================================

const emergencyForm = document.getElementById('emergencyForm');
const priorityCard = document.getElementById('priorityCard');

emergencyForm.addEventListener('submit', (e) => {
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
        return;
    }
    
    // Show loading state
    const submitBtn = emergencyForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    // Simulate AI processing
    setTimeout(() => {
        // Calculate priority score based on urgency and disaster type
        const priorityScore = calculatePriorityScore(formData);
        
        // Display priority card
        displayPriorityCard(formData, priorityScore);
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success notification
        showNotification('Emergency request submitted successfully!', 'success');
        
        // Scroll to priority card
        setTimeout(() => {
            priorityCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }, 1500);
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
    showNotification('Location marked on emergency map', 'info');
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
// Initialize on Page Load
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚨 AI Disaster Early-Help Platform Initialized');
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
