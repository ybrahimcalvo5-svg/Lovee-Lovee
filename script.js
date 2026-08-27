(() => {
  "use strict";

  /* =====================================================
     HEART LOCK
     ---------------------------------------------------
     To change the passcode, edit CODE below.
     On success this redirects to MAIN_PAGE — the lock only
     ever lives on this page, so once you're on the main
     page (or i.html / love.html / you.html) you never see
     it again just from navigating around.
  ===================================================== */
  const CODE = "5357";
  const MAIN_PAGE = "main.html";
  let entered = "";
  let unlocked = false;

  const introScreen = document.getElementById("introScreen");
  const introContent = document.getElementById("introContent");
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

    // a little bloom right here as the send-off, then hand things over
    // to the main page — the ripple is the transition, not a background
    // that appears after the fact
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

    // the intro card fades/scales away once the bloom is well underway
    setTimeout(() => introContent.classList.add("is-opening"), 550);

    // hand off to the real page — a plain navigation, not a localStorage
    // flag, so the lock only ever guards this one page
    setTimeout(() => {
      window.location.href = MAIN_PAGE;
    }, 1500);
  }

  /* =====================================================
     FLOWER BURST (unlock moment only)
  ===================================================== */
  let flowerFieldStarted = false;
  function startFlowers() {
    if (flowerFieldStarted) return null;
    flowerFieldStarted = true;

    const flowerField = window.Lovee.initFlowerField("flowersCanvas", {
      ambient: false,
      maxFlowers: 90,
    });
    return flowerField || null;
  }
})();
