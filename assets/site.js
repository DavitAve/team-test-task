"use strict";

const header = document.querySelector("header");
const menu = document.getElementById("mobile-menu");
const toggle = document.getElementById("menu-toggle");

function setMenu(open) {
  menu.hidden = !open;
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

toggle.addEventListener("click", () => setMenu(menu.hidden));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !menu.hidden) {
    setMenu(false);
    toggle.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!menu.hidden && !header.contains(event.target)) setMenu(false);
});
window.matchMedia("(min-width: 1200px)").addEventListener("change", () => setMenu(false));

const backToTop = document.querySelector(".arrow-up");
function updateScrollControls() {
  header.classList.toggle("shadow", window.scrollY > 8);
  backToTop.hidden = window.scrollY < window.innerHeight;
  backToTop.classList.toggle("active", !backToTop.hidden);
}
window.addEventListener("scroll", updateScrollControls, { passive: true });
updateScrollControls();

const copyButton = document.getElementById("copy-code");
copyButton.addEventListener("click", async () => {
  const code = "GOL5";
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(code);
    } else {
      const field = document.createElement("textarea");
      field.value = code;
      field.className = "sr-only";
      document.body.append(field);
      field.select();
      const copied = document.execCommand("copy");
      field.remove();
      copyButton.focus({ preventScroll: true });
      if (!copied) throw new Error();
    }
    copyButton.textContent = "Copied!";
    document.getElementById("copy-result").textContent = "Promo code GOL5 copied.";
  } catch {
    copyButton.textContent = "Select GOL5 to copy";
    const range = document.createRange();
    range.selectNodeContents(document.querySelector(".promotion_section strong"));
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
});

const gameStrip = document.querySelector(".games_section ul");
if (gameStrip) {
  const controls = [...document.querySelectorAll(".games_section [data-direction]")];
  function updateControls() {
    controls[0].disabled = gameStrip.scrollLeft <= 1;
    controls[1].disabled =
      gameStrip.scrollLeft + gameStrip.clientWidth >= gameStrip.scrollWidth - 1;
  }
  for (const control of controls) {
    control.addEventListener("click", () => {
      gameStrip.scrollBy({
        left: Number(control.dataset.direction) * gameStrip.clientWidth * 0.8,
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      });
    });
  }
  gameStrip.addEventListener("scroll", updateControls, { passive: true });
  new ResizeObserver(updateControls).observe(gameStrip);
  updateControls();
}
