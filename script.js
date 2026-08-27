(() => {
  "use strict";

  /* =====================================================
     HEART LOCK
     ---------------------------------------------------
     To change the passcode, edit CODE below.
  ===================================================== */
  const CODE = "5357";
  const STORAGE_KEY = "loveeUnlocked";
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

  // If the heart was already unlocked before (saved in this browser),
  // skip the lock screen entirely and land straight on the main page.
  function skipStraightToMain() {
    unlocked = true;
    introScreen.classList.add("is-hidden");
    mainScreen.classList.add("is-visible");
    startFlowers();
  }

  if (localStorage.getItem(STORAGE_KEY) === "true") {
    skipStraightToMain();
  }

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
    localStorage.setItem(STORAGE_KEY, "true");
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
     ENVELOPE + LETTER
     ---------------------------------------------------
     Edit LETTER_TEXT below to change what the letter says.
     Use a blank line for a paragraph break.
  ===================================================== */
  const LETTER_TEXT =
`My Love Love Angel Ann,

I just wanted you to have a little place that's only ours —
somewhere I could put down everything I feel about you.

Every day with you feels like a flower finding the sun.
You make ordinary moments feel like something worth keeping.

Thank you for being exactly who you are.
I love you more than these words know how to say.

Forever yours,
Ybrahim ♥`;

  const envelopeButton = document.getElementById("envelopeButton");
  const letterOverlay = document.getElementById("letterOverlay");
  const letterClose = document.getElementById("letterClose");
  const letterPaper = document.getElementById("letterPaper");
  const letterTypedText = document.getElementById("letterTypedText");
  const letterCursor = document.getElementById("letterCursor");

  let typewriterTimer = null;
  let hasOpenedLetter = false;

  function typeLetter() {
    clearTimeout(typewriterTimer);
    letterTypedText.textContent = "";
    if (letterCursor) letterCursor.classList.remove("is-hidden");

    let i = 0;
    function step() {
      if (i < LETTER_TEXT.length) {
        letterTypedText.textContent += LETTER_TEXT[i];
        const justTyped = LETTER_TEXT[i];
        i++;
        // small natural pause after punctuation/line breaks, quick otherwise
        let delay = 26 + Math.random() * 30;
        if (justTyped === "\n") delay = 260;
        else if (",.!?".includes(justTyped)) delay = 260;
        typewriterTimer = setTimeout(step, delay);
      } else if (letterCursor) {
        letterCursor.classList.add("is-hidden");
      }
    }
    step();
  }

  function openLetter() {
    if (envelopeButton) envelopeButton.classList.add("is-open");

    // let the flap-lift animation play first, then bring in the blurred
    // overlay with the paper sliding up and start the letter writing itself
    setTimeout(() => {
      if (letterOverlay) letterOverlay.classList.add("is-visible");
      if (!hasOpenedLetter) {
        hasOpenedLetter = true;
        typeLetter();
      }
    }, 420);
  }

  function closeLetter() {
    if (letterOverlay) letterOverlay.classList.remove("is-visible");
  }

  if (envelopeButton) {
    envelopeButton.addEventListener("click", (e) => {
      e.stopPropagation(); // don't also plant a flower under it
      openLetter();
    });
  }

  if (letterClose) {
    letterClose.addEventListener("click", (e) => {
      e.stopPropagation();
      closeLetter();
    });
  }

  if (letterOverlay) {
    // click the dimmed backdrop (not the paper itself) to close
    letterOverlay.addEventListener("click", (e) => {
      e.stopPropagation();
      if (e.target === letterOverlay) closeLetter();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && letterOverlay && letterOverlay.classList.contains("is-visible")) {
      closeLetter();
    }
  });

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
