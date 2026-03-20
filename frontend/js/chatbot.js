/* ============================================================
   CHATBOT.JS — AI Safety Chatbot for Smart Tourist Safety System
   ============================================================ */

const chatHistory = [];
let isTyping = false;

// ─── Knowledge Base ───
const KB = [
  {
    patterns: ['danger', 'avoid', 'unsafe', 'risky', 'zone', 'area'],
    response: `⚠️ **Current Danger Zones:**\n\n🔴 **High Risk:** Market District (Zone B) — 3 pickpocket incidents in 48h. Avoid after 10 PM.\n🟡 **Moderate:** Harbor Back Alley — Scam reports. Stay on main road.\n🟢 **Safe Zones:** City Center, Main Boulevard, Tourist Square.\n\n*Tip: Enable location tracking for real-time alerts.*`
  },
  {
    patterns: ['hospital', 'medical', 'doctor', 'ambulance', 'injured', 'sick', 'hurt'],
    response: `🏥 **Nearest Medical Facilities:**\n\n1. **City General Hospital** — 1.2km North\n   - 24h Emergency Dept • ☎ 102\n2. **Tourist Medical Clinic** — 2.8km West\n   - English-speaking staff • 24h\n3. **East Medical Center** — 3.5km East\n   - Full ICU • ☎ 102\n\n**Emergency:** Dial **102** immediately for ambulance.`
  },
  {
    patterns: ['police', 'crime', 'robbery', 'stolen', 'theft', 'report'],
    response: `🚔 **Police Assistance:**\n\n**Nearest Stations:**\n1. Central Police Station — 0.8km • ☎ 100\n2. Harbor Police Post — 2.1km • Tourist Desk\n3. City North Police — 2.9km\n\n**If Robbed:**\n• Stay calm, don't resist\n• Note description of offender\n• Call 100 or use SOS button\n• Visit nearest station to file FIR\n• Contact your embassy if passport stolen`
  },
  {
    patterns: ['route', 'safe', 'path', 'walk', 'travel', 'go', 'navigate', 'way'],
    response: `🗺️ **Safe Route Recommendations:**\n\n✅ **Main Boulevard** — Highest safety rating, 24h CCTV, police patrol every 15 min\n✅ **Tourist Avenue** — Dedicated tourist-safe zone, multilingual signage\n✅ **City Center via North Gate** — Well-lit, busy, lower crime\n\n❌ **Avoid:** Harbor Back Alley, Old Market Lane after 9 PM\n\n*Open the Live Map for real-time route visualization →*`
  },
  {
    patterns: ['emergency', 'sos', 'help', 'urgent', 'danger', 'fear', 'afraid'],
    response: `🆘 **EMERGENCY RESPONSE:**\n\n**Immediate Steps:**\n1. 🔴 Press the **SOS Button** in the Emergency tab\n2. 📞 Call **100** (Police) or **102** (Ambulance)\n3. 📍 Share your location with authorities\n4. 🏃 Move to a public, well-lit area\n5. 💬 Stay on the line with emergency services\n\n**Your location will be automatically sent** when you trigger SOS. Help will arrive in ~4 minutes average.`
  },
  {
    patterns: ['scam', 'fraud', 'cheat', 'fake', 'tourist trap', 'overcharge'],
    response: `⚠️ **Common Tourist Scams & Prevention:**\n\n🎭 **Fake tour operators** — Only book through verified agencies\n💎 **Gem/jewelry scams** — Avoid unsolicited "good deals"\n🚕 **Taxi overcharging** — Use app-based taxis, agree on price first\n📸 **Photo scams** — Be wary of strangers insisting to take photos\n💰 **Fake charity** — Don't give money to aggressive collectors\n\n*Report any scam attempt to police (100) or via the incident report feature.*`
  },
  {
    patterns: ['embassy', 'consulate', 'passport', 'visa', 'lost passport'],
    response: `🌐 **Embassy & Consulate Assistance:**\n\nIf you've lost your passport or need consular help:\n\n1. **Report to local police first** and get an FIR copy\n2. **Contact your embassy** immediately\n3. **Apply for emergency travel document**\n\nCommon embassy numbers:\n🇺🇸 US Citizens: +1-888-407-4747\n🇬🇧 UK Citizens: +44-20-7008-1500\n🇦🇺 AU Citizens: +61-2-6261-3305\n\n*Ask AI for your specific country's embassy contact.*`
  },
  {
    patterns: ['tip', 'advice', 'safety', 'recommend', 'suggest', 'guide'],
    response: `🛡️ **Top Tourist Safety Tips:**\n\n1. 📱 Always carry a charged phone with this app\n2. 📄 Keep backup copies of all documents\n3. 💳 Use cards instead of large cash amounts\n4. 🌙 Avoid walking alone at night in unfamiliar areas\n5. 📷 Don't display expensive electronics publicly\n6. 🗺️ Download offline maps before exploring\n7. 🏨 Inform your hotel of your daily plans\n8. 🔗 Your blockchain safety ID is proof of identity\n\n*Stay safe and enjoy your trip!* ✈️`
  },
  {
    patterns: ['number', 'phone', 'contact', 'call', 'dial'],
    response: `📞 **Emergency Phone Numbers:**\n\n🚔 **Police Emergency:** 100\n🏥 **Ambulance:** 102\n🔥 **Fire Brigade:** 101\n🌍 **Tourist Helpline:** 1800-XXX-XXXX\n🏨 **Hotel Security:** Check hotel card\n👮 **Tourist Police:** 1363\n\n*Save these numbers offline. The SOS button sends your location automatically.*`
  },
  {
    patterns: ['score', 'rating', 'safe', 'risk level', 'my score'],
    response: `🤖 **Your Safety Score Analysis:**\n\n📊 **Current Score: 87/100** ✅\n\n**Score Factors:**\n- ✅ Registered & verified profile (+20)\n- ✅ Emergency contacts set (+15)\n- ✅ Location sharing enabled (+10)\n- ✅ No active alerts (+25)\n- 🟡 Visited 1 moderate-risk zone (-10)\n- ✅ Blockchain ID active (+15)\n\n**Score improves when you:** Stay in safe zones, keep profile updated, respond to alerts promptly.`
  },
];

