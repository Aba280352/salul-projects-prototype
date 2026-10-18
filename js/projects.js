/* פרויקטים בשיווק: במחשב, ריחוף או פוקוס על פרויקט ברשימה הופך אותו לפעיל (ההדמיה בבמה מתחלפת והפרטים נפתחים).
   בלי JS הפרויקט הראשון פעיל (המחלקה כתובה ב-HTML) וכל הקישורים עובדים. במובייל אין צורך: כל פרויקט הוא כרטיס מלא.
   עובד גם באלמנטור (אותו מבנה בתוך ווידג'ט HTML). */
(function () {
  var lists = document.querySelectorAll('.projects__list');
  if (!lists.length) return;
  var desktop = window.matchMedia('(min-width: 1025px)');

  Array.prototype.forEach.call(lists, function (list) {
    var items = Array.prototype.slice.call(list.querySelectorAll('.project'));
    var activate = function (item) {
      if (!desktop.matches || item.classList.contains('is-active')) return;
      items.forEach(function (i) { i.classList.toggle('is-active', i === item); });
    };
    items.forEach(function (item) {
      item.addEventListener('mouseenter', function () { activate(item); });
      item.addEventListener('focusin', function () { activate(item); });
    });
  });
})();
