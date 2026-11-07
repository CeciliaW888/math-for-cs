const CACHE_NAME = 'math-for-cs-v1';
const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./offline.html",
  "./manifest.json",
  "./styles.css",
  "./main.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-192-maskable.png",
  "./icons/icon-512-maskable.png",
  "./icons/apple-touch-icon.png",
  "./modules/01-predicates-sets-proofs.html",
  "./modules/02-contradiction-induction.html",
  "./modules/03-casework-strong-induction.html",
  "./modules/04-state-machines.html",
  "./modules/05-sums.html",
  "./modules/06-asymptotics.html",
  "./modules/07-recurrences.html",
  "./modules/08-divisibility.html",
  "./modules/09-modular-arithmetic.html",
  "./modules/10-cryptography.html",
  "./modules/11-graphs-coloring.html",
  "./modules/12-matching.html",
  "./modules/13-connectivity-trees.html",
  "./modules/14-digraphs-dags.html",
  "./modules/15-relations-counting.html",
  "./modules/16-counting-techniques.html",
  "./modules/17-more-counting-techniques.html",
  "./modules/18-probability.html",
  "./modules/19-conditional-probability.html",
  "./modules/20-independence.html",
  "./modules/21-random-variables.html",
  "./modules/22-expectation.html",
  "./modules/23-expectation-variance.html",
  "./modules/24-large-deviations.html",
  "./data/flashcards.json",
  "./data/quiz-01.json",
  "./data/quiz-02.json",
  "./data/quiz-03.json",
  "./data/quiz-04.json",
  "./data/quiz-05.json",
  "./data/quiz-06.json",
  "./data/quiz-07.json",
  "./data/quiz-08.json",
  "./data/quiz-09.json",
  "./data/quiz-10.json",
  "./data/quiz-11.json",
  "./data/quiz-12.json",
  "./data/quiz-13.json",
  "./data/quiz-14.json",
  "./data/quiz-15.json",
  "./data/quiz-16.json",
  "./data/quiz-17.json",
  "./data/quiz-18.json",
  "./data/quiz-19.json",
  "./data/quiz-20.json",
  "./data/quiz-21.json",
  "./data/quiz-22.json",
  "./data/quiz-23.json",
  "./data/quiz-24.json",
  "./diagrams/01-predicates-sets-proofs.svg",
  "./diagrams/02-contradiction-induction.svg",
  "./diagrams/03-casework-strong-induction.svg",
  "./diagrams/04-state-machines.svg",
  "./diagrams/05-sums.svg",
  "./diagrams/06-asymptotics.svg",
  "./diagrams/07-recurrences.svg",
  "./diagrams/08-divisibility.svg",
  "./diagrams/09-modular-arithmetic.svg",
  "./diagrams/10-cryptography.svg",
  "./diagrams/11-graphs-coloring.svg",
  "./diagrams/12-matching.svg",
  "./diagrams/13-connectivity-trees.svg",
  "./diagrams/14-digraphs-dags.svg",
  "./diagrams/15-relations-counting.svg",
  "./diagrams/16-counting-techniques.svg",
  "./diagrams/17-more-counting-techniques.svg",
  "./diagrams/18-probability.svg",
  "./diagrams/19-conditional-probability.svg",
  "./diagrams/20-independence.svg",
  "./diagrams/21-random-variables.svg",
  "./diagrams/22-expectation.svg",
  "./diagrams/23-expectation-variance.svg",
  "./diagrams/24-large-deviations.svg"
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(PRECACHE_URLS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(names.filter(n => n.startsWith('math-for-cs-') && n !== CACHE_NAME).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Network-first for HTML so lesson updates show up immediately.
  if (req.mode === 'navigate' || url.pathname.endsWith('.html')) {
    event.respondWith((async () => {
      try {
        const resp = await fetch(req);
        if (resp.ok) { const cache = await caches.open(CACHE_NAME); cache.put(req, resp.clone()); }
        return resp;
      } catch (e) {
        const cached = await caches.match(req);
        if (cached) return cached;
        // Only full-page navigations get offline.html; a module fetch getting it would be
        // injected into the accordion as if it were lesson content.
        if (req.mode === 'navigate') return caches.match('./offline.html');
        return new Response('', { status: 503, statusText: 'Offline' });
      }
    })());
    return;
  }

  // Cache-first for static assets (CSS, JS, JSON, SVG, icons, fonts).
  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    try {
      const resp = await fetch(req);
      if (resp.ok && (resp.type === 'basic' || resp.type === 'cors')) {
        const cache = await caches.open(CACHE_NAME); cache.put(req, resp.clone());
      }
      return resp;
    } catch (e) {
      return new Response('', { status: 503, statusText: 'Offline' });
    }
  })());
});
