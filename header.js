(() => {
  "use strict";

  /* =====================================================
     SITE HEADER — single source of truth
     ---------------------------------------------------
     Add, remove, rename, or re-link nav buttons HERE
     ONLY. Every page that includes this file (and has
     an empty <nav id="siteHeader"></nav>) updates
     automatically — nothing else to touch.

     Each entry is a link to its own page:
       { label: "I", href: "i.html", key: "i" }

     "key" should match the data-nav-key on that page's
     <body> tag, so the current page's nav item lights up.
  ===================================================== */
  const NAV_ITEMS = [
    { label: "I",    href: "i.html",    key: "i" },
    { label: "LOVE", href: "love.html", key: "love" },
    { label: "YOU",  href: "you.html",  key: "you" },
  ];

  const BRAND = {
    small: "For my",
    big: "Lovee Lovee",
  };

  function renderNavItem(item, currentKey) {
    const isCurrent = item.key && item.key === currentKey;
    const cls = "nav-link" + (isCurrent ? " is-current" : "");
    return `<li><a class="${cls}" href="${item.href}">${item.label}</a></li>`;
  }

  function renderHeader(currentKey) {
    return `
      <a class="nav-brand" href="main.html">${BRAND.small} <em>${BRAND.big}</em></a>
      <ul class="nav-links">
        ${NAV_ITEMS.map((item) => renderNavItem(item, currentKey)).join("")}
      </ul>
    `;
  }

  function mountHeader() {
    const mount = document.getElementById("siteHeader");
    if (!mount) return;
    const currentKey = document.body.getAttribute("data-nav-key") || "";
    mount.innerHTML = renderHeader(currentKey);
    // let other scripts know the buttons now exist in the DOM
    document.dispatchEvent(new CustomEvent("header:ready"));
  }

  document.addEventListener("DOMContentLoaded", mountHeader);
})();
