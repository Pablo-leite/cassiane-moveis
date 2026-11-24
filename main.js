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

  document.querySelectorAll('[data-wa]').forEach(a => {
    a.href = waUrl(MSG.base);
    a.addEventListener('click', () => track(a.dataset.wa));
  });

  // ===== Header shadow + mobile bar =====
  const header = document.querySelector('.header');
  const mbar = document.querySelector('.mbar');
  const onScroll = () => {
    header.classList.toggle('is-scrolled', scrollY > 8);
    mbar.classList.toggle('on', scrollY > 520);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // ===== Floating bubble once =====
  const fl = document.querySelector('.wa-float');
  setTimeout(() => { fl.classList.add('show'); setTimeout(() => fl.classList.remove('show'), 5000); }, 5000);

  // ===== Gallery filter =====
  const gallery = document.getElementById('gallery');
  const items = [...gallery.querySelectorAll('.g')];
  document.querySelectorAll('.filter').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(x => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', x === b); });
    const f = b.dataset.f;
    gallery.classList.toggle('is-filtered', f !== 'all');
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

  // ===== Reveal =====
  const els = document.querySelectorAll('.head, .story__media, .story__copy, .g, .steps li, .final__box');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach(el => el.classList.add('rv'));
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach(el => io.observe(el));
  }

  document.getElementById('ano').textContent = new Date().getFullYear();
})();
