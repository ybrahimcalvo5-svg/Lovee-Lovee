(() => {
  "use strict";

  const word = document.querySelector(".letter-page-word");
  if (word) {
    requestAnimationFrame(() => {
      // one more frame so the transition actually plays on load
      requestAnimationFrame(() => word.classList.add("is-visible"));
    });
  }

  if (window.Lovee && window.Lovee.initFlowerField) {
    const flowerField = window.Lovee.initFlowerField("flowersCanvas", {
      ambient: true,
      ambientInterval: 1400,
      maxFlowers: 34,
    });

    // tap/click anywhere to plant an extra flower, same as the main page
    if (flowerField) {
      document.addEventListener("click", (e) => {
        if (e.target.closest(".site-nav") || e.target.closest(".back-home")) return;
        flowerField.spawnFlowerAt(e.clientX, e.clientY);
      });
    }
  }
})();
