(function () {
  var header = document.getElementById('site-header');
  if (!header) return;
  var toggle = header.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');
  var desktop = window.matchMedia('(min-width: 1025px)');
  var subItems = Array.prototype.slice.call(header.querySelectorAll('.nav__item--sub'));

  function setNav(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'סגירת התפריט' : 'פתיחת התפריט');
    document.documentElement.style.overflow = open ? 'hidden' : '';
  }

  function setSub(item, open) {
    item.classList.toggle('is-open', open);
    var btn = item.querySelector('.nav__sub-btn');
    if (btn) btn.setAttribute('aria-expanded', String(open));
  }

  function closeSubs(except) {
    subItems.forEach(function (item) { if (item !== except) setSub(item, false); });
  }

  toggle.addEventListener('click', function () {
    setNav(toggle.getAttribute('aria-expanded') !== 'true');
  });

  subItems.forEach(function (item) {
    var btn = item.querySelector('.nav__sub-btn');
    btn.addEventListener('click', function () {
      var willOpen = !item.classList.contains('is-open');
      closeSubs(item);
      setSub(item, willOpen);
    });
  });

  document.addEventListener('click', function (e) {
    if (!header.contains(e.target)) { closeSubs(); if (!desktop.matches) setNav(false); }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    closeSubs();
    if (toggle.getAttribute('aria-expanded') === 'true') { setNav(false); toggle.focus(); }
  });

  nav.addEventListener('click', function (e) {
    if (e.target.closest('a') && !desktop.matches) setNav(false);
  });

  desktop.addEventListener('change', function () { setNav(false); closeSubs(); });
})();
