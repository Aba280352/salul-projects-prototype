/* מוכרים דירה?: תהליך מתחלף אוטומטי.
   השלב הפעיל נפתח והתמונה שלו מוצגת. כשהסקשן על המסך קו הזהב מתמלא, ובסופו עוברים לשלב הבא (בלולאה).
   לחיצה על שלב עוברת אליו ומתחילה ממנו. מחוץ למסך הניגון עוצר. בפחות תנועה: בלי ניגון אוטומטי, רק לחיצה.
   עובד גם באלמנטור (אותו מבנה בתוך ווידג'ט HTML). */
(function () {
  Array.prototype.forEach.call(document.querySelectorAll('.sellers'), function (root) {
    var steps = Array.prototype.slice.call(root.querySelectorAll('.step'));
    var imgs = Array.prototype.slice.call(root.querySelectorAll('.sellers__stage img'));
    var count = root.querySelector('.sellers__count');
    if (!steps.length) return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var current = 0;

    var show = function (i) {
      var prev = current;
      current = i;
      steps.forEach(function (s, n) {
        s.classList.toggle('is-active', n === i);
        s.classList.toggle('is-done', n < i);
        s.querySelector('.step__btn').setAttribute('aria-expanded', n === i ? 'true' : 'false');
      });
      // התמונה הקודמת נשארת מתחת, והחדשה נחשפת מעליה מלמטה למעלה.
      // החשיפה מתחילה תמיד מאפס, גם אם התמונה כבר הייתה גלויה (למשל לחיצה חזרה על השלב הקודם)
      imgs.forEach(function (img, n) {
        img.classList.toggle('is-prev', n === prev && n !== i);
        img.classList.toggle('is-active', n === i);
      });
      var next = imgs[i];
      if (next && prev !== i) {
        next.style.transition = 'none'; next.style.clipPath = 'inset(100% 0 0 0)'; next.style.transform = 'scale(1.12)';
        void next.offsetWidth;
        next.style.transition = ''; next.style.clipPath = ''; next.style.transform = '';
      }
      if (count) count.textContent = ('0' + (i + 1)).slice(-2) + ' / ' + ('0' + steps.length).slice(-2);
      // מאפס את אנימציית הקו כדי שתתחיל מחדש
      var bar = steps[i].querySelector('.step__bar span');
      if (bar) { bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = ''; }
    };

    steps.forEach(function (s, n) {
      s.querySelector('.step__btn').addEventListener('click', function () { show(n); });
      var bar = s.querySelector('.step__bar span');
      if (bar) bar.addEventListener('animationend', function () { if (n === current) show((current + 1) % steps.length); });
    });

    // כל תמונות הבמה נטענות מראש, כדי שהחשיפה בלחיצה תציג תמונה מוכנה ולא ריקה
    imgs.forEach(function (img) { img.loading = 'eager'; });
    root.classList.add('is-ready');
    show(0);

    if (reduce || !('IntersectionObserver' in window)) return;
    new IntersectionObserver(function (entries) {
      root.classList.toggle('is-playing', entries[0].isIntersecting);
    }, { threshold: 0.35 }).observe(root);
  });
})();
