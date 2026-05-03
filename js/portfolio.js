import { qs, slugify } from './utils.js';

export function renderPortfolio(portfolio) {
  const track = qs('.card-container');
  const cardWidth = 270; // card width (250) + gap (20)

  const makeCard = (p) => {
    const id = p.id || slugify(p.name);
    const a = document.createElement('a');
    a.href = `project.html?id=${id}`;
    a.className = 'card-link';
    a.innerHTML = `
      <div class="card">
        <img src="${p.thumbnail_path}" alt="${p.name}">
        <div class="card-title">${p.name}</div>
      </div>`;
    return a;
  };

  const total      = portfolio.length;
  const cloneCount = Math.min(total, 4);

  const endClones   = portfolio.slice(-cloneCount).map(makeCard);
  const realCards   = portfolio.map(makeCard);
  const startClones = portfolio.slice(0, cloneCount).map(makeCard);

  [...endClones, ...realCards, ...startClones].forEach(el => track.appendChild(el));

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setPos(false);
    });
  });

  let current = cloneCount;
  const setPos = (animate) => {
    track.style.transition = animate ? 'transform 0.5s ease' : 'none';
    track.style.transform  = `translateX(-${current * cardWidth}px)`;
  };
  setPos(false);

  const next = () => { current++; setPos(true); };
  const prev = () => { current--; setPos(true); };

  track.addEventListener('transitionend', () => {
    if (current >= total + cloneCount) {
      current = cloneCount;
      setPos(false);
    } else if (current < cloneCount) {
      current = total + cloneCount - 1;
      setPos(false);
    }
  });

  qs('.carousel-btn-prev').onclick = prev;
  qs('.carousel-btn-next').onclick = next;

  setInterval(next, 3000);
}