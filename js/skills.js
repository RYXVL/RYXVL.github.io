import { qs } from './utils.js';

export function renderSkills(rows) {
  qs('.image-rows').innerHTML =
    rows.map(r => `
      <div class="image-row" style="width:${r.image_row_width}">
        ${r.skills.map(s => `<img src="${s.image_path}" alt="${s.image_text}" />`).join('')}
      </div>
    `).join('') +
    `<div class="section-3-disclaimer">
       <div class="section-3-disclaimer-emoji">⚠️</div>
       <b>Disclaimer:</b> Every single tool, language, or technology listed here is etched into my brain forever.
       Do I remember exactly how they all work? Of course... after a quick visit to Stack Overflow.
       Skills listed are based on real-life usage; memory recall subject to caffeine availability, moon phase, and internet speed.
     </div>`;
}