(() => {
  "use strict";

  /* =====================================================
     SITE HEADER — single source of truth
     ---------------------------------------------------
     Add, remove, or rename nav buttons HERE ONLY.
     Every page that includes this file (and has an
     empty <nav id="siteHeader"></nav>) updates
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
      return `<li><a class="nav-link" href="${item.href}">${item.label}</a></li>`;
    }
    return `<li><button class="nav-link" data-word="${item.word}">${item.label}</button></li>`;
  }

  function renderHeader() {
    return `
      <a class="nav-brand" href="#">${BRAND.small} <em>${BRAND.big}</em></a>
      <ul class="nav-links">
        ${NAV_ITEMS.map(renderNavItem).join("")}
      </ul>
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
