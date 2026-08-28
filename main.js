(() => {
  "use strict";

  /* =====================================================
     MUSIC DISC, TONE ARM & AUDIO CONTROLLER
  ===================================================== */
  const musicDiscButton = document.getElementById("musicDiscButton");
  const bgMusic = document.getElementById("bgMusic");
  const discHint = document.getElementById("discHint");
  const seekBar = document.getElementById("seekBar");
  const currentTimeEl = document.getElementById("currentTime");
  const durationTimeEl = document.getElementById("durationTime");
  const loopBtn = document.getElementById("loopBtn");
  const toneArm = document.getElementById("toneArm");

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  if (musicDiscButton && bgMusic) {
    let isScrubbing = false;

    const setPlayingState = (isPlaying) => {
      if (isPlaying) {
        musicDiscButton.classList.add("is-playing");
        if (toneArm) toneArm.classList.add("is-playing");
        musicDiscButton.setAttribute("aria-pressed", "true");
        if (discHint) discHint.textContent = "tap the disc to pause";
      } else {
        musicDiscButton.classList.remove("is-playing");
        if (toneArm) toneArm.classList.remove("is-playing");
        musicDiscButton.setAttribute("aria-pressed", "false");
        if (discHint) discHint.textContent = "tap the disc to play our song";
      }
    };

    const playAudio = () => {
      bgMusic.play().then(() => {
        setPlayingState(true);
      }).catch(() => {
        if (discHint) discHint.textContent = "tap anywhere to play our song";
      });
    };

    // Auto-play attempt on page load
    window.addEventListener("load", () => {
      playAudio();
    });

    // Backup play trigger on user interaction
    document.addEventListener("click", () => {
      if (bgMusic.paused) playAudio();
    }, { once: true });

    // Play / Pause toggle
    musicDiscButton.addEventListener("click", (e) => {
      e.stopPropagation();
      if (bgMusic.paused) {
        playAudio();
      } else {
        bgMusic.pause();
        setPlayingState(false);
      }
    });

    // Handle track ending (if loop is disabled)
    bgMusic.addEventListener("ended", () => {
      setPlayingState(false);
    });

    // Load duration when metadata is ready
    bgMusic.addEventListener("loadedmetadata", () => {
      if (durationTimeEl) durationTimeEl.textContent = formatTime(bgMusic.duration);
      if (seekBar) seekBar.max = bgMusic.duration;
    });

    // Continuous progress update
    bgMusic.addEventListener("timeupdate", () => {
      if (!isNaN(bgMusic.duration) && bgMusic.duration > 0) {
        if (!isScrubbing && seekBar) {
          seekBar.value = bgMusic.currentTime;
        }
        if (currentTimeEl) currentTimeEl.textContent = formatTime(bgMusic.currentTime);
        if (durationTimeEl) durationTimeEl.textContent = formatTime(bgMusic.duration);
      }
    });

    // Seek bar functionality
    if (seekBar) {
      seekBar.addEventListener("mousedown", () => { isScrubbing = true; });
      seekBar.addEventListener("touchstart", () => { isScrubbing = true; });

      seekBar.addEventListener("input", (e) => {
        e.stopPropagation();
        if (currentTimeEl) currentTimeEl.textContent = formatTime(seekBar.value);
      });

      const finishSeeking = (e) => {
        e.stopPropagation();
        bgMusic.currentTime = parseFloat(seekBar.value);
        isScrubbing = false;
      };

      seekBar.addEventListener("change", finishSeeking);
      seekBar.addEventListener("mouseup", finishSeeking);
      seekBar.addEventListener("touchend", finishSeeking);
      seekBar.addEventListener("click", (e) => e.stopPropagation());
    }

    // Loop toggle
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
    if (letterTypedText) letterTypedText.textContent = "";
    if (letterCursor) letterCursor.classList.remove("is-hidden");

    let i = 0;
    function step() {
      if (i < LETTER_TEXT.length) {
        if (letterTypedText) letterTypedText.textContent += LETTER_TEXT[i];
        const justTyped = LETTER_TEXT[i];
        i++;
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

    if (envelopeButton) {
      setTimeout(() => {
        envelopeButton.classList.remove("is-open");
      }, 450);
    }
  }

  if (envelopeButton) {
    envelopeButton.addEventListener("click", (e) => {
      e.stopPropagation();
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
     INTERACTIVE BLOOMING FLOWERS & BURST
  ===================================================== */
  const BLOOM_EXPLOSION_THRESHOLD = 15;
  const BLOOM_EXPLOSION_GLYPHS = ["✿", "❀", "♥", "❤", "✦"];
  let clickedFlowerCount = 0;

  function triggerScreenBloomExplosion() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const particleCount = 70;

    for (let i = 0; i < particleCount; i++) {
      setTimeout(() => {
        const x = Math.random() * w;
        const y = Math.random() * h;
        if (window.Lovee && typeof window.Lovee.spawnBurst === 'function') {
          window.Lovee.spawnBurst(x, y, BLOOM_EXPLOSION_GLYPHS);
        }
      }, i * 12);
    }

    const flash = document.createElement("div");
    flash.className = "bloom-flash";
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 750);
  }

  // Initialize Flower Field supporting both window.flowerField and window.Lovee
  let flowerInstance = null;
  if (window.Lovee && typeof window.Lovee.initFlowerField === 'function') {
    flowerInstance = window.Lovee.initFlowerField("flowersCanvas", {
      ambient: true,
      ambientInterval: 900,
      maxFlowers: 90,
    });
  } else if (window.flowerField) {
    flowerInstance = window.flowerField;
  }

  document.addEventListener("click", (e) => {
    // Ignore clicks on controls, links, and text overlays
    if (e.target.closest("button, a, input, .site-nav, .letter-overlay")) return;

    // Spawn flower at click position
    if (flowerInstance && typeof flowerInstance.spawnFlowerAt === 'function') {
      flowerInstance.spawnFlowerAt(e.clientX, e.clientY);
    } else if (window.flowerField && typeof window.flowerField.spawnFlowerAt === 'function') {
      window.flowerField.spawnFlowerAt(e.clientX, e.clientY);
    }

    // Handle Flower Burst Counter
    clickedFlowerCount++;
    if (clickedFlowerCount >= BLOOM_EXPLOSION_THRESHOLD) {
      clickedFlowerCount = 0;
      triggerScreenBloomExplosion();
    }
  });

})();
