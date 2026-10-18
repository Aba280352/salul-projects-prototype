/* שאלות נפוצות: לחיצה על שאלה פותחת אותה (אחת בכל פעם), מחליפה את התמונה, והפלוס מסתובב.
   בלי JS כל התשובות פתוחות. עובד גם באלמנטור (אותו מבנה בתוך ווידג'ט HTML). */
(function () {
  Array.prototype.forEach.call(document.querySelectorAll('.faq'), function (root) {
    var items = Array.prototype.slice.call(root.querySelectorAll('.faq__item'));
    var imgs = Array.prototype.slice.call(root.querySelectorAll('.faq__visual img'));
    if (!items.length) return;

    var open = function (i) {
      items.forEach(function (it, n) {
        var on = n === i;
        it.classList.toggle('is-open', on);
        it.querySelector('.faq__btn').setAttribute('aria-expanded', on ? 'true' : 'false');
      });
      var pic = items[i] ? parseInt(items[i].getAttribute('data-img'), 10) : 0;
      imgs.forEach(function (im, n) { im.classList.toggle('is-active', n === pic); });
    };
    items.forEach(function (it, n) {
      it.querySelector('.faq__btn').addEventListener('click', function () {
        open(it.classList.contains('is-open') ? -1 : n);
      });
    });
    imgs.forEach(function (im) { im.loading = 'eager'; });
    root.classList.add('is-ready');
    open(0);

  });
})();
