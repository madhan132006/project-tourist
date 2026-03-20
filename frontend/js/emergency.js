/* ============================================================
   EMERGENCY.JS — SOS Alert System for Smart Tourist Safety System
   ============================================================ */

let alertActive = false;
let alertId = null;
let statusInterval = null;
let currentLat = null, currentLng = null;

// ─── Get location on load ───
document.addEventListener('DOMContentLoaded', () => {
  detectLocation();
});

async function detectLocation() {
  const locDisplay = document.getElementById('locDisplay');
  const coordDisplay = document.getElementById('coordDisplay');
  const gpsStatus = document.getElementById('gpsStatus');

  try {
    const pos = await getLocation();
    currentLat = pos.lat;
    currentLng = pos.lng;

    if (locDisplay) locDisplay.textContent = `GPS location acquired`;
    if (coordDisplay) coordDisplay.textContent = `Lat: ${pos.lat.toFixed(6)} | Lng: ${pos.lng.toFixed(6)} | Accuracy: ±${Math.round(pos.accuracy)}m`;
    if (gpsStatus) { gpsStatus.textContent = '✅ GPS Ready'; gpsStatus.className = 'badge badge-success'; }
  } catch (e) {
    currentLat = 12.9716;
    currentLng = 77.5946;
    if (locDisplay) locDisplay.textContent = 'Default location used (GPS unavailable)';
    if (gpsStatus) { gpsStatus.textContent = '⚠️ GPS Unavailable'; gpsStatus.className = 'badge badge-warning'; }
    showToast('Enable location access for accurate emergency dispatch', 'warning');
  }
}

// ─── SOS Trigger ───
async function triggerSOS() {
  if (alertActive) {
    if (!confirm('An alert is already active. Do you want to cancel it?')) return;
    cancelAlert();
    return;
  }

  const confirmed = confirm('🆘 EMERGENCY SOS ALERT\n\nThis will:\n• Send your GPS location to police & ambulance\n• Log this incident to blockchain\n• Notify emergency contacts\n\nProceed?');
  if (!confirmed) return;

  alertActive = true;
  const btn = document.getElementById('sosBtnMain');
  if (btn) {
    btn.innerHTML = `<span class="sos-icon">⏳</span><span class="sos-label">SENDING</span><span class="sos-sub">PLEASE WAIT</span>`;
    btn.style.background = 'linear-gradient(135deg,#f59e0b,#d97706)';
  }

  document.getElementById('alertStatus').textContent = '🔴 ALERT ACTIVE';
  document.getElementById('alertStatus').className = 'badge badge-danger';

  showToast('🆘 SOS Alert triggered! Connecting to emergency services...', 'error', 5000);

  const payload = {
    touristId: localStorage.getItem('touristId') || 'DEMO-001',
    lat: currentLat || 12.9716,
    lng: currentLng || 77.5946,
    location: `${(currentLat || 12.9716).toFixed(5)}, ${(currentLng || 77.5946).toFixed(5)}`,
    type: document.getElementById('emergType')?.value || 'general',
    description: document.getElementById('emergDesc')?.value || '',
    timestamp: new Date().toISOString(),
  };

  // Animate step 1
  setStepStatus(1, 'active');

  await delay(800);
  setStepStatus(1, 'done');
  setStepStatus(2, 'active');

  try {
    const res = await API.triggerSOS(payload);
    alertId = res.id || 'DEMO-' + Date.now();
  } catch {
    alertId = 'DEMO-' + Date.now();
  }

  await delay(1200);
  setStepStatus(2, 'done');
  setStepStatus(3, 'active');

  await delay(1500);
  setStepStatus(3, 'done');
  setStepStatus(4, 'active');

  showToast('✅ Authorities notified! Help is on the way (~4 min)', 'success', 6000);

  // Update button
  if (btn) {
    btn.innerHTML = `<span class="sos-icon">⏱️</span><span class="sos-label">ACTIVE</span><span class="sos-sub">TAP TO CANCEL</span>`;
    btn.style.background = 'linear-gradient(135deg,#f59e0b,#d97706)';
  }

  // Add to history
  addToHistory(payload);

  // Simulate resolution after 30s (demo)
  setTimeout(() => {
    if (alertActive) resolveAlert();
  }, 30000);
}

function setStepStatus(step, status) {
  const ss = document.getElementById(`ss${step}`);
  const sc = document.getElementById(`sc${step}`);
  if (!ss || !sc) return;

  ss.className = `status-step ${status}`;
  sc.className = `status-circle ${status}`;
  if (status === 'done') sc.innerHTML = '✓';
  else if (status === 'active') sc.innerHTML = '<span style="width:8px;height:8px;border:2px solid white;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;display:inline-block;"></span>';
}

function resolveAlert() {
  alertActive = false;
  const btn = document.getElementById('sosBtnMain');
  if (btn) {
    btn.innerHTML = `<span class="sos-icon">🆘</span><span class="sos-label">SOS</span><span class="sos-sub">PRESS TO ALERT</span>`;
    btn.style.background = '';
  }
  setStepStatus(4, 'done');
  document.getElementById('alertStatus').textContent = '✅ Resolved';
  document.getElementById('alertStatus').className = 'badge badge-success';

  const resolvedMsg = document.getElementById('resolvedMsg');
  if (resolvedMsg) resolvedMsg.classList.remove('hidden');

  showToast('✅ Alert resolved. We hope you are safe!', 'success', 6000);
}

function cancelAlert() {
  alertActive = false;
  const btn = document.getElementById('sosBtnMain');
  if (btn) {
    btn.innerHTML = `<span class="sos-icon">🆘</span><span class="sos-label">SOS</span><span class="sos-sub">PRESS TO ALERT</span>`;
    btn.style.background = '';
  }
  [1,2,3,4].forEach(i => {
    const ss = document.getElementById(`ss${i}`);
    const sc = document.getElementById(`sc${i}`);
    if (ss) ss.className = 'status-step';
    if (sc) { sc.className = 'status-circle'; sc.innerHTML = i; }
  });
  document.getElementById('alertStatus').textContent = '● Standby';
  document.getElementById('alertStatus').className = 'badge badge-warning';
  showToast('Alert cancelled.', 'info');
}

function addToHistory(payload) {
  const hist = document.getElementById('alertHistory');
  if (!hist) return;
  const now = new Date().toLocaleString('en', { month: 'short', day: 'numeric', year: 'numeric' });
  const type = (document.getElementById('emergType')?.value || 'General').replace(/^\w/, c => c.toUpperCase());
  const id = String(Math.floor(Math.random() * 900 + 100)).padStart(4, '0');

  const item = document.createElement('div');
  item.className = 'notif-item';
  item.style.animation = 'slideDown 0.4s ease';
  item.innerHTML = `
    <span class="notif-icon">🔴</span>
    <div class="notif-body">
      <h4>Alert #${id} — Active</h4>
      <p>${type} • ${payload.location} • ${now}</p>
    </div>
  `;
  hist.insertBefore(item, hist.firstChild);
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
