/* אנימציית כניסה (GSAP) לטקסטים של מסך הפתיחה (ההדר מוצג מיד, בלי אנימציה (התג העגול נשאר ללא אנימציה): fade in עם תזוזה קלה ו-blur שמתבהר.
   כל הטקסטים נשארים ב-HTML כרגיל (SEO). רק התצוגה מונפשת, ומי שביקש פחות תנועה או שאין לו GSAP רואה הכל מיד.
   עובד גם בפרוטוטייפ וגם באלמנטור (שני סוגי המחלקות). */
(function () {
  var root = document.documentElement;
  var $ = function (sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); };
  var reveal = function () { root.classList.add('hero-title-ready'); };

  var tagline = $('.hero__tagline, .salul-hero__tagline .elementor-heading-title');
  var title = $('.hero__title, .salul-hero__title .elementor-heading-title');
  var lead = $('.hero__lead, .salul-hero__lead');
  var actions = $('.hero__actions > .btn, .salul-hero__actions .elementor-widget-button');

  if (!title.length || !window.gsap || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { reveal(); return; }

  var all = [].concat(tagline, title, lead, actions);
  var introRun = root.classList.contains('intro-run');
  var tl = gsap.timeline({
    paused: introRun,
    defaults: { ease: 'power3.out' },
    onComplete: function () { gsap.set(all, { clearProps: 'transform,filter,clipPath' }); }
  });

  // שורה עליונה: fade in down עם blur
  tl.fromTo(tagline, { autoAlpha: 0, y: -18, filter: 'blur(8px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.8 }, 0.2);

  // כותרת: עולה ונחשפת מלמטה למעלה, עם blur קל שמתבהר
  tl.fromTo(title,
    { autoAlpha: 0, y: 36, clipPath: 'inset(0% 0% 100% 0%)', filter: 'blur(6px)' },
    { autoAlpha: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', filter: 'blur(0px)', duration: 1.1 }, 0.35);

  // פסקה: fade in up עם blur
  tl.fromTo(lead, { autoAlpha: 0, y: 22, filter: 'blur(8px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.9 }, 0.8);

  // כפתורים: fade in up אחד אחרי השני
  tl.fromTo(actions, { autoAlpha: 0, y: 18, filter: 'blur(6px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.1 }, 1.0);

  // אם הפתיח רץ, האנימציה מתחילה רק כשהוא עולה
  if (introRun) document.addEventListener('intro:done', function () { tl.play(); }, { once: true });

  reveal();
})();
