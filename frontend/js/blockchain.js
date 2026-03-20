/* ============================================================
   BLOCKCHAIN.JS — Blockchain log for Smart Tourist Safety System
   ============================================================ */

let chain = [];

// ─── Render chain ───
async function loadBlockchain() {
  const chainEl = document.getElementById('blockchainChain');
  if (!chainEl) return;
  chainEl.innerHTML = '<div class="spinner"></div>';

  try {
    const data = await API.getBlockchain();
    chain = Array.isArray(data) ? data : [];
  } catch {
    chain = MOCK.blockchain || generateLocalChain(7);
  }

  renderChain();
  updateStats();
}

function renderChain() {
  const chainEl = document.getElementById('blockchainChain');
  if (!chainEl) return;
  chainEl.innerHTML = '';

  if (!chain.length) {
    chainEl.innerHTML = '<div class="text-center text-muted" style="padding:3rem;">No blockchain records found.</div>';
    return;
  }

  chain.forEach((block, idx) => {
    // Connector (skip first)
    if (idx > 0) {
      const connector = document.createElement('div');
      connector.className = 'chain-connector';
      connector.innerHTML = `<span class="chain-link-icon">⛓️</span><span>Linked to Block #${block.index - 1}</span>`;
      chainEl.appendChild(connector);
    }

    const isGenesis = block.index === 0;
    const typeColor = getTypeColor(block.recordType || block.data?.type);
    const typeBadge = getTypeBadge(block.recordType || block.data?.type);

    const blockEl = document.createElement('div');
    blockEl.className = `block-item ${isGenesis ? 'genesis' : ''}`;
    blockEl.style.animationDelay = `${idx * 0.08}s`;

    const ts = new Date(block.timestamp);
    const timeStr = ts.toLocaleString('en', { dateStyle: 'medium', timeStyle: 'short' });

    blockEl.innerHTML = `
      <div class="block-header">
        <div class="block-number">
          <div class="block-num-badge">Block #${block.index}</div>
          ${isGenesis ? '<span class="badge badge-success">Genesis</span>' : ''}
          ${typeBadge}
        </div>
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <span class="text-xs text-muted">⏱️ ${timeStr}</span>
          <button class="btn btn-ghost btn-sm" onclick="expandBlock(${block.index})" aria-label="Toggle block details">⊕</button>
        </div>
      </div>
      <div class="block-body" id="blockBody${block.index}">
        <div>
          <div class="block-field-label">🔑 Hash</div>
          <span class="hash-text">${block.hash ? block.hash.substring(0,32) + '...' : '—'}</span>
        </div>
        <div>
          <div class="block-field-label">🔗 Previous Hash</div>
          <span class="hash-text">${block.previousHash === '0'.repeat(64) || block.previousHash === '0' ? '0'.repeat(16) + ' (Genesis)' : (block.previousHash || '—').substring(0,32) + '...'}</span>
        </div>
        <div>
          <div class="block-field-label">📋 Incident Type</div>
          <span class="text-sm" style="color:${typeColor};">${block.data?.type || block.recordType || '—'}</span>
        </div>
        <div>
          <div class="block-field-label">📍 Location</div>
          <span class="text-sm text-secondary">${block.data?.location || '—'}</span>
        </div>
        <div style="grid-column:1/-1;">
          <div class="block-field-label">📝 Data</div>
          <span class="text-sm text-secondary">${block.data?.description || JSON.stringify(block.data || {}).substring(0,120)}</span>
        </div>
        <div style="grid-column:1/-1;">
          <div class="block-field-label">🆔 Tourist ID</div>
          <span class="text-xs font-mono text-muted">${block.data?.touristId || '—'}</span>
        </div>
      </div>
    `;
    chainEl.appendChild(blockEl);
  });
}

function expandBlock(index) {
  const body = document.getElementById(`blockBody${index}`);
  if (!body) return;
  // Already visible — toggle grid-column count for detail view
  const isExpanded = body.style.gridTemplateColumns === '1fr';
  body.style.gridTemplateColumns = isExpanded ? '1fr 1fr' : '1fr';
}

