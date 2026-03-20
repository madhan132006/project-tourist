/* ============================================================
   API.JS — REST API helper for Smart Tourist Safety System
   ============================================================ */

const API_BASE = 'http://localhost:8080/api';

const API = {

  // ─── REQUEST HELPER ───
  async request(method, path, body = null, headers = {}) {
    const opts = {
      method,
      headers: { 'Content-Type': 'application/json', ...headers },
    };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(API_BASE + path, opts);
    if (!res.ok) {
      const err = await res.text().catch(() => 'Request failed');
      throw new Error(err);
    }
    return res.json().catch(() => ({}));
  },

  // ─── TOURIST ───
  register: (data) => API.request('POST', '/register', data),
  login: (email, password) => API.request('POST', '/login', { email, password }),
  getProfile: () => API.request('GET', '/profile'),
  getSafetyScore: () => API.request('GET', '/safety-score'),

  // ─── INCIDENTS ───
  getIncidents: () => API.request('GET', '/incidents'),
  reportIncident: (data) => API.request('POST', '/incidents', data),

  // ─── EMERGENCY ───
  triggerSOS: (data) => API.request('POST', '/emergency', data),
  getAlerts: () => API.request('GET', '/emergency'),
  updateAlertStatus: (id, status) => API.request('PUT', `/emergency/${id}/status`, { status }),

  // ─── AI ───
  chat: (message, context = []) => API.request('POST', '/ai/chat', { message, context }),
  getRisk: (lat, lng) => API.request('GET', `/ai/risk?lat=${lat}&lng=${lng}`),

  // ─── BLOCKCHAIN ───
  getBlockchain: () => API.request('GET', '/blockchain/records'),
  addBlock: (data) => API.request('POST', '/blockchain/record', data),
  verifyChain: () => API.request('GET', '/blockchain/verify'),

  // ─── DASHBOARD ───
  getDashboardStats: () => API.request('GET', '/dashboard/stats'),
};

// ─── MOCK DATA (used when backend is offline) ───
const MOCK = {
  safetyScore: {
    score: 87, country: '🌍 United States', phone: '+1 202-555-0173',
    status: 'SAFE', message: 'Your area is currently low risk.'
  },

  incidents: [
    { id: 1, type: 'Pickpocket', location: 'Market Street', riskLevel: 'HIGH', timestamp: new Date(Date.now()-86400000).toISOString() },
    { id: 2, type: 'Lost Tourist', location: 'Harbor Area', riskLevel: 'MEDIUM', timestamp: new Date(Date.now()-172800000).toISOString() },
    { id: 3, type: 'Medical Emergency', location: 'Park Avenue', riskLevel: 'LOW', timestamp: new Date(Date.now()-259200000).toISOString() },
    { id: 4, type: 'Scam Alert', location: 'Tourist Street', riskLevel: 'HIGH', timestamp: new Date(Date.now()-345600000).toISOString() },
  ],

  alerts: [
    { id: 47, type: 'Medical', location: 'City Center', status: 'RESOLVED', createdAt: new Date(Date.now()-518400000).toISOString() },
    { id: 31, type: 'Scam Report', location: 'Market Street', status: 'RESOLVED', createdAt: new Date(Date.now()-864000000).toISOString() },
  ],

  blockchain: generateMockChain(7),

  aiResponses: {
    default: [
      "Based on current safety data, I recommend staying in well-lit, tourist-frequented areas. Avoid Zone B (Market District) after 10 PM — there have been 3 pickpocket incidents in the last 48 hours.",
      "The safest route to City Center is via Main Boulevard — it has police patrol coverage every 15 minutes. I'd avoid the Harbor Back Alley due to a recent scam alert.",
      "Always keep a copy of your passport and emergency contacts. For immediate help dial 100 (Police) or 102 (Ambulance). You can also use the SOS button in this app for instant location-based alerts.",
      "Current risk level in your area: **LOW** ✅. Safety Score: 87/100. No active incidents within 1km of your location.",
      "I recommend visiting police station #3 at City Center for any non-emergency reports. They have a dedicated Tourist Assistance Desk (TAD) open 08:00–20:00.",
    ]
  }
};

// Generate mock blockchain
function generateMockChain(n) {
  const chain = [];
  const types = ['INCIDENT', 'EMERGENCY', 'SAFETY_LOG', 'FRAUD'];
  const locations = ['City Center', 'Harbor Area', 'Market Street', 'Park Avenue', 'Tourist District'];
  const descs = [
    'Pickpocket incident reported near shopping zone',
    'Medical emergency — tourist assistance provided',
    'Scam attempt via fake tour operator',
    'Lost tourist — guided to nearest police station',
    'Emergency SOS alert — authorities dispatched',
    'Suspicious activity reported, patrol increased',
    'Tourist safely escorted to hotel',
  ];
  let prevHash = '0'.repeat(64);
  for (let i = 0; i < n; i++) {
    const ts = new Date(Date.now() - (n - i) * 3600000 * 8 - Math.random() * 3600000).toISOString();
    const data = {
      type: types[Math.floor(Math.random() * types.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      description: descs[Math.floor(Math.random() * descs.length)],
      touristId: Math.floor(Math.random() * 5000 + 1000),
    };
    const hash = simpleHash(`${i}${prevHash}${ts}${JSON.stringify(data)}`).padEnd(64, 'a');
    chain.push({ index: i, hash, previousHash: prevHash, timestamp: ts, data, recordType: data.type });
    prevHash = hash;
  }
  return chain;
}
