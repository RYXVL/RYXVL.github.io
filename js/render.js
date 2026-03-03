const DATA = {
  metadata:   './data/metadata.json',
  skills:     './data/skills.json',
  experience: './data/experience.json',
  portfolio:  './data/portfolio.json',
};

async function loadAll() {
  const pairs = await Promise.all(
    Object.entries(DATA).map(async ([k, url]) => [k, await (await fetch(url)).json()])
  );
  return Object.fromEntries(pairs);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const qs    = s => document.querySelector(s);
const qsAll = s => document.querySelectorAll(s);

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function formatDateRange(startMonth, startYear, endMonth, endYear) {
  const end = endMonth === 'Present' ? 'Present' : `${endMonth} '${endYear}`;
  return `${startMonth} '${startYear} - ${end}`;
}

// ─── Renderers ────────────────────────────────────────────────────────────────

function renderMetadata(meta) {
  const btn = qs('.resume-button');
  if (btn) btn.onclick = () => window.open(meta.resume, '_blank');

  const contactConfig = {
    linkedin: {
      icon:  'images/contacts/linkedin.svg',
      label: meta.linkedin.replace('https://www.linkedin.com/in/', '').replace('/', ''),
      url:   meta.linkedin,
      desc:  "This is where I speedrun job applications."
    },
    email: {
      icon:  'images/contacts/email.svg',
      label: meta.email,
      url:   null,
      desc:  "This is where I am exposed to the vast majority of rejection templates."
    },
    github: {
      icon:  'images/contacts/github.svg',
      label: meta.github.replace('https://github.com/', ''),
      url:   meta.github,
      desc:  "This is where I code so good, even I don't know what it does anymore."
    }
  };

  qs('.contact-container').innerHTML = Object.values(contactConfig).map(c => `
    <div class="contact-card">
      <div class="face face1">
        <div class="contact-content">
          <div class="icon">
            <img src="${c.icon}" alt="" height="20px" width="20px">
          </div>
        </div>
      </div>
      <div class="face face2">
        <div class="contact-content">
          <h3>${c.url
            ? `<a href="${c.url}" target="_blank" class="contact-anchor">${c.label}</a>`
            : c.label
          }</h3>
          <p>${c.desc}</p>
        </div>
      </div>
    </div>
  `).join('');
}

function renderSkills(rows) {
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

function renderExperience(experience) {
  qs('.swiper-wrapper').innerHTML = experience.map(e => {
    const year = formatDateRange(e.startMonth, e.startYear, e.endMonth, e.endYear);
    return `
      <div class="swiper-slide"
           style="background-image:url(${e.background_image_path})"
           data-year="${year}">
        <div class="swiper-slide-content">
          <span class="timeline-year">${year}</span>
          <h4 class="timeline-title">${e.company}</h4>
          <h4 class="timeline-role">${e.role}</h4>
          <p class="timeline-text">${e.description}</p>
        </div>
      </div>
    `;
  }).join('');
}

function renderPortfolio(portfolio) {
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

  // Render: [clones of end] + [real cards] + [clones of start]
  const total = portfolio.length;
  const cloneCount = Math.min(total, 4); // how many to clone each side

  const endClones   = portfolio.slice(-cloneCount).map(makeCard);
  const realCards   = portfolio.map(makeCard);
  const startClones = portfolio.slice(0, cloneCount).map(makeCard);

  [...endClones, ...realCards, ...startClones].forEach(el => track.appendChild(el));

  // Start position = just after the end clones
  let current = cloneCount;
  const setPos = (animate) => {
    track.style.transition = animate ? 'transform 0.5s ease' : 'none';
    track.style.transform  = `translateX(-${current * cardWidth}px)`;
  };
  setPos(false);

  const next = () => {
    current++;
    setPos(true);
  };
  const prev = () => {
    current--;
    setPos(true);
  };

  // After transition ends, silently jump if we're in clone territory
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

  // Auto-rotate every 3 seconds
  setInterval(next, 3000);
}

// ─── Swiper (init after slides are injected) ──────────────────────────────────

function initSwiper() {
  new Swiper(".timeline .swiper-container", {
    direction: "vertical",
    loop: false,
    speed: 1600,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      renderBullet(index, cls) {
        const year = qsAll(".swiper-slide")[index]?.getAttribute("data-year") ?? '';
        return `<span class="${cls}">${year}</span>`;
      }
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    }
  });
}

// ─── Project page (project.html?id=…) ────────────────────────────────────────

async function renderProjectPage() {
  const id   = new URLSearchParams(location.search).get('id');
  const data = await (await fetch('./data/portfolio.json')).json();
  const p    = data.find(x => (x.id || slugify(x.name)) === id);

  if (!p) {
    document.body.innerHTML = '<p style="color:white;text-align:center;margin-top:4rem">Project not found.</p>';
    return;
  }

  // Inject the project's own CSS
  const link = document.createElement('link');
  link.rel  = 'stylesheet';
  link.href = p.css;
  document.head.appendChild(link);

  document.title                       = p.name;
  qs('.project-title').textContent     = p.name;
  qs('.project-image').src             = p.thumbnail_path;
  qs('.project-image').alt             = p.name;
  qs('.project-description').innerHTML = `<p>${p.description}</p>`;

  const linkWrap = qs('.project-link-wrapper');
  if (p.private_repo) {
    linkWrap.innerHTML = `<h4 style="text-align:center;animation:pulse 3s infinite">
      Code can be shared on request. Repository is private as per university requirements.
    </h4>`;
  } else if (p.link) {
    linkWrap.innerHTML = `<a href="${p.link}" class="project-link" target="_blank">GitHub Link</a>`;
  }
}

// ─── Entry point ─────────────────────────────────────────────────────────────

async function init() {
  if (document.body.classList.contains('project-page-body')) {
    await renderProjectPage();
    return;
  }
  const { metadata, skills, experience, portfolio } = await loadAll();
  renderMetadata(metadata);
  renderSkills(skills);
  renderExperience(experience);
  initSwiper();
  renderPortfolio(portfolio);
}

init();