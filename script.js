(() => {
  "use strict";

  /* =====================================================
     FLOATING HEARTS BACKGROUND
  ===================================================== */
  const heartsLayer = document.getElementById("heartsLayer");
  const HEART_GLYPHS = ["♥", "❤"];

  // dedicated layer for the one-off petal burst on the flower click
  const burstLayer = document.createElement("div");
  burstLayer.className = "burst-layer";
  burstLayer.setAttribute("aria-hidden", "true");
  document.body.appendChild(burstLayer);
  const BURST_GLYPHS = ["✿", "❀", "✦", "✧"];

  function spawnBurstParticle(x, y) {
    const particle = document.createElement("span");
    particle.className = "burst-particle";
    particle.textContent = BURST_GLYPHS[Math.floor(Math.random() * BURST_GLYPHS.length)];

    const angle = Math.random() * Math.PI * 2;
    const distance = 70 + Math.random() * 90;
    const tx = Math.cos(angle) * distance + "px";
    const ty = Math.sin(angle) * distance + "px";

    particle.style.left = x + "px";
    particle.style.top = y + "px";
    particle.style.setProperty("--tx", tx);
    particle.style.setProperty("--ty", ty);
    particle.style.fontSize = 14 + Math.random() * 14 + "px";

    burstLayer.appendChild(particle);
    setTimeout(() => particle.remove(), 950);
  }

  function spawnHeart() {
    const heart = document.createElement("span");
    heart.className = "heart-particle";
    heart.textContent = HEART_GLYPHS[Math.floor(Math.random() * HEART_GLYPHS.length)];

    const startX = Math.random() * 100;              // vw
    const drift = (Math.random() * 140 - 70) + "px";  // horizontal wander
    const duration = 7 + Math.random() * 6;           // seconds
    const size = 12 + Math.random() * 16;             // px

    heart.style.left = startX + "vw";
    heart.style.fontSize = size + "px";
    heart.style.setProperty("--drift", drift);
    heart.style.animationDuration = duration + "s";

    heartsLayer.appendChild(heart);
    setTimeout(() => heart.remove(), duration * 1000 + 200);
  }

  // gentle, ambient rate
  setInterval(spawnHeart, 650);
  for (let i = 0; i < 5; i++) setTimeout(spawnHeart, i * 300);

  /* =====================================================
     INTRO -> MAIN TRANSITION
  ===================================================== */
  const introScreen = document.getElementById("introScreen");
  const introContent = introScreen.querySelector(".intro-content");
  const mainScreen = document.getElementById("mainScreen");
  const flowerButton = document.getElementById("flowerButton");

  let hasOpened = false;

  function openLetter() {
    if (hasOpened) return;
    hasOpened = true;

    flowerButton.classList.add("is-blooming");
    flowerButton.setAttribute("aria-disabled", "true");

    // burst petals/sparkles out from the flower's on-screen position
    const rect = flowerButton.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    for (let i = 0; i < 24; i++) {
      setTimeout(() => spawnBurstParticle(centerX, centerY), i * 20);
    }

    // let the bloom animation play, then transition screens
    setTimeout(() => {
      introContent.classList.add("is-opening");
    }, 350);

    setTimeout(() => {
      introScreen.classList.add("is-hidden");
      mainScreen.classList.add("is-visible");
      const firstWordBtn = document.querySelector(".word-btn");
      if (firstWordBtn) firstWordBtn.focus({ preventScroll: true });
    }, 750);
  }

  flowerButton.addEventListener("click", openLetter);
  flowerButton.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openLetter();
    }
  });

  /* =====================================================
     "I  LOVE  YOU" SEQUENCE
     ---------------------------------------------------
     header.js injects the nav buttons asynchronously, so
     this waits for the "header:ready" event it dispatches
     instead of querying for buttons at parse time.
  ===================================================== */
  const stageIdle = document.getElementById("stageIdle");
  const stageMessage = document.getElementById("stageMessage");
  const SEQUENCE = ["I", "LOVE", "YOU"];
  let progress = 0;
  let revealed = false;

  function initWordNav() {
    const wordButtons = Array.from(document.querySelectorAll(".word-btn[data-word]"));

    function resetSequence() {
      progress = 0;
      wordButtons.forEach((btn) => btn.classList.remove("is-active"));
    }

    function celebrate() {
      revealed = true;
      stageIdle.classList.add("is-hidden");
      stageMessage.textContent = "I love you too. Always. ♥";
      stageMessage.classList.add("is-visible");

      // little heart burst from the stage
      for (let i = 0; i < 18; i++) {
        setTimeout(spawnHeart, i * 60);
      }
    }

    wordButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (revealed) return;

        const word = btn.dataset.word;

        // pop animation every click, regardless of sequence correctness
        btn.classList.remove("is-pulsing");
        // force reflow so the animation can restart if clicked twice fast
        void btn.offsetWidth;
        btn.classList.add("is-pulsing");

        if (word === SEQUENCE[progress]) {
          btn.classList.add("is-active");
          progress++;
          if (progress === SEQUENCE.length) {
            celebrate();
          }
        } else {
          // out of order: restart the sequence gently
          resetSequence();
          if (word === SEQUENCE[0]) {
            btn.classList.add("is-active");
            progress = 1;
          }
        }
      });
    });
  }

  document.addEventListener("header:ready", initWordNav);
})();
