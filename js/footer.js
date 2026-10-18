/* טופס "צרו איתנו קשר" בפוטר: בפרוטוטייפ אין שרת, אז השליחה רק מציגה הודעת תודה.
   הבדיקות (שדות חובה ואישור פרטיות) הן של הדפדפן עצמו. באלמנטור הטופס יוחלף בווידג'ט הטופס של Elementor Pro. */
(function () {
  Array.prototype.forEach.call(document.querySelectorAll('.contact-bar__form'), function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = form.querySelector('.contact-bar__ok');
      if (ok) ok.hidden = false;
      form.reset();
    });
  });
})();
