(() => {
  const WA_NUMBER = '5567981292953'; // (67) 98129-2953
  const BASE = 'Olá, Cassiane Móveis! Vim pelo site e gostaria de um orçamento de móveis planejados.';
  const waUrl = t => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(t)}`;
  const track = (where, extra = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'whatsapp_click', cta_location: where, ...extra });
    if (typeof window.fbq === 'function') window.fbq('track', 'Contact', { content_name: where });
    if (typeof window.gtag === 'function') window.gtag('event', 'generate_lead', { method: 'whatsapp', cta_location: where });
  };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-wa]').forEach(a => {
    a.href = waUrl(BASE);
    a.addEventListener('click', () => track(a.dataset.wa));
  });

  // Header / FAB
  const top = document.querySelector('.top'), fab = document.querySelector('.fab'), foot = document.querySelector('.foot');
  const hero = document.querySelector('.hero');
  const onScroll = () => {
    const y = scrollY;
    top.classList.toggle('is-solid', y > Math.min(hero.offsetHeight - 120, 500));
    fab.classList.toggle('on', y > 600);
    fab.classList.toggle('off', y + innerHeight > foot.offsetTop + 80);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Painéis do hero (hover/clique + rotação automática)
  const panels = [...document.querySelectorAll('.panel')];
  let cur = 0, timer = null, paused = false;
  const open = i => { cur = i; panels.forEach((p, k) => p.classList.toggle('is-open', k === i)); };
  panels.forEach((p, i) => {
    p.addEventListener('mouseenter', () => { paused = true; open(i); });
    p.addEventListener('click', () => open(i));
  });
  document.getElementById('panels').addEventListener('mouseleave', () => { paused = false; });
  if (!reduce) timer = setInterval(() => { if (!paused && !document.hidden) open((cur + 1) % panels.length); }, 3800);

  // Abas de ambientes
  const ROOMS = [
    { t: 'Cozinhas planejadas', d: 'Armários até o teto, torre de forno e bancadas pensadas para a sua rotina.', imgs: ['cozinha-cinza', 'cozinha-verde'], cta: 'Orçar minha cozinha', topic: 'cozinha planejada' },
    { t: 'Quartos e closets', d: 'Guarda-roupas, closets com LED e cabeceiras que aproveitam cada centímetro.', imgs: ['closet', 'dormitorio-guarda-roupa'], cta: 'Orçar meu quarto', topic: 'quarto / closet' },
    { t: 'Salas e painéis de TV', d: 'Painéis ripados, racks e home theater com acabamento de alto padrão.', imgs: ['home-theater', 'painel-led'], cta: 'Orçar minha sala', topic: 'sala / painel de TV' },
    { t: 'Áreas sociais e comerciais', d: 'Cristaleiras e áreas gourmet para casa, e balcões e mesas de reunião para empresas.', imgs: ['cristaleira', 'cozinha-azul'], cta: 'Orçar meu projeto', topic: 'área social / espaço comercial' },
  ];
  const pics = document.getElementById('roomPics'), title = document.getElementById('roomTitle'), text = document.getElementById('roomText');
  const cta = document.getElementById('roomCta'), ctaTxt = document.getElementById('roomCtaTxt');
  const tabs = [...document.querySelectorAll('.tab')];
  const setRoom = i => {
    const r = ROOMS[i];
    tabs.forEach((t, k) => { t.classList.toggle('is-on', k === i); t.setAttribute('aria-selected', k === i); });
    pics.innerHTML = r.imgs.map(n => `<figure><img src="../img/${n}.jpg" alt="${r.t}" width="960" height="1280"></figure>`).join('');
    title.textContent = r.t; text.textContent = r.d; ctaTxt.textContent = r.cta;
    cta.href = waUrl(`Olá, Cassiane Móveis! Vim pelo site e gostaria de um orçamento de ${r.topic}.`);
    cta.onclick = () => track('ambiente', { topic: r.topic });
  };
  tabs.forEach((t, i) => t.addEventListener('click', () => setRoom(i)));
  setRoom(0);
  // pré-carrega fotos das abas
  ROOMS.flatMap(r => r.imgs).forEach(n => { const im = new Image(); im.src = `../img/${n}.jpg`; });

  // Reveal
  const els = document.querySelectorAll('.head, .rooms__grid, .about__img, .about__copy, .flow__list li, .close__copy, .chat');
  if ('IntersectionObserver' in window && !reduce) {
    els.forEach(el => el.classList.add('rv'));
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach(el => io.observe(el));
  }
  document.getElementById('ano').textContent = new Date().getFullYear();
})();
