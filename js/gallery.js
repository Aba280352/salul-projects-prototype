/* קרוסלת פרויקטים בלופ אוטומטי.
   השורה משוכפלת עד שהיא רחבה מהמסך בשני סטים, ונעה ימינה (RTL) בלי תפר: כרטיסים חדשים נכנסים משמאל.
   ריחוף על כרטיס עוצר את השורה ומסמן אותו (זום עדין ופאנל שם). הכרטיסים המקוריים נשארים ב-HTML לגוגל ולקוראי מסך,
   והשכפולים מוסתרים מהם. מחוץ למסך התנועה עוצרת. עובד גם באלמנטור. */
(function () {
  var SPEED = 38;   // פיקסלים לשנייה

  Array.prototype.forEach.call(document.querySelectorAll('.pgal'), function (root) {
    var view = root.querySelector('.pgal__view'), track = root.querySelector('.pgal__track');
    if (!view || !track) return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var hoverable = window.matchMedia('(hover: hover)').matches;
    var originals = Array.prototype.slice.call(track.children);
    var setW = 0, off = 0, last = 0, paused = false, visible = true, lit = null;

    var measure = function () {
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      setW = originals.reduce(function (w, c) { return w + c.getBoundingClientRect().width + gap; }, 0);
    };
    var build = function () {
      Array.prototype.forEach.call(track.querySelectorAll('.is-clone'), function (c) { c.remove(); });
      if (reduce || !setW) return;
      var sets = Math.ceil(view.clientWidth / setW) + 1;
      for (var s = 0; s < sets; s++) originals.forEach(function (o) {
        var c = o.cloneNode(true);
        c.classList.add('is-clone'); c.setAttribute('aria-hidden', 'true'); c.setAttribute('tabindex', '-1');
        c.querySelectorAll('img').forEach(function (im) { im.alt = ''; });
        track.appendChild(c);
      });
    };
    var relayout = function () { measure(); build(); };

    var frame = function (t) {
      var dt = last ? Math.min(0.1, (t - last) / 1000) : 0; last = t;
      if (!reduce && setW) {
        if (!paused && visible) off = (off + SPEED * dt) % setW;
        track.style.transform = 'translate3d(' + off.toFixed(2) + 'px,0,0)';
      }
      requestAnimationFrame(frame);
    };

    var setLit = function (card) {
      if (card === lit) return;
      if (lit) lit.classList.remove('is-lit');
      lit = card;
      if (lit) lit.classList.add('is-lit');
    };

    if (hoverable) {
      view.addEventListener('pointerenter', function () { paused = true; });
      view.addEventListener('pointerleave', function () { paused = false; setLit(null); });
      view.addEventListener('pointermove', function (e) { setLit(e.target.closest ? e.target.closest('.pgal__card') : null); });
    }
    // מקלדת: מיקוד עוצר את השורה
    view.addEventListener('focusin', function () { paused = true; });
    view.addEventListener('focusout', function (e) { if (!view.contains(e.relatedTarget)) paused = false; });

    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { rootMargin: '120px' }).observe(root);
    window.addEventListener('resize', relayout);
    track.querySelectorAll('img').forEach(function (im) { if (!im.complete) im.addEventListener('load', relayout, { once: true }); });
    relayout();
    requestAnimationFrame(frame);
  });
})();
