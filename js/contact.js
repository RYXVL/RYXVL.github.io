import { qs } from './utils.js';

export function renderMetadata(meta) {
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