import { qs, qsAll, formatDateRange } from './utils.js';

export function renderExperience(experience) {
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

export function initSwiper() {
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