const DATA = {
  metadata:   './data/metadata.json?v=2',
  skills:     './data/skills.json?v=2',
  experience: './data/experience.json?v=2',
  portfolio:  './data/portfolio.json?v=2',
  certs:      './data/certs.json?v=2',
};

export async function loadAll() {
  const pairs = await Promise.all(
    Object.entries(DATA).map(async ([k, url]) => [k, await (await fetch(url)).json()])
  );
  return Object.fromEntries(pairs);
}