/* הר סלול נדל"ן: פתיח, רץ בכל טעינה. ההחלטה אם להריץ נעשית בסקריפט קטן ב-head (intro-run / intro-skip). כאן רק מתזמנים יציאה ומסירים. */
(function () {
  var root = document.documentElement;
  var intro = document.getElementById('intro');
  if (!intro) return;
  if (!root.classList.contains('intro-run')) { intro.remove(); return; }
  setTimeout(function () {
    intro.classList.add('intro--out');
    root.classList.remove('intro-run');
    document.dispatchEvent(new Event('intro:done'));
    setTimeout(function () { intro.remove(); }, 950);
  }, 2400);
})();
