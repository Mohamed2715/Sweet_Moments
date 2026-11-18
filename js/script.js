/* Sweet Moments - minimal vanilla JavaScript interactions */
'use strict';
document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('copyright-year');
  if (year) year.textContent = new Date().getFullYear();
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.getElementById('primary-nav');
  if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      navigation.classList.toggle('is-open', open);
    });
    navigation.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navigation.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
    }));
    document.addEventListener('keydown', e => { if(e.key === 'Escape'){ navigation.classList.remove('is-open'); menuButton.setAttribute('aria-expanded','false'); } });
  }
  // Riyadh time zone prevents the date from changing with the viewer's location.
  const currentDate = document.getElementById('current-date');
  if (currentDate) currentDate.textContent = new Intl.DateTimeFormat('en-GB', { weekday:'short', day:'numeric', month:'short', year:'numeric', timeZone:'Asia/Riyadh' }).format(new Date());
  const galleryFilterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryFilterButtons.forEach(btn => btn.addEventListener('click', () => {
    galleryFilterButtons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
    btn.classList.add('active');btn.setAttribute('aria-pressed','true');
    galleryItems.forEach(item => { item.hidden = btn.dataset.filter !== 'all' && item.dataset.category !== btn.dataset.filter; });
  }));
  const lightbox = document.getElementById('lightbox');
  if (lightbox && typeof lightbox.showModal === 'function') {
    document.querySelectorAll('.gallery-open').forEach(btn => btn.addEventListener('click', () => {
      const image = lightbox.querySelector('img');
      image.src = btn.dataset.img;
      image.alt = btn.dataset.caption;
      document.getElementById('lightbox-caption').textContent = btn.dataset.caption;
      lightbox.showModal();
    }));
    lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
    lightbox.addEventListener('click', e => { if(e.target === lightbox) lightbox.close(); });
  }
  const form = document.getElementById('cake-order-form');
  if (form) {
    const dateInput = document.getElementById('event-date');
    const ymd = new Intl.DateTimeFormat('en-CA', { timeZone:'Asia/Riyadh', year:'numeric', month:'2-digit', day:'2-digit' }).format(new Date());
    // Format parts explicitly, since locale-specific formatting can vary by browser.
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone:'Asia/Riyadh', year:'numeric', month:'2-digit', day:'2-digit' }).formatToParts(new Date());
    const get = type => parts.find(part => part.type === type).value;
    dateInput.min = `${get('year')}-${get('month')}-${get('day')}`;
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const name = String(data.get('fullName')).trim();
      const thankYouName = document.getElementById('thank-you-name');
      thankYouName.textContent = name.split(/\s+/)[0];
      const orderSummary = document.getElementById('order-summary');
      orderSummary.replaceChildren();
      const fields = [['Treat', data.get('cakeType')], ['Size', data.get('cakeSize')], ['Event date', data.get('eventDate')], ['Theme', data.get('theme') || 'Not specified']];
      fields.forEach(([label,value]) => { const dt = document.createElement('dt');dt.textContent=label;const dd = document.createElement('dd');dd.textContent=String(value);orderSummary.append(dt,dd); });
      form.hidden = true;
      const success = document.getElementById('form-success'); success.hidden = false;
      success.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',block:'center'});
    });
    document.getElementById('new-request').addEventListener('click', () => { form.reset(); form.hidden=false; document.getElementById('form-success').hidden=true; document.getElementById('full-name').focus(); });
  }
});
