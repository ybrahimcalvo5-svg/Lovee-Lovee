(() => {
  "use strict";

  /* =====================================================
     MOVING BACKGROUND
     ---------------------------------------------------
     A handful of soft, blurred color blobs drift slowly
     and independently, giving the whole site a living,
     breathing backdrop instead of a static gradient.
  ===================================================== */
  function initBackgroundCanvas() {
    const canvas = document.getElementById("bgCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width, height;
    let blobs = [];

    const PALETTE = [
      "rgba(226, 138, 165, 0.32)", // rose
      "rgba(201, 154, 82, 0.24)",  // gold
      "rgba(241, 185, 203, 0.28)", // rose-soft
      "rgba(58, 20, 32, 0.55)",    // ink/wine, adds depth
    ];

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function initBlobs() {
      blobs = Array.from({ length: 6 }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 180 + Math.random() * 200,
        color: PALETTE[i % PALETTE.length],
        speedX: (Math.random() - 0.5) * 0.18,
        speedY: (Math.random() - 0.5) * 0.18,
        phase: Math.random() * Math.PI * 2,
      }));
    }

    let t = 0;
    function draw() {
      t += 0.004;
      ctx.fillStyle = "#1c0a13";
      ctx.fillRect(0, 0, width, height);

      blobs.forEach((b) => {
        const x = b.x + Math.sin(t + b.phase) * 40;
        const y = b.y + Math.cos(t * 0.8 + b.phase) * 30;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, b.r);
        gradient.addColorStop(0, b.color);
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, b.r, 0, Math.PI * 2);
        ctx.fill();

        b.x += b.speedX;
        b.y += b.speedY;
        if (b.x < -b.r) b.x = width + b.r;
        if (b.x > width + b.r) b.x = -b.r;
        if (b.y < -b.r) b.y = height + b.r;
        if (b.y > height + b.r) b.y = -b.r;
      });

      requestAnimationFrame(draw);
    }

    resize();
    initBlobs();
    draw();
    window.addEventListener("resize", () => {
      resize();
      initBlobs();
    });
  }

  initBackgroundCanvas();

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
      const firstWordBtn = document.querySelector(".nav-link[data-word]");
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
    const wordButtons = Array.from(document.querySelectorAll(".nav-link[data-word]"));

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
