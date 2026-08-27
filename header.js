(() => {
  "use strict";

  /* =====================================================
     SITE HEADER — single source of truth
     ---------------------------------------------------
     Add, remove, or rename nav buttons HERE ONLY.
     Every page that includes this file (and has an
     empty <header id="siteHeader"></header>) updates
     automatically — nothing else to touch.

     Two kinds of entries:
       { label: "I", word: "I" }        -> a button used by
                                            the I-LOVE-YOU game
                                            in script.js
       { label: "MORE", href: "x.html" } -> a plain link to
                                             another page
  ===================================================== */
  const NAV_ITEMS = [
    { label: "I",    word: "I" },
    { label: "LOVE", word: "LOVE" },
    { label: "YOU",  word: "YOU" },
    // { label: "ALWAYS", href: "always.html" },
  ];

  const BRAND = {
    small: "For my",
    big: "Lovee Lovee",
  };

  function renderNavItem(item) {
    if (item.href) {
      return `<a class="word-btn" href="${item.href}">${item.label}</a>`;
    }
    return `<button class="word-btn" data-word="${item.word}">${item.label}</button>`;
  }

  function renderHeader() {
    return `
      <h1 class="brand">
        <span class="brand-line brand-line--small">${BRAND.small}</span>
        <span class="brand-line brand-line--big">${BRAND.big}</span>
      </h1>
      <nav class="word-nav" id="wordNav" aria-label="Message buttons">
        ${NAV_ITEMS.map(renderNavItem).join("")}
      </nav>
    `;
  }

  function mountHeader() {
    const mount = document.getElementById("siteHeader");
    if (!mount) return;
    mount.innerHTML = renderHeader();
    // let other scripts (script.js) know the buttons now exist in the DOM
    document.dispatchEvent(new CustomEvent("header:ready"));
  }

  document.addEventListener("DOMContentLoaded", mountHeader);
})();
