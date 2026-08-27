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

    const rect = heartLock.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // small sparkle burst right at the heart itself
    for (let i = 0; i < 20; i++) {
      setTimeout(() => window.Lovee.spawnBurst(centerX, centerY), i * 18);
    }

    // start the flower field now (not after the screen switch) and let a
    // ripple of blooms expand outward from the heart — THIS is the
    // transition into the main page, not just a background that appears
    // after the fact
    const flowerField = startFlowers();
    if (flowerField) {
      const maxRadius = Math.hypot(window.innerWidth, window.innerHeight) * 0.75;
      const waveCount = 90;
      for (let i = 0; i < waveCount; i++) {
        const delay = i * 14; // spreads the ripple over ~1.25s
        setTimeout(() => {
          const angle = Math.random() * Math.PI * 2;
          const progress = i / waveCount; // ring expands outward over time
          const distance = progress * maxRadius + Math.random() * 60;
          flowerField.spawnFlowerAt(
            centerX + Math.cos(angle) * distance,
            centerY + Math.sin(angle) * distance
          );
        }, delay);
      }
    }

    // the intro card fades/scales away once the bloom is well underway,
    // so the flowers are what's revealing the page underneath
    setTimeout(() => introContent.classList.add("is-opening"), 550);

    setTimeout(() => {
      introScreen.classList.add("is-hidden");
      mainScreen.classList.add("is-visible");
      const brand = document.querySelector(".nav-brand");
      if (brand) brand.focus({ preventScroll: true });
    }, 1500);
  }

  /* =====================================================
     INTERACTIVE BLOOMING FLOWERS
     ---------------------------------------------------
     Field is created the moment the heart unlocks (used
     as the transition itself), then keeps blooming
     ambiently and lets taps/clicks plant more, forever.
  ===================================================== */
  let flowerFieldStarted = false;
  function startFlowers() {
    if (flowerFieldStarted) return null;
    flowerFieldStarted = true;

    const flowerField = window.Lovee.initFlowerField("flowersCanvas", {
      ambient: true,
      ambientInterval: 900,
      maxFlowers: 90,
    });
    if (!flowerField) return null;

    document.addEventListener("click", (e) => {
      if (e.target.closest(".site-nav") || e.target.closest(".frame")) return;
      if (e.target.closest(".keypad") || e.target.closest(".heart-lock")) return;
      flowerField.spawnFlowerAt(e.clientX, e.clientY);
    });

    return flowerField;
  }
})();
