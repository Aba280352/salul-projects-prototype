/* פרויקטים בשיווק (מחשב): ההדמיה נשארת צמודה למסך (סטיקי) לאורך כל הרשימה. מחליפים פרויקט בלחיצה על הלשונית שלו,
   וההדמיה והפרטים מתחלפים. לחיצה על פרויקט שכבר פעיל פותחת את הדף שלו. גם מקלדת (פוקוס) מחליפה פרויקט.
   בלי JS הפרויקט הראשון פעיל (המחלקה כתובה ב-HTML) וכל הקישורים עובדים. במובייל כל פרויקט הוא כרטיס מלא ואין צורך בכלום.
   עובד גם באלמנטור (אותו מבנה בתוך ווידג'ט HTML). */
(function () {
  var shows = document.querySelectorAll('.projects__show');
  if (!shows.length) return;
  var desktop = window.matchMedia('(min-width: 1025px)');
  var cssPx = function (name) { return parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0; };

  Array.prototype.forEach.call(shows, function (show) {
    var items = Array.prototype.slice.call(show.querySelectorAll('.project'));

    var activate = function (item) {
      items.forEach(function (i) {
        var on = i === item;
        i.classList.toggle('is-active', on);
      });
    };

    // במה סטיקית: יורדת עם הגלילה, נעצרת בתחתית הרשימה
    var update = function () {
      if (!desktop.matches) { show.style.removeProperty('--stage-y'); return; }
      var r = show.getBoundingClientRect();
      var media = show.querySelector('.project__media');
      var mh = media ? media.offsetHeight : 0;
      var y = Math.max(0, Math.min(cssPx('--header-h') + 24 - r.top, r.height - mh));
      show.style.setProperty('--stage-y', y.toFixed(1) + 'px');
    };
    var onScroll = update; // חישוב זול, אין צורך להשהות ל-rAF

    items.forEach(function (item) {
      var link = item.querySelector('.project__link');
      if (!link) return;
      link.addEventListener('click', function (e) {
        if (!desktop.matches || item.classList.contains('is-active')) return;
        e.preventDefault();
        activate(item);
      });
      link.addEventListener('focus', function () { if (desktop.matches) activate(item); });
    });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    if (desktop.addEventListener) desktop.addEventListener('change', onScroll);
    update();
  });
})();