function updateStats() {
  const el = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
  el('blockCount', chain.length);
  el('validCount', chain.length); // all valid in demo
  el('incidentCount', chain.filter(b => b.data?.type === 'INCIDENT' || b.recordType === 'INCIDENT').length || chain.length);
  const last = chain[chain.length - 1];
  if (last) {
    const t = new Date(last.timestamp);
    el('lastBlock', t.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }));
  }
}

// ─── Add Block ───
async function addBlock() {
  const type = document.getElementById('recType')?.value || 'INCIDENT';
  const location = document.getElementById('recLocation')?.value || 'Unknown';
  const data = document.getElementById('recData')?.value || '';

  if (!data.trim()) { showToast('Please enter incident data', 'error'); return; }

  const btn = event.target;
  setLoading(btn, true);

  const lastBlock = chain[chain.length - 1];
  const prevHash = lastBlock ? lastBlock.hash : '0'.repeat(64);
  const index = chain.length;
  const timestamp = new Date().toISOString();
  const blockData = {
    type, location, description: data,
    touristId: localStorage.getItem('touristId') || 'DEMO-001'
  };
  const hash = generateBlockHash(index, prevHash, timestamp, blockData).padEnd(64, simpleHash(timestamp).slice(0,4));

  const newBlock = { index, hash, previousHash: prevHash, timestamp, data: blockData, recordType: type };

  try {
    const res = await API.addBlock(newBlock);
    newBlock.id = res.id || index;
  } catch { /* use local */ }

  chain.push(newBlock);
  if (document.getElementById('recLocation')) document.getElementById('recLocation').value = '';
  if (document.getElementById('recData')) document.getElementById('recData').value = '';

  setLoading(btn, false);
  renderChain();
  updateStats();
  showToast('🔗 Block added to blockchain!', 'success');

  // Scroll to new block
  setTimeout(() => {
    const chainEl = document.getElementById('blockchainChain');
    if (chainEl) chainEl.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 200);
}

// ─── Verify chain integrity ───
async function verifyChain() {
  const resultEl = document.getElementById('verifyResult');
  if (!resultEl) return;
  resultEl.style.display = 'none';

  const btn = event.target;
  setLoading(btn, true);
  await new Promise(r => setTimeout(r, 1200));
  setLoading(btn, false);

  try {
    const res = await API.verifyChain();
    showVerifyResult(res.valid !== false, res.message);
  } catch {
    // Local verification
    let valid = true;
    let failMsg = '';
    for (let i = 1; i < chain.length; i++) {
      if (chain[i].previousHash !== chain[i-1].hash) {
        valid = false;
        failMsg = `Block #${i} has invalid previous hash`;
        break;
      }
    }
    showVerifyResult(valid, failMsg);
  }
}

function showVerifyResult(valid, message) {
  const resultEl = document.getElementById('verifyResult');
  if (!resultEl) return;
  resultEl.className = `verify-result ${valid ? 'verify-valid' : 'verify-invalid'}`;
  resultEl.innerHTML = `
    <span>${valid ? '✅' : '❌'}</span>
    <span>${valid ? `All ${chain.length} blocks verified — Chain intact!` : `Chain integrity failed: ${message}`}</span>
  `;

  document.getElementById('chainStatus').textContent = valid ? '✅ Chain Valid' : '❌ Chain Invalid';
  document.getElementById('chainStatus').className = `badge badge-${valid ? 'success' : 'danger'}`;

  showToast(valid ? '✅ Blockchain integrity verified!' : '❌ Chain tampered — alert raised!', valid ? 'success' : 'error');
}

function getTypeColor(type) {
  const colors = { INCIDENT: '#ef4444', EMERGENCY: '#f59e0b', SAFETY_LOG: '#10b981', FRAUD: '#8b5cf6' };
  return colors[type] || '#94a3b8';
}

function getTypeBadge(type) {
  const badges = {
    INCIDENT: 'badge-danger', EMERGENCY: 'badge-warning',
    SAFETY_LOG: 'badge-success', FRAUD: 'badge-purple'
  };
  return type ? `<span class="badge ${badges[type] || 'badge-primary'}">${type}</span>` : '';
}

// Generate fallback chain
function generateLocalChain(n) {
  return MOCK?.blockchain || [];
}

// ─── Init ───
document.addEventListener('DOMContentLoaded', loadBlockchain);
