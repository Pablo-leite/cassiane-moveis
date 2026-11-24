(() => {
  // ===== Config =====
  const WA_NUMBER = '5567981292953'; // (67) 98129-2953
  const MSG = {
    base: 'Olá, Cassiane Móveis! Vim pelo site e gostaria de um orçamento de móveis planejados.',
    project: p => `Olá, Cassiane Móveis! Vi o projeto "${p}" no site e gostaria de um orçamento de algo parecido.`,
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
    a.href = waUrl(MSG.base);
    a.addEventListener('click', () => track(a.dataset.wa));
  });

  // ===== Header + FAB =====
  const hdr = document.querySelector('.hdr');
  const fab = document.querySelector('.fab');
  const hero = document.querySelector('.hero');

  // ===== Trena: números + movimento com o scroll =====
  const track$ = document.querySelector('.tape__track');
  for (let cm = 0; cm <= 300; cm += 5) {
    const s = document.createElement('span');
    s.textContent = cm;
    if (cm % 10 === 0) { s.style.left = (cm * 10) + 'px'; if (cm % 50 === 0) s.className = 'r'; track$.appendChild(s); }
  }
  track$.style.width = '3020px';

  const onScroll = () => {
    const y = scrollY;
    hdr.classList.toggle('is-solid', y > hero.offsetHeight - 90);
    fab.classList.toggle('on', y > 500);
    fab.classList.toggle('off', y + innerHeight > document.querySelector('.ftr').offsetTop + 80);
    if (!reduce) track$.style.transform = `translateX(${-(y * 0.35) % 1000}px)`;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // ===== Carrossel de projetos =====
  const rail = document.getElementById('rail');
  const cards = [...rail.querySelectorAll('.p')];
  const cur = document.getElementById('wCur');
  const prev = document.getElementById('wPrev'), next = document.getElementById('wNext');
  document.getElementById('wTot').textContent = String(cards.length).padStart(2, '0');
  const step = () => cards[0].getBoundingClientRect().width + 20;
  const update = () => {
    const i = Math.round(rail.scrollLeft / step());
    cur.textContent = String(Math.min(i + 1, cards.length)).padStart(2, '0');
    prev.disabled = rail.scrollLeft < 4;
    next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4;
  };
  rail.addEventListener('scroll', update, { passive: true }); update();
  prev.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }));
  next.addEventListener('click', () => rail.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' }));
  rail.addEventListener('keydown', e => { if (e.key === 'ArrowRight') next.click(); if (e.key === 'ArrowLeft') prev.click(); });

  // arrastar com o mouse
  let down = false, sx = 0, sl = 0, moved = false;
  rail.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft; });
  addEventListener('pointermove', e => { if (!down) return; const d = e.clientX - sx; if (Math.abs(d) > 5) { moved = true; rail.classList.add('is-drag'); } rail.scrollLeft = sl - d; });
  addEventListener('pointerup', () => { if (!down) return; down = false; rail.classList.remove('is-drag'); });

  // ===== Lightbox =====
  const lb = document.getElementById('lb');
  const lbImg = document.getElementById('lbImg'), lbCap = document.getElementById('lbCap'), lbTag = document.getElementById('lbTag'), lbWa = document.getElementById('lbWa');
  let at = 0;
  const show = i => {
    at = (i + cards.length) % cards.length;
    const c = cards[at], img = c.querySelector('img');
    lbImg.src = img.src; lbImg.alt = img.alt; lbCap.textContent = c.dataset.title;
    lbTag.textContent = `Ref. ${String(at + 1).padStart(2, '0')} · ${c.dataset.tag}`;
    lbWa.href = waUrl(MSG.project(c.dataset.title));
    lbWa.onclick = () => track('lightbox', { project: c.dataset.title });
  };
  cards.forEach((c, i) => c.addEventListener('click', e => {
    if (moved) { e.preventDefault(); moved = false; return; }
    show(i); lb.showModal ? lb.showModal() : lb.setAttribute('open', '');
  }));
  lb.addEventListener('click', e => {
    if (e.target === lb || e.target.closest('[data-close]')) lb.close();
    else if (e.target.closest('[data-prev]')) show(at - 1);
    else if (e.target.closest('[data-next]')) show(at + 1);
  });
  lb.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') show(at - 1); if (e.key === 'ArrowRight') show(at + 1); });
  let tx = 0;
  lb.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => { const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) show(at + (d < 0 ? 1 : -1)); });

  // ===== Reveal =====
  const els = document.querySelectorAll('.title, .story__copy p, .story__media, .specs li, .steps li, .cta__copy');
  if ('IntersectionObserver' in window && !reduce) {
    els.forEach(el => el.classList.add('rv'));
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach(el => io.observe(el));
  }

  document.getElementById('ano').textContent = new Date().getFullYear();
})();
