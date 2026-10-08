(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Reveal content once as it enters view; leave it visible for reduced motion.
  var revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reducedMotion) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -35px 0px" });
    revealItems.forEach(function (item) { revealObserver.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add("is-visible"); });
  }

  // Compact the sticky bar after the reader moves beyond the hero.
  var nav = document.getElementById("siteNav");
  var setNavState = function () { nav.classList.toggle("is-scrolled", window.scrollY > 24); };
  setNavState();
  window.addEventListener("scroll", setNavState, { passive: true });

  // Filter the skills by area and expose the selected state to assistive tech.
  var filters = document.getElementById("skillFilters");
  var groups = document.querySelectorAll(".skill-group");
  if (filters) {
    filters.addEventListener("click", function (event) {
      var button = event.target.closest("button[data-filter]");
      if (!button) return;
      var filter = button.getAttribute("data-filter");
      filters.querySelectorAll("button[data-filter]").forEach(function (item) {
        var selected = item === button;
        item.classList.toggle("is-active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      groups.forEach(function (group) {
        group.hidden = filter !== "all" && group.getAttribute("data-group") !== filter;
      });
    });
  }

  // Small section command palette, available by button or Ctrl/Cmd+K.
  var trigger = document.getElementById("paletteTrigger");
  var palette = document.getElementById("cmdPalette");
  var overlay = document.getElementById("cmdOverlay");
  var closeButton = document.getElementById("cmdClose");
  var input = document.getElementById("cmdInput");
  var list = document.getElementById("cmdList");
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
  var items = links.concat([
    { textContent: "Home", getAttribute: function () { return "#home"; } },
    { textContent: "Education & certifications", getAttribute: function () { return "#education"; } }
  ]).map(function (link) { return { label: link.textContent.trim(), target: link.getAttribute("href") || link.getAttribute("href") }; });
  // The added synthetic entries use a direct target because they are not anchors.
  items[items.length - 2].target = "#home";
  items[items.length - 1].target = "#education";
  var activeIndex = 0;
  var visibleItems = items.slice();
  var returnFocus = null;

  function renderItems() {
    list.textContent = "";
    visibleItems.forEach(function (item, index) {
      var row = document.createElement("li");
      row.setAttribute("role", "option");
      row.setAttribute("aria-selected", String(index === activeIndex));
      row.textContent = item.label;
      row.addEventListener("click", function () { navigate(index); });
      list.appendChild(row);
    });
  }

  function filterItems() {
    var query = input.value.trim().toLowerCase();
    visibleItems = items.filter(function (item) { return item.label.toLowerCase().indexOf(query) !== -1; });
    activeIndex = 0;
    renderItems();
  }

  function openPalette() {
    returnFocus = document.activeElement;
    palette.hidden = false;
    overlay.hidden = false;
    input.value = "";
    filterItems();
    document.body.style.overflow = "hidden";
    input.focus();
  }

  function closePalette() {
    palette.hidden = true;
    overlay.hidden = true;
    document.body.style.overflow = "";
    if (returnFocus && returnFocus.focus) returnFocus.focus();
  }

  function navigate(index) {
    var item = visibleItems[index];
    if (!item) return;
    closePalette();
    var section = document.querySelector(item.target);
    if (section) section.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  }

  trigger.addEventListener("click", openPalette);
  closeButton.addEventListener("click", closePalette);
  overlay.addEventListener("click", closePalette);
  input.addEventListener("input", filterItems);
  document.addEventListener("keydown", function (event) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (palette.hidden) openPalette(); else closePalette();
      return;
    }
    if (palette.hidden) return;
    if (event.key === "Escape") closePalette();
    if (event.key === "ArrowDown") {
      event.preventDefault();
      activeIndex = Math.min(activeIndex + 1, visibleItems.length - 1);
      renderItems();
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      renderItems();
    }
    if (event.key === "Enter") navigate(activeIndex);
  });
})();
