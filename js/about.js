/* למה הר סלול: תנועה צמודה לגלילה.
   1. הכותרת האנגלית היא שורה אינסופית: הפריט משוכפל עד שהוא רחב מהמסך, והמיקום נגזר מהגלילה ונסגר במודולו אורך פריט אחד,
      כך שהיא זזה בלי סוף וחוזרת על עצמה בלי תפר, תמיד בזמן גלילה (למעלה ולמטה).
   2. --about-reveal (0 עד 1): התמונה נחשפת מלמעלה למטה כשהיא עולה מתחתית המסך.
   בלי JS או בפחות תנועה הכל מוצג סטטי. עובד גם באלמנטור. */
(function () {
  var roots = Array.prototype.slice.call(document.querySelectorAll('.about'));
  if (!roots.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var clamp = function (v) { return Math.max(0, Math.min(1, v)); };
  var SPEED = 0.55; // כמה פיקסלים השורה זזה על כל פיקסל גלילה
  var ticking = false, state = [];

  var build = function () {
    state = roots.map(function (root) {
      var track = root.querySelector('.about__track');
      if (!track) return { root: root };
      Array.prototype.forEach.call(track.querySelectorAll('.is-clone'), function (c) { c.remove(); });
      var kids = Array.prototype.slice.call(track.children);
      var setW = kids.reduce(function (w, k) {
        var cs = getComputedStyle(k), r = k.getBoundingClientRect();
        return w + r.width + (parseFloat(cs.marginLeft) || 0) + (parseFloat(cs.marginRight) || 0);
      }, 0);
      var n = setW ? Math.ceil(root.clientWidth / setW) + 1 : 0;
      for (var i = 0; i < n; i++) kids.forEach(function (k) {
        var c = k.cloneNode(true); c.classList.add('is-clone'); track.appendChild(c);
      });
      return { root: root, track: track, setW: setW };
    });
  };

  var update = function () {
    ticking = false;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    state.forEach(function (s) {
      if (s.track && s.setW) {
        var off = ((window.pageYOffset * SPEED) % s.setW + s.setW) % s.setW;
        s.track.style.transform = 'translate3d(' + (-off).toFixed(1) + 'px,0,0)';
      }
      var media = s.root.querySelector('.about__media');
      if (media) {
        var m = media.getBoundingClientRect();
        media.style.setProperty('--about-reveal', clamp((vh - m.top) / (Math.min(m.height, vh) * 0.75)).toFixed(4));
      }
    });
  };
  var onScroll = function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  var relayout = function () { build(); update(); };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', relayout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
  relayout();
})();
