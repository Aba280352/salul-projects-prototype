/* גלילה חלקה ואיטית (Lenis 1.1.13, מקומי). רק לגלגלת העכבר ולמשטח המגע במחשב; במגע בטלפון הגלילה נשארת טבעית.
   הדף נגלל באמת (גלילה רגילה של החלון), ולכן אירועי גלילה, קישורים לעוגנים ו-SEO לא מושפעים.
   בפחות תנועה, או בלי הספרייה, הגלילה נשארת רגילה. עובד גם באלמנטור. */
(function () {
  if (!window.Lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var lenis = new Lenis({
    duration: 1.6,
    easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
    wheelMultiplier: 0.85,
    smoothWheel: true
  });
  window.salulLenis = lenis;

  var raf = function (time) { lenis.raf(time); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);

  // קישורים לעוגן באותו עמוד: גלילה חלקה עד היעד, בהתחשב בגובה ההדר
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href').length < 2) return;
    var target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    var header = document.querySelector('.site-header, .salul-header');
    lenis.scrollTo(target, { offset: header ? -header.offsetHeight : 0 });
  });
})();
