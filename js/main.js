import { loadAll }        from './data.js';
import { renderMetadata } from './contact.js';
import { renderSkills }   from './skills.js';
import { renderExperience, initSwiper } from './experience.js';
import { renderPortfolio } from './portfolio.js';
import { renderCerts }    from './certs.js';

async function init() {
  const { metadata, skills, experience, portfolio, certs } = await loadAll();
  renderMetadata(metadata);
  renderSkills(skills);
  renderExperience(experience);
  initSwiper();
  renderPortfolio(portfolio);
  renderCerts(certs);
}

init();