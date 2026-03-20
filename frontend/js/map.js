/* ============================================================
   MAP.JS — Leaflet map for Smart Tourist Safety System
   ============================================================ */

let map, userMarker, userCircle;
const markerGroups = { police: [], hospital: [], danger: [] };
const layerVisible = { self: true, police: true, hospital: true, danger: true };

// ─── Sample POI data ───
const POI_DATA = {
  police: [
    { lat: 0.02, lng: 0.01, name: 'Central Police Station', info: 'Open 24/7 • Emergency: 100', shift: 0 },
    { lat: -0.015, lng: 0.025, name: 'Harbor Police Post', info: 'Open 24/7 • Tourist Desk: 8AM-8PM', shift: 1 },
    { lat: 0.03, lng: -0.02, name: 'City North Police', info: 'Open 24/7 • Emergency: 100', shift: 2 },
  ],
  hospital: [
    { lat: 0.01, lng: -0.015, name: 'City General Hospital', info: '24h Emergency • ☎ 102', shift: 0 },
    { lat: -0.025, lng: -0.01, name: 'Tourist Medical Clinic', info: '24h Service • English spoken', shift: 1 },
    { lat: 0.022, lng: 0.03, name: 'East Medical Center', info: 'Emergency dept • ☎ 102', shift: 2 },
  ],
  danger: [
    { lat: 0.005, lng: 0.02, radius: 300, name: 'High Risk Zone', level: 'HIGH', desc: '3 incidents in last 48h' },
    { lat: -0.018, lng: -0.022, radius: 200, name: 'Moderate Risk Area', level: 'MEDIUM', desc: 'Pickpocket reports' },
    { lat: 0.028, lng: -0.008, radius: 150, name: 'Caution Zone', level: 'LOW', desc: 'Increased vigilance recommended' },
  ]
};

// ─── Custom icon factories ───
function createIcon(emoji, color, size = 36) {
  return L.divIcon({
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:50%;
      background:${color};
      display:flex;align-items:center;justify-content:center;
      font-size:${size * 0.5}px;
      box-shadow:0 4px 12px rgba(0,0,0,0.4);
      border:2px solid rgba(255,255,255,0.3);
    ">${emoji}</div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 4)],
  });
}

const ICONS = {
  user:     createIcon('📍', '#3b82f6', 40),
  police:   createIcon('🚔', '#10b981', 36),
  hospital: createIcon('🏥', '#f59e0b', 36),
};

// ─── Init Map ───
function initMap() {
  const baseCoords = [12.9716, 77.5946]; // Bangalore default

  map = L.map('map', {
    center: baseCoords,
    zoom: 14,
    zoomControl: true,
  });

  // Dark tile layer
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors © CARTO',
    subdomains: 'abcd',
    maxZoom: 20,
  }).addTo(map);

  // Place POIs relative to center
  placePOIs(baseCoords);

  // Add user marker (placeholder)
  addUserMarker(baseCoords[0], baseCoords[1], 'Default Location');

  // Try to get real location
  locateMe();
}

function placePOIs(center) {
  const [baseLat, baseLng] = center;

  // Police
  POI_DATA.police.forEach((p, i) => {
    const lat = baseLat + p.lat;
    const lng = baseLng + p.lng;
    const m = L.marker([lat, lng], { icon: ICONS.police })
      .addTo(map)
      .bindPopup(`<div style="font-family:Inter,sans-serif;min-width:180px;">
        <strong style="color:#10b981;">🚔 ${p.name}</strong><br/>
        <span style="color:#94a3b8;font-size:12px;">${p.info}</span>
        <br/><button onclick="showToast('Navigating to ${p.name}...','info')" style="
          margin-top:8px;padding:4px 10px;background:#3b82f6;color:white;border:none;border-radius:6px;cursor:pointer;font-size:12px;
        ">📍 Navigate</button>
      </div>`);
    markerGroups.police.push(m);
  });

  // Hospitals
  POI_DATA.hospital.forEach((h, i) => {
    const lat = baseLat + h.lat;
    const lng = baseLng + h.lng;
    const m = L.marker([lat, lng], { icon: ICONS.hospital })
      .addTo(map)
      .bindPopup(`<div style="font-family:Inter,sans-serif;min-width:180px;">
        <strong style="color:#f59e0b;">🏥 ${h.name}</strong><br/>
        <span style="color:#94a3b8;font-size:12px;">${h.info}</span>
        <br/><button onclick="showToast('Navigating to ${h.name}...','info')" style="
          margin-top:8px;padding:4px 10px;background:#f59e0b;color:white;border:none;border-radius:6px;cursor:pointer;font-size:12px;
        ">📍 Navigate</button>
      </div>`);
    markerGroups.hospital.push(m);
  });

  // Danger zones
  POI_DATA.danger.forEach(d => {
    const lat = baseLat + d.lat;
    const lng = baseLng + d.lng;
    const color = d.level === 'HIGH' ? '#ef4444' : d.level === 'MEDIUM' ? '#f59e0b' : '#3b82f6';
    const circle = L.circle([lat, lng], {
      radius: d.radius,
      color, fillColor: color, fillOpacity: 0.18,
      weight: 2, dashArray: '6,6',
    }).addTo(map)
      .bindPopup(`<div style="font-family:Inter,sans-serif;min-width:180px;">
        <strong style="color:${color};">⚠️ ${d.name}</strong><br/>
        <span style="background:${color}22;color:${color};padding:2px 8px;border-radius:99px;font-size:11px;font-weight:700;">${d.level} RISK</span><br/>
        <span style="color:#94a3b8;font-size:12px;margin-top:6px;display:block;">${d.desc}</span>
      </div>`);
    markerGroups.danger.push(circle);
  });
}

