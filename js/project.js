import { qs, slugify } from './utils.js';

export async function renderProjectPage() {
  const id   = new URLSearchParams(location.search).get('id');
  const data = await (await fetch('./data/portfolio.json?v=2')).json();
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