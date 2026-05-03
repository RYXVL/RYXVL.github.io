export const qs    = s => document.querySelector(s);
export const qsAll = s => document.querySelectorAll(s);

export function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function formatDateRange(startMonth, startYear, endMonth, endYear) {
  const end = endMonth === 'Present' ? 'Present' : `${endMonth} '${endYear}`;
  return `${startMonth} '${startYear} - ${end}`;
}

export function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}