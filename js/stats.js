/* מונים רצים וקווים מתרחבים בסקשן המספרים.
   1. כשהסקשן נכנס למסך התאים נדלקים אחד אחרי השני והמספרים נספרים לאט מ-0 עד הערך שלהם. הטקסט האמיתי ב-HTML לא משתנה אף פעם (SEO): הספירה מוצגת ב-::after דרך data-n.
   2. הקו הזהב מתחת לכל מספר מתרחב תוך כדי גלילה (משתנה --line-p מ-0 עד 1 על הסקשן, וה-CSS מחשב ממנו את הרוחב).
   מי שביקש פחות תנועה, או בלי JS, רואה את המספר הסופי והקו הקצר מיד. עובד גם עם ווידג'ט המונה של אלמנטור (מספר התחלה = מספר סיום). */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // ---------- ספירה והדלקה ----------
  // כשהסקשן נכנס למסך, המספרים נספרים אחד אחרי השני והמספר בכל תא נספר לאט מ-0
  var DUR = 3200, STAGGER = 350;
  var run = function (el) {
    var to = parseInt(el.textContent, 10) || 0, t0 = null;
    var step = function (t) {
      if (t0 === null) t0 = t;
      var p = Math.min((t - t0) / DUR, 1);
      el.setAttribute('data-n', Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step); else el.classList.remove('is-counting');
    };
    requestAnimationFrame(step);
  };
  var groups = Array.prototype.slice.call(document.querySelectorAll('.stats, .salul-stats'));
  if (groups.length && 'IntersectionObserver' in window) {
    groups.forEach(function (g) {
      var cells = Array.prototype.slice.call(g.querySelectorAll('.stats__item, .salul-stats__item'));
      cells.forEach(function (c) {
        var n = c.querySelector('.stats__count, .elementor-counter-number');
        if (n && parseInt(n.textContent, 10) > 0) { n.setAttribute('data-n', '0'); n.classList.add('is-counting'); }
      });
      var io = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        cells.forEach(function (c, i) {
          setTimeout(function () {
            c.classList.add('is-lit');
            var n = c.querySelector('.is-counting');
            if (n) run(n);
          }, i * STAGGER);
        });
      }, { threshold: 0.35 });
      io.observe(g);
    });
  }

  // ---------- קווים שמתרחבים בגלילה ----------
  var sections = Array.prototype.slice.call(document.querySelectorAll('.stats, .salul-stats'));
  if (!sections.length) return;
  var ticking = false;
  var update = function () {
    ticking = false;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    sections.forEach(function (s) {
      // 0 כשהסקשן רק נכנס מלמטה, 1 כשהוא כבר בחלק העליון של המסך
      var p = (0.92 * vh - s.getBoundingClientRect().top) / (0.62 * vh);
      s.style.setProperty('--line-p', Math.max(0, Math.min(1, p)).toFixed(3));
    });
  };
  var onScroll = function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
