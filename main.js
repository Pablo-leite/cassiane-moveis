(() => {
  // ===== Config =====
  const WA_NUMBER = '5567981292953'; // (67) 98129-2953
  const MSG = {
    base: 'Olá, Cassiane Móveis! Vim pelo site e gostaria de um orçamento de móveis planejados.',
    topic: t => `Olá, Cassiane Móveis! Vim pelo site e gostaria de um orçamento de ${t}.`,
    project: p => `Olá, Cassiane Móveis! Vi o projeto "${p}" no site e gostaria de algo nessa linha.`,
  };
  const waUrl = text => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
  const track = (where, extra = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'whatsapp_click', cta_location: where, ...extra });
    if (typeof window.fbq === 'function') window.fbq('track', 'Contact', { content_name: where });
    if (typeof window.gtag === 'function') window.gtag('event', 'generate_lead', { method: 'whatsapp', cta_location: where });
  };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-wa]').forEach(a => {
    const topic = a.dataset.topic;
    a.href = waUrl(topic ? MSG.topic(topic) : MSG.base);
    a.addEventListener('click', () => track(a.dataset.wa, topic ? { topic } : {}));
  });

  // ===== Header: solid after hero, hide on scroll down =====
  const hdr = document.querySelector('.hdr');
  const fab = document.querySelector('.wa-fab');
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY;
    hdr.classList.toggle('is-solid', y > innerHeight * 0.75);
    hdr.classList.toggle('is-hidden', y > lastY && y > innerHeight);
    fab.classList.toggle('on', y > innerHeight * 0.6);
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // ===== Services hover preview =====
  const prev = document.getElementById('svcPreview');
  const prevImg = prev.querySelector('img');
  if (matchMedia('(hover:hover) and (min-width:861px)').matches) {
    let tx = 0, ty = 0, cx = 0, cy = 0, raf;
    const loop = () => { cx += (tx - cx) * 0.14; cy += (ty - cy) * 0.14; prev.style.left = cx + 'px'; prev.style.top = cy + 'px'; raf = requestAnimationFrame(loop); };
    document.querySelectorAll('#svc a').forEach(a => {
      a.addEventListener('mouseenter', e => { prevImg.src = a.dataset.img; tx = cx = e.clientX; ty = cy = e.clientY; prev.classList.add('on'); cancelAnimationFrame(raf); loop(); });
      a.addEventListener('mousemove', e => { tx = e.clientX + 170; ty = e.clientY; });
      a.addEventListener('mouseleave', () => { prev.classList.remove('on'); setTimeout(() => cancelAnimationFrame(raf), 400); });
    });
  }

  // ===== Portfolio filter =====
  const grid = document.getElementById('grid');
  const items = [...grid.querySelectorAll('.w')];
  document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(x => { x.classList.toggle('is-on', x === t); x.setAttribute('aria-pressed', x === t); });
    const f = t.dataset.f;
    grid.classList.toggle('is-filtered', f !== 'all');
    items.forEach(it => it.classList.toggle('is-hidden', f !== 'all' && it.dataset.cat !== f));
  }));

  // ===== Lightbox =====
  const lb = document.getElementById('lb');
  const lbImg = document.getElementById('lbImg'), lbCap = document.getElementById('lbCap'), lbTag = document.getElementById('lbTag'), lbWa = document.getElementById('lbWa');
  let cur = 0;
  const vis = () => items.filter(i => !i.classList.contains('is-hidden'));
  const show = i => {
    const list = vis(); cur = (i + list.length) % list.length;
    const it = list[cur], img = it.querySelector('img');
    lbImg.src = img.src; lbImg.alt = img.alt; lbCap.textContent = it.dataset.title; lbTag.textContent = it.dataset.tag;
    lbWa.href = waUrl(MSG.project(it.dataset.title));
    lbWa.onclick = () => track('lightbox', { project: it.dataset.title });
  };
  items.forEach(it => it.addEventListener('click', () => { show(vis().indexOf(it)); lb.showModal ? lb.showModal() : lb.setAttribute('open', ''); }));
  lb.addEventListener('click', e => {
    if (e.target === lb || e.target.closest('[data-close]')) lb.close();
    else if (e.target.closest('[data-prev]')) show(cur - 1);
    else if (e.target.closest('[data-next]')) show(cur + 1);
  });
  lb.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') show(cur - 1); if (e.key === 'ArrowRight') show(cur + 1); });
  let sx = 0;
  lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => { const d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 50) show(cur + (d < 0 ? 1 : -1)); });

  // ===== Brief → WhatsApp =====
  document.getElementById('briefForm').addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const amb = fd.getAll('amb'), fase = fd.get('fase');
    const nome = (fd.get('nome') || '').trim(), bairro = (fd.get('bairro') || '').trim();
    const lines = [`Olá, Cassiane Móveis!${nome ? ` Meu nome é ${nome}.` : ''} Vim pelo site e gostaria de um orçamento.`];
    if (amb.length) lines.push(`• Ambientes: ${amb.join(', ')}`);
    if (fase) lines.push(`• Imóvel: ${fase}`);
    if (bairro) lines.push(`• Local: ${bairro}`);
    lines.push('Posso enviar fotos e medidas por aqui.');
    track('formulario', { ambientes: amb.join('|'), fase: fase || '' });
    window.open(waUrl(lines.join('\n')), '_blank', 'noopener');
  });

  // ===== Reveal =====
  const els = document.querySelectorAll('.rv, .w, .facts>div, .svc li');
  if ('IntersectionObserver' in window && !reduce) {
    els.forEach(el => el.classList.add('rv'));
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -10% 0px' });
    els.forEach(el => io.observe(el));
  } else els.forEach(el => el.classList.add('in'));

  document.getElementById('ano').textContent = new Date().getFullYear();
})();
