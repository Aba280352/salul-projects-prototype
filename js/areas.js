/* גרסה 2: אזורי פעילות. אזור אחד פתוח בכל רגע; לחיצה על נקודה במפה פותחת את הכרטיס שלה, וריחוף על כרטיס מדגיש את הנקודה. */
(function () {
  var s = document.querySelector('.areas');
  if (!s) return;
  var cards = [].slice.call(s.querySelectorAll('.areas__card'));
  var pins = [].slice.call(s.querySelectorAll('.areas__pin'));
  var byId = function (list, id) { return list.filter(function (el) { return el.dataset.area === id; })[0]; };

  function open(id, fromMap) {
    cards.forEach(function (c) {
      var on = c.dataset.area === id && !(c.classList.contains('is-open') && !fromMap);
      c.classList.toggle('is-open', on);
      c.querySelector('.areas__card-btn').setAttribute('aria-expanded', on ? 'true' : 'false');
    });
    pins.forEach(function (p) { p.classList.toggle('is-active', p.dataset.area === id && byId(cards, id).classList.contains('is-open')); });
    if (fromMap && window.matchMedia('(max-width: 1024px)').matches) {
      var c = byId(cards, id);
      c && c.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  cards.forEach(function (c) {
    c.querySelector('.areas__card-btn').addEventListener('click', function () { open(c.dataset.area, false); });
    c.addEventListener('mouseenter', function () { var p = byId(pins, c.dataset.area); p && p.classList.add('is-hot'); });
    c.addEventListener('mouseleave', function () { var p = byId(pins, c.dataset.area); p && p.classList.remove('is-hot'); });
  });
  pins.forEach(function (p) {
    p.addEventListener('click', function () { open(p.dataset.area, true); });
    p.addEventListener('mouseenter', function () { var c = byId(cards, p.dataset.area); c && c.classList.add('is-hot'); });
    p.addEventListener('mouseleave', function () { var c = byId(cards, p.dataset.area); c && c.classList.remove('is-hot'); });
  });
  var first = cards.filter(function (c) { return c.classList.contains('is-open'); })[0];
  if (first) byId(pins, first.dataset.area).classList.add('is-active');

  if (!('IntersectionObserver' in window)) return;
  s.classList.add('is-ready');
  var io = new IntersectionObserver(function (e) {
    if (e[0].isIntersecting) { s.classList.add('is-in'); io.disconnect(); }
  }, { threshold: 0.15 });
  io.observe(s);
})();