const FALLBACK_RESPONSES = [
  `I'm analyzing your query... Based on current safety data, I recommend exercising normal tourist caution in your area. The Live Map shows current risk zones. Is there something specific I can help with? 🛡️`,
  `Great question! For the most accurate safety information, I'd suggest checking the Live Map for real-time updates. Always trust your instincts — if something feels wrong, move to a populated area and alert authorities. 🚔`,
  `Your safety is my priority! Remember you can trigger SOS at any time for immediate assistance. For route guidance, check the Live Map which shows police stations, hospitals, and danger zones in real-time. 📍`,
];

// ─── Message Rendering ───
function addMessage(text, sender = 'bot', animate = true) {
  const container = document.getElementById('chatMessages');
  if (!container) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-message ${sender}`;

  const avatar = sender === 'bot'
    ? `<div class="chat-avatar bot">🤖</div>`
    : `<div class="chat-avatar user-av">👤</div>`;

  // Convert markdown-ish formatting
  const html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');

  msgDiv.innerHTML = `
    ${sender === 'bot' ? avatar : ''}
    <div class="chat-bubble">${html}</div>
    ${sender === 'user' ? avatar : ''}
  `;

  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;

  chatHistory.push({ role: sender === 'user' ? 'user' : 'assistant', content: text });
}

function showTypingIndicator() {
  const container = document.getElementById('chatMessages');
  if (!container || isTyping) return;
  isTyping = true;

  const div = document.createElement('div');
  div.className = 'chat-message bot';
  div.id = 'typingIndicator';
  div.innerHTML = `
    <div class="chat-avatar bot">🤖</div>
    <div class="typing-indicator">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function removeTypingIndicator() {
  const ind = document.getElementById('typingIndicator');
  if (ind) ind.remove();
  isTyping = false;
}

// ─── AI Response Logic ───
function getBotResponse(message) {
  const lower = message.toLowerCase();
  for (const entry of KB) {
    if (entry.patterns.some(p => lower.includes(p))) {
      return entry.response;
    }
  }
  return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
}

async function processMessage(text) {
  showTypingIndicator();
  const delay = 900 + Math.random() * 800;

  await new Promise(r => setTimeout(r, delay));
  removeTypingIndicator();

  let response;
  try {
    const res = await API.chat(text, chatHistory.slice(-6));
    response = res.response || res.message || getBotResponse(text);
  } catch {
    response = getBotResponse(text);
  }

  addMessage(response, 'bot');
}

// ─── User Send ───
async function sendMessage() {
  const input = document.getElementById('chatInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text || isTyping) return;

  input.value = '';
  input.style.height = 'auto';
  addMessage(text, 'user');
  await processMessage(text);
}

function sendChip(btn) {
  const text = btn.textContent.trim();
  const input = document.getElementById('chatInput');
  if (input) input.value = text;
  sendMessage();
}

function sendQuick(text) {
  const input = document.getElementById('chatInput');
  if (input) { input.value = text; sendMessage(); }
}

function handleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

function clearChat() {
  const container = document.getElementById('chatMessages');
  if (container) container.innerHTML = '';
  chatHistory.length = 0;
  showWelcome();
}

// ─── Welcome ───
function showWelcome() {
  setTimeout(() => {
    addMessage(`👋 **Hello! I'm SafeGuard AI** — your 24/7 tourist safety assistant.\n\nI can help you with:\n• 🗺️ Safe routes & navigation\n• ⚠️ Danger zone alerts\n• 🏥 Finding hospitals & police\n• 🆘 Emergency procedures\n• 💡 Travel safety tips\n\nWhat can I help you with today?`, 'bot');
  }, 600);
}

// ─── Init ───
document.addEventListener('DOMContentLoaded', () => {
  showWelcome();
});
