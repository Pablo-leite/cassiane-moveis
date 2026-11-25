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
    const topic = a.dataset.topic;
    a.href = waUrl(topic ? `Olá, Cassiane Móveis! Vim pelo site e gostaria de um orçamento de ${topic}.` : BASE);
    a.addEventListener('click', () => track(a.dataset.wa, topic ? { topic } : {}));
  });

  // some o botão flutuante no rodapé
  const fab = document.querySelector('.fab'), ftr = document.querySelector('.ftr');
  const onScroll = () => fab.classList.toggle('off', scrollY + innerHeight > ftr.offsetTop + 60);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Lightbox
  const items = [...document.querySelectorAll('.g')];
  const lb = document.getElementById('lb'), lbImg = document.getElementById('lbImg'), lbCap = document.getElementById('lbCap'), lbWa = document.getElementById('lbWa');
  let at = 0;
  const show = i => {
    at = (i + items.length) % items.length;
    const it = items[at], img = it.querySelector('img');
    lbImg.src = img.src; lbImg.alt = img.alt; lbCap.textContent = it.dataset.title;
    lbWa.href = waUrl(`Olá, Cassiane Móveis! Vi o projeto "${it.dataset.title}" no site e gostaria de um orçamento de algo parecido.`);
    lbWa.onclick = () => track('lightbox', { project: it.dataset.title });
  };
  items.forEach((it, i) => it.addEventListener('click', () => { show(i); lb.showModal ? lb.showModal() : lb.setAttribute('open', ''); }));
  lb.addEventListener('click', e => {
    if (e.target === lb || e.target.closest('[data-close]')) lb.close();
    else if (e.target.closest('[data-prev]')) show(at - 1);
    else if (e.target.closest('[data-next]')) show(at + 1);
  });
  lb.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') show(at - 1); if (e.key === 'ArrowRight') show(at + 1); });
  let tx = 0;
  lb.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => { const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) show(at + (d < 0 ? 1 : -1)); });

  // Reveal
  const els = document.querySelectorAll('.head, .tile, .about__copy, .about__media, .g, .steps li, .faq__list details');
  if ('IntersectionObserver' in window && !reduce) {
    els.forEach(el => el.classList.add('rv'));
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -6% 0px' });
    els.forEach(el => io.observe(el));
  }
  document.getElementById('ano').textContent = new Date().getFullYear();
})();