function addUserMarker(lat, lng, label = 'Your Location') {
  if (userMarker) { map.removeLayer(userMarker); }
  if (userCircle) { map.removeLayer(userCircle); }

  userMarker = L.marker([lat, lng], { icon: ICONS.user, zIndexOffset: 1000 })
    .addTo(map)
    .bindPopup(`<div style="font-family:Inter,sans-serif;">
      <strong style="color:#3b82f6;">📍 You Are Here</strong><br/>
      <span style="color:#94a3b8;font-size:12px;">${label}</span>
    </div>`)
    .openPopup();

  userCircle = L.circle([lat, lng], {
    radius: 80, color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.12, weight: 2,
  }).addTo(map);

  updateRiskDisplay(lat, lng);
}

// ─── Geolocation ───
async function locateMe() {
  const badge = document.getElementById('locationBadge');
  if (badge) badge.textContent = '📍 Locating...';

  try {
    const pos = await getLocation();
    const { lat, lng } = pos;
    map.flyTo([lat, lng], 15, { animate: true, duration: 1.5 });
    addUserMarker(lat, lng, `${lat.toFixed(5)}, ${lng.toFixed(5)}`);

    if (badge) badge.textContent = `📍 ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    const locEl = document.getElementById('locText');
    const coordEl = document.getElementById('coordsText');
    if (locEl) locEl.textContent = 'Location detected via GPS';
    if (coordEl) coordEl.textContent = `Lat: ${lat.toFixed(6)} | Lng: ${lng.toFixed(6)} | Accuracy: ±${Math.round(pos.accuracy)}m`;
    showToast('📍 Location updated!', 'success');

    // Fetch AI risk
    try {
      const risk = await API.getRisk(lat, lng);
      updateRiskDisplay(lat, lng, risk.score);
    } catch { updateRiskDisplay(lat, lng); }

  } catch (err) {
    if (badge) badge.textContent = '⚠️ Location unavailable';
    showToast('Location access denied. Using default location.', 'warning');
    updateRiskDisplay(12.9716, 77.5946);
  }
}

function updateRiskDisplay(lat, lng, score = null) {
  const riskScore = score !== null ? score : Math.floor(Math.random() * 60) + 20;
  const riskBar = document.getElementById('riskBar');
  const riskBadge = document.getElementById('riskBadge');
  const aiTip = document.getElementById('aiTip');

  if (!riskBar) return;

  riskBar.style.width = riskScore + '%';
  if (riskScore > 65) {
    riskBar.style.background = 'var(--danger)';
    if (riskBadge) { riskBadge.className = 'badge badge-danger'; riskBadge.textContent = 'HIGH'; }
    if (aiTip) aiTip.textContent = '⚠️ High risk area detected. Stay on main roads, avoid isolated zones. Consider moving to the nearest police station.';
  } else if (riskScore > 35) {
    riskBar.style.background = 'var(--warning)';
    if (riskBadge) { riskBadge.className = 'badge badge-warning'; riskBadge.textContent = 'MEDIUM'; }
    if (aiTip) aiTip.textContent = '🟡 Moderate risk. Stay alert, keep valuables secure. Police station is 0.8km north.';
  } else {
    riskBar.style.background = 'var(--success)';
    if (riskBadge) { riskBadge.className = 'badge badge-success'; riskBadge.textContent = 'LOW'; }
    if (aiTip) aiTip.textContent = '✅ This area is generally safe. Enjoy your visit! City Center and Main Boulevard have regular police patrols.';
  }
}

// ─── Layer Toggle ───
function toggleLayer(layer) {
  layerVisible[layer] = !layerVisible[layer];
  const btn = document.getElementById('btn' + layer.charAt(0).toUpperCase() + layer.slice(1));
  if (btn) btn.classList.toggle('active', layerVisible[layer]);

  if (layer === 'self') {
    if (userMarker) layerVisible.self ? map.addLayer(userMarker) : map.removeLayer(userMarker);
    if (userCircle) layerVisible.self ? map.addLayer(userCircle) : map.removeLayer(userCircle);
  } else {
    markerGroups[layer].forEach(m => {
      layerVisible[layer] ? map.addLayer(m) : map.removeLayer(m);
    });
  }
}

function flyToMarker(type, index) {
  const m = markerGroups[type][index];
  if (!m) return;
  const latlng = m.getLatLng ? m.getLatLng() : m.getBounds().getCenter();
  map.flyTo(latlng, 16, { animate: true, duration: 1 });
  if (m.openPopup) m.openPopup();
}

// ─── Boot ───
document.addEventListener('DOMContentLoaded', initMap);
