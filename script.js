// ---------------- Active nav link & footer year ----------------
(function(){
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();

// ---------------- Mobile nav toggle ----------------
(function(){
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if(!toggle || !links) return;

  function setState(expanded){
    toggle.setAttribute('aria-expanded', String(expanded));
    links.classList.toggle('show', expanded);
  }

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    setState(!expanded);
  });

  // Close on link click (for single page)
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => setState(false));
  });
})();

// ---------------- Smooth scroll for in-page anchors -------------
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    // Skip modal triggers
    if (a.hasAttribute('data-modal-open')) return;
    const href = a.getAttribute('href');
    if (href && href.length > 1) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// ---------------- Contact form handler (front-end only) --------
const form = document.getElementById('contactForm');
if (form) {
  const note = document.getElementById('formNote');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get('name')||'').trim();
    const email = (data.get('email')||'').trim();
    const message = (data.get('message')||'').trim();

    if (!name || !email || !message) {
      if (note) {
        note.textContent = 'Please complete the required fields.';
        note.style.color = '#b45309'; // amber-700
      }
      return;
    }

    if (note) {
      note.textContent = 'Thanks! Connect a form service to deliver emails to Info@skinbeauti.co.za.';
      note.style.color = '#047857'; // emerald-700
    }
    form.reset();
  });
}

// ---------------- Booking buttons → prefill + scroll ------------
document.querySelectorAll('[data-book]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const service = (btn.getAttribute('data-book') || '').trim();
    const message = document.getElementById('message');
    const contact = document.querySelector('#contact');
    if (service && message) {
      message.value = `I would like to book ${service}.`;
    }
    if (contact) {
      e.preventDefault();
      contact.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ---------------- Testimonials tap enlarge (mobile) -------------
(function(){
  const quotes = document.querySelectorAll('.quote');
  if (!quotes.length) return;
  const isTouch = matchMedia('(hover: none)').matches;
  if (!isTouch) return;
  quotes.forEach(q => {
    q.addEventListener('click', () => q.classList.toggle('enlarged'));
  });
})();

// ===================== Modals (Privacy / Terms) =====================
(function(){
  const body = document.body;
  const openers = document.querySelectorAll('[data-modal-open]');
  let lastFocused = null;

  function getFocusable(container){
    return Array.from(container.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )).filter(el => !el.hasAttribute('inert') && !el.closest('[inert]'));
  }

  function openModal(id){
    const modal = document.getElementById('modal-' + id);
    if (!modal) return;

    lastFocused = document.activeElement;
    modal.classList.add('open');
    modal.removeAttribute('aria-hidden');
    body.classList.add('no-scroll');

    const focusables = getFocusable(modal);
    if (focusables.length) focusables[0].focus();

    function trap(e){
      if (!modal.classList.contains('open')) {
        modal.removeEventListener('keydown', trap);
        return;
      }
      if (e.key !== 'Tab') return;
      const list = getFocusable(modal);
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    modal.addEventListener('keydown', trap);
  }

  function closeModal(modal){
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    body.classList.remove('no-scroll');
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  // Open
  openers.forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      openModal(el.getAttribute('data-modal-open'));
    });
  });

  // Close (delegation)
  document.addEventListener('click', e => {
    if (e.target.classList && e.target.classList.contains('modal') && e.target.classList.contains('open')) {
      closeModal(e.target);
      return;
    }
    const closer = e.target.closest('[data-modal-close]');
    if (closer) {
      const modal = closer.closest('.modal');
      closeModal(modal);
    }
  });

  // ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.open').forEach(closeModal);
    }
  });
})();

// ---------------- Active nav on scroll (one-page) ---------------
(function(){
  const links = Array.from(document.querySelectorAll('nav a[href^="#"]'));
  if (!('IntersectionObserver' in window) || links.length === 0) return;

  const map = new Map();
  links.forEach(link => {
    const id = link.getAttribute('href');
    const sec = document.querySelector(id);
    if (sec) map.set(sec, link);
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(({isIntersecting, target}) => {
      const link = map.get(target);
      if (!link) return;
      if (isIntersecting) {
        links.forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, {rootMargin:'-40% 0px -50% 0px', threshold:0.01});

  map.forEach((_, sec) => obs.observe(sec));
})();

// ---------------- Back to top button ----------------
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

// ---------------- Back to top button ----------------