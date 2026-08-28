/* =====================================================
     MUSIC DISC & PLAYER CONTROLLER
  ===================================================== */
  const musicDiscButton = document.getElementById("musicDiscButton");
  const bgMusic = document.getElementById("bgMusic");
  const discHint = document.getElementById("discHint");
  const seekBar = document.getElementById("seekBar");
  const currentTimeEl = document.getElementById("currentTime");
  const durationTimeEl = document.getElementById("durationTime");
  const loopBtn = document.getElementById("loopBtn");

  function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  if (musicDiscButton && bgMusic) {
    const playAudio = () => {
      bgMusic.play().then(() => {
        musicDiscButton.classList.add("is-playing");
        musicDiscButton.setAttribute("aria-pressed", "true");
        if (discHint) discHint.textContent = "tap the disc to pause";
      }).catch(() => {
        if (discHint) discHint.textContent = "tap anywhere to play our song";
      });
    };

    // 1. Attempt playback immediately upon landing on main.html
    playAudio();

    // 2. Backup trigger if browser blocks autoplay until user interaction
    document.addEventListener("click", () => {
      if (bgMusic.paused) playAudio();
    }, { once: true });

    // 3. Play / Pause Toggle via Disc
    musicDiscButton.addEventListener("click", (e) => {
      e.stopPropagation();

      if (bgMusic.paused) {
        playAudio();
      } else {
        bgMusic.pause();
        musicDiscButton.classList.remove("is-playing");
        musicDiscButton.setAttribute("aria-pressed", "false");
        if (discHint) discHint.textContent = "tap the disc to play our song";
      }
    });

    // 4. Update seek bar and timestamp as song plays
    bgMusic.addEventListener("timeupdate", () => {
      if (!isNaN(bgMusic.duration)) {
        seekBar.value = bgMusic.currentTime;
        seekBar.max = bgMusic.duration;
        if (currentTimeEl) currentTimeEl.textContent = formatTime(bgMusic.currentTime);
        if (durationTimeEl) durationTimeEl.textContent = formatTime(bgMusic.duration);
      }
    });

    // 5. Scrub/Seek location on the progress bar
    if (seekBar) {
      seekBar.addEventListener("input", (e) => {
        e.stopPropagation();
        bgMusic.currentTime = seekBar.value;
      });
      seekBar.addEventListener("click", (e) => e.stopPropagation());
    }

    // 6. Toggle Loop mode
    if (loopBtn) {
      loopBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        bgMusic.loop = !bgMusic.loop;
        loopBtn.classList.toggle("is-active", bgMusic.loop);
      });
    }
  }

  /* =====================================================
     ENVELOPE + LETTER
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

    // let the flap-lift animation play first
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

    // Restore envelope clickability after close animation finishes
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
