(() => {
  "use strict";

  /* =====================================================
     HEART LOCK
     ---------------------------------------------------
     To change the passcode, edit CODE below.
  ===================================================== */
  const CODE = "5357";
  let entered = "";
  let unlocked = false;

  const introScreen = document.getElementById("introScreen");
  const introContent = document.getElementById("introContent");
  const mainScreen = document.getElementById("mainScreen");
  const heartLock = document.getElementById("heartLock");
  const dots = Array.from(document.querySelectorAll("#passcodeDots .dot"));
  const introHint = document.getElementById("introHint");
  const keypad = document.getElementById("keypad");

  const DEFAULT_HINT = "enter the 4-digit code to unlock my heart";

  function updateDots() {
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-filled", i < entered.length);
    });
  }

  function shakeLock() {
    heartLock.classList.remove("is-shaking");
    void heartLock.offsetWidth; // restart animation if triggered twice fast
    heartLock.classList.add("is-shaking");
    introHint.textContent = "that's not quite it — try again";
  }

  function resetEntryAfter(delay) {
    setTimeout(() => {
      entered = "";
      updateDots();
      if (!unlocked) introHint.textContent = DEFAULT_HINT;
    }, delay);
  }

  function pressDigit(d) {
    if (unlocked || entered.length >= 4) return;
    entered += d;
    updateDots();

    if (entered.length === 4) {
      if (entered === CODE) {
        unlockHeart();
      } else {
        shakeLock();
        resetEntryAfter(600);
      }
    }
  }

  function pressBackspace() {
    if (unlocked) return;
    entered = entered.slice(0, -1);
    updateDots();
  }

  if (keypad) {
    keypad.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-key]");
      if (!btn) return;
      const key = btn.dataset.key;
      if (key === "back") {
        pressBackspace();
      } else {
        pressDigit(key);
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (unlocked) return;
    if (/^[0-9]$/.test(e.key)) pressDigit(e.key);
    if (e.key === "Backspace") pressBackspace();
  });

  function unlockHeart() {
    unlocked = true;
    introHint.textContent = "unlocked ♥";
    heartLock.classList.add("is-unlocked");

    // burst of sparkles from the heart's on-screen position
    const rect = heartLock.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    for (let i = 0; i < 26; i++) {
      setTimeout(() => window.Lovee.spawnBurst(centerX, centerY), i * 18);
    }

    setTimeout(() => introContent.classList.add("is-opening"), 450);

    setTimeout(() => {
      introScreen.classList.add("is-hidden");
      mainScreen.classList.add("is-visible");
      startFlowers();
      const brand = document.querySelector(".nav-brand");
      if (brand) brand.focus({ preventScroll: true });
    }, 900);
  }

  /* =====================================================
     INTERACTIVE BLOOMING FLOWERS (main-screen background)
     ---------------------------------------------------
     Starts once the heart is unlocked: flowers bloom in
     on their own over time, and tapping/clicking anywhere
     on the main screen plants another one right there.
  ===================================================== */
  function startFlowers() {
    const flowerField = window.Lovee.initFlowerField("flowersCanvas", {
      ambient: true,
      ambientInterval: 900,
      maxFlowers: 60,
    });
    if (!flowerField) return;

    mainScreen.addEventListener("click", (e) => {
      if (e.target.closest(".site-nav") || e.target.closest(".frame")) return;
      flowerField.spawnFlowerAt(e.clientX, e.clientY);
    });
  }
})();
