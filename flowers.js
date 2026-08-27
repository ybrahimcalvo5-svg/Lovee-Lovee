(() => {
  "use strict";

  /* =====================================================
     INTERACTIVE BLOOMING FLOWERS
     ---------------------------------------------------
     Draws a field of little flowers on a canvas. Flowers
     bloom in on their own over time (ambient), and more
     can be planted at any x/y on demand (interactive,
     e.g. on click/tap). Call window.Lovee.initFlowerField
     once per page, after background.js has loaded.
  ===================================================== */
  function initFlowerField(canvasId, options) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    const opts = Object.assign(
      { ambient: true, ambientInterval: 1100, maxFlowers: 46 },
      options
    );

    let width, height;
    let flowers = [];

    const PETAL_COLORS = ["#E28AA5", "#F1B9CB", "#C99A52", "#F7E4EA"];

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function makeFlower(x, y) {
      return {
        x,
        y,
        maxSize: 16 + Math.random() * 20,
        growth: 0,
        growSpeed: 0.012 + Math.random() * 0.012,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.4 + Math.random() * 0.6,
        petals: 5 + Math.floor(Math.random() * 2),
        color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
        rotation: Math.random() * Math.PI,
      };
    }

    function spawnFlowerAt(x, y) {
      if (flowers.length >= opts.maxFlowers) flowers.shift();
      flowers.push(makeFlower(x, y));
    }

    // gentle overshoot-then-settle bloom curve
    function easeOutBack(x) {
      const c1 = 1.4;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    }

    function drawFlower(f, t) {
      const grownSize = f.maxSize * easeOutBack(f.growth);
      if (grownSize <= 0.2) return;
      const wobble = Math.sin(t * f.swaySpeed + f.sway) * 3 * f.growth;

      ctx.save();
      ctx.translate(f.x + wobble, f.y);
      ctx.rotate(f.rotation);
      ctx.globalAlpha = Math.min(1, f.growth * 1.4);

      for (let i = 0; i < f.petals; i++) {
        const angle = (Math.PI * 2 * i) / f.petals;
        ctx.save();
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.ellipse(0, -grownSize * 0.62, grownSize * 0.34, grownSize * 0.6, 0, 0, Math.PI * 2);
        ctx.fillStyle = f.color;
        ctx.fill();
        ctx.restore();
      }

      ctx.beginPath();
      ctx.arc(0, 0, grownSize * 0.28, 0, Math.PI * 2);
      ctx.fillStyle = "#C99A52";
      ctx.fill();

      ctx.restore();
    }

    let t = 0;
    function tick() {
      t += 0.016;
      ctx.clearRect(0, 0, width, height);
      flowers.forEach((f) => {
        if (f.growth < 1) f.growth = Math.min(1, f.growth + f.growSpeed);
        drawFlower(f, t);
      });
      requestAnimationFrame(tick);
    }
    tick();

    if (opts.ambient) {
      setInterval(() => {
        spawnFlowerAt(
          Math.random() * width,
          height * 0.12 + Math.random() * height * 0.8
        );
      }, opts.ambientInterval);

      // a few right away so the page doesn't look empty on load
      for (let i = 0; i < 6; i++) {
        setTimeout(() => {
          spawnFlowerAt(
            Math.random() * width,
            height * 0.12 + Math.random() * height * 0.8
          );
        }, i * 220);
      }
    }

    return { spawnFlowerAt };
  }

  window.Lovee = window.Lovee || {};
  window.Lovee.initFlowerField = initFlowerField;
})();
