const API_BASE = '/api';

function showToast(message, isError = false) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        document.body.appendChild(toast);
    }
    toast.innerHTML = isError ? `⚠️ ${message}` : `✅ ${message}`;
    toast.className = `toast show ${isError ? 'error' : ''}`;
    setTimeout(() => toast.classList.remove('show'), 3500);
}

function getToken() {
    return localStorage.getItem('token');
}

function setToken(token, role) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login.html';
}

function checkAuth() {
    if (!getToken() && !window.location.pathname.includes('login')) {
        window.location.href = '/login.html';
    }
}

async function apiCall(endpoint, method = 'GET', body = null) {
    const headers = {
        'Content-Type': 'application/json'
    };
    
    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);
    
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        const data = await response.json();
        
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                logout();
            }
            throw new Error(data.error || 'Server Error. Please try again.');
        }
        return data;
    } catch (err) {
        showToast(err.message, true);
        throw err;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }

    // Global SOS Button Logic
    const sosBtn = document.querySelector('.sos-btn');
    if (sosBtn) {
        sosBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (confirm("EMERGENCY: Do you want to trigger an immediate SOS Alert? This will alert all admins and nearby tourists.")) {
                try {
                    // Try to grab location automatically if possible
                    let locString = "Unknown direct location";
                    if ("geolocation" in navigator) {
                        navigator.geolocation.getCurrentPosition(
                            pos => { locString = `Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`; },
                            err => { console.warn("Could not get exact coords for SOS", err); }
                        );
                    }
                    
                    // Wait a moment for location to populate
                    setTimeout(async () => {
                        await apiCall('/incidents/', 'POST', {
                            tourist_name: "EMERGENCY SOS Triggered",
                            location: locString,
                            description: "Urgent SOS button activated from device."
                        });
                        showToast("SOS Alert Broadcasted! Stay calm, help is notified.");
                        sosBtn.innerText = "SOS SENT";
                        sosBtn.style.animation = "none";
                        sosBtn.style.background = "var(--danger)";
                    }, 500);

                } catch(error) {
                    showToast("Failed to send SOS. Please call local emergency numbers directly.", true);
                }
            }
        });
    }
});
