(() => {
  "use strict";

  /* =====================================================
     MUSIC DISC
     ---------------------------------------------------
     Add your own audio file next to the html files and
     point bgMusic's src at it in main.html.
  ===================================================== */
 const musicDiscButton = document.getElementById("musicDiscButton");
const bgMusic = document.getElementById("bgMusic");
const discHint = document.getElementById("discHint");
const loopBtn = document.getElementById("loopBtn");

  if (musicDiscButton && bgMusic) {
    musicDiscButton.addEventListener("click", (e) => {
      e.stopPropagation(); // don't also plant a flower under it

      if (bgMusic.paused) {
        bgMusic.play().catch(() => {
          if (discHint) discHint.textContent = "couldn't play — add song.mp3 next to your html files";
        });
        musicDiscButton.classList.add("is-playing");
        musicDiscButton.setAttribute("aria-pressed", "true");
        musicDiscButton.setAttribute("aria-label", "Pause our song");
        if (discHint) discHint.textContent = "tap the disc to pause";
      } else {
        bgMusic.pause();
        musicDiscButton.classList.remove("is-playing");
        musicDiscButton.setAttribute("aria-pressed", "false");
        musicDiscButton.setAttribute("aria-label", "Play our song");
        if (discHint) discHint.textContent = "tap the disc to play our song";
      }
    });
  }
    /* =====================================================
   REPEAT / LOOP BUTTON
===================================================== */

if (loopBtn && bgMusic) {

  // Start with repeat enabled
  bgMusic.loop = true;
  loopBtn.classList.add("is-active");
  loopBtn.setAttribute("aria-pressed", "true");

  loopBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    // Toggle loop
    bgMusic.loop = !bgMusic.loop;

    if (bgMusic.loop) {
      // Repeat ON
      loopBtn.classList.add("is-active");
      loopBtn.setAttribute("aria-pressed", "true");
      loopBtn.setAttribute("aria-label", "Repeat is on");
      loopBtn.setAttribute("title", "Repeat: On");

    } else {
      // Repeat OFF
      loopBtn.classList.remove("is-active");
      loopBtn.setAttribute("aria-pressed", "false");
      loopBtn.setAttribute("aria-label", "Repeat is off");
      loopBtn.setAttribute("title", "Repeat: Off");
    }
  });
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

    // BUGFIX: opening the letter adds "is-open" to the envelope, which fades
    // it out and disables clicks (pointer-events: none) so the flap can lift
    // out of the way. That class was never removed on close, so the envelope
    // stayed invisible/unclickable forever after the first open. Restore it
    // once the overlay has finished fading out so it can be tapped again.
    if (envelopeButton) {
      setTimeout(() => {
        envelopeButton.classList.remove("is-open");
      }, 450);
    }
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
     Blooms ambiently and lets taps/clicks plant more.
     Keep clicking and, once enough flowers have been
     hand-planted, the whole screen bursts into bloom.
  ===================================================== */
  const BLOOM_EXPLOSION_THRESHOLD = 15; // clicks needed to trigger the burst
  const BLOOM_EXPLOSION_GLYPHS = ["✿", "❀", "♥", "❤", "✦"];

  function triggerScreenBloomExplosion() {
    if (!window.Lovee || !window.Lovee.spawnBurst) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    const particleCount = 70;

    for (let i = 0; i < particleCount; i++) {
      setTimeout(() => {
        const x = Math.random() * w;
        const y = Math.random() * h;
        window.Lovee.spawnBurst(x, y, BLOOM_EXPLOSION_GLYPHS);
      }, i * 12);
    }

    const flash = document.createElement("div");
    flash.className = "bloom-flash";
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 750);
  }

  if (window.Lovee && window.Lovee.initFlowerField) {
    const flowerField = window.Lovee.initFlowerField("flowersCanvas", {
      ambient: true,
      ambientInterval: 900,
      maxFlowers: 90,
    });

    let clickedFlowerCount = 0;

    if (flowerField) {
      document.addEventListener("click", (e) => {
        if (e.target.closest(".site-nav")) return;
        flowerField.spawnFlowerAt(e.clientX, e.clientY);

        clickedFlowerCount++;
        if (clickedFlowerCount >= BLOOM_EXPLOSION_THRESHOLD) {
          clickedFlowerCount = 0;
          triggerScreenBloomExplosion();
        }
      });
    }
  }
})();
