import { qs, esc } from './utils.js';

export function renderCerts(certs) {
  const root = qs('#certs-root');
  if (!root) return;

  if (!certs || certs.length === 0) {
    root.innerHTML = '<p style="color:rgba(255,255,255,0.4);margin-top:2rem;">No certifications found.</p>';
    return;
  }

  // Group certs by their "group" field, preserving insertion order
  const groups = {};
  for (const cert of certs) {
    const key = cert.group || 'Other';
    if (!groups[key]) groups[key] = [];
    groups[key].push(cert);
  }

  let html = '';
  let cardIndex = 0;

  for (const [groupName, groupCerts] of Object.entries(groups)) {
    html += `<p class="cert-group-label">${esc(groupName)}</p>`;
    html += `<div class="cert-grid">`;

    for (const cert of groupCerts) {
      html += buildCertCard(cert, cardIndex * 60);
      cardIndex++;
    }

    html += `</div>`;
  }

  root.innerHTML = html;
}

function buildCertCard(cert, animDelay) {
  const themeClass  = `cert-theme-${esc(cert.theme || 'google')}`;
  const isPlaceholder = !cert.verifyUrl || cert.verifyUrl.includes('your-link-here');

  return `
    <div class="cert-card" style="animation-delay:${animDelay}ms">
      <div class="cert-card-top">
        <div class="cert-issuer-badge">
          <div class="cert-issuer-dot ${themeClass}">${esc(cert.issuerShort || '?')}</div>
          <span class="cert-issuer-name">${esc(cert.issuer)}</span>
        </div>
        <span class="cert-verified-pill">Verified</span>
      </div>
      <hr class="cert-card-divider" />
      <p class="cert-name">${esc(cert.name)}</p>
      <div class="cert-card-footer">
        <span class="cert-meta">${esc(cert.platform)} · ${esc(cert.year)}</span>
        ${isPlaceholder
          ? `<span class="cert-link-pending">Link pending</span>`
          : `<a class="cert-link" href="${esc(cert.verifyUrl)}" target="_blank" rel="noopener">View cert →</a>`
        }
      </div>
    </div>
  `;
}