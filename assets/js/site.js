// ============================================================================
// Shared by every page: header, footer, covers, filters, project lookups.
// Load after data.js.
// ============================================================================

// Site root, worked out from this script's own address, so links work from any folder depth.
const ROOT = new URL("../../", document.currentScript.src).href;
const url = (path) => ROOT + path;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const year = (p) => p.date.slice(0, 4);
const prettyDate = (p) => `${MONTHS[+p.date.slice(5, 7) - 1]}.${year(p)}`;
const projectUrl = (p) => url(`work/${p.slug}/`);
const live = () => PROJECTS.filter((p) => !p.draft);               // everything the site may show
const newestFirst = (list) => [...list].sort((a, b) => b.date.localeCompare(a.date));
// Placeholder projects are shown as "Coming soon": no title, details or link.
const SOON = { title: "Coming soon", blurb: "A new project is on its way." };
const soon = (p) => !!p.placeholder;

// ---- header and footer ------------------------------------------------------
// Thoughts is hidden from the navigation until it has content (2026-11-22); add ["thoughts", "Thoughts", "thoughts.html"] back after Resume.
const NAV = [["work", "Work", "work.html"], ["about", "About", "about.html"], ["resume", "Resume", "resume.html"], ["contact", "Contact", "contact.html"]];
function renderChrome() {
  const page = document.body.dataset.page;
  document.querySelectorAll("[data-site-header]").forEach((h) => {
    h.classList.add("top");
    h.innerHTML = `<a class="name" href="${url("index.html")}">${SITE.name}</a>
      <nav>${NAV.map(([k, label, href]) => `<a href="${url(href)}"${k === page ? ' class="on" aria-current="page"' : ""}>${label}</a>`).join("")}</nav>`;
  });
  document.querySelectorAll("[data-site-footer]").forEach((f) => {
    f.classList.add("foot");
    f.innerHTML = `<span>© ${new Date().getFullYear()} ${SITE.name}</span>
      <span><a href="mailto:${SITE.email}">Email</a><a href="${SITE.linkedin}" target="_blank" rel="noopener">LinkedIn</a></span>`;
  });
}

// ---- covers -------------------------------------------------------------------
// Monochrome halftone cover. A real image is screened in the browser; a placeholder is drawn.
function coverHTML(p) {
  if (p.cover) return `<div class="ht" style="--ink:${p.ink};--lum:${p.lum || 0.72}"><div class="tone"><img src="${url(p.cover)}" alt="" loading="lazy"></div></div>`;
  return placeholderSVG(p, false);
}
// The project's real colours, used on hover and at the top of its page.
function colourHTML(p) {
  if (p.cover) return `<img class="fill" src="${url(p.image || p.cover)}" alt="" loading="lazy">`;
  return placeholderSVG(p, true);
}

// Stand-in artwork: a few blocks and lines, either in one ink (cover) or in several colours (colour).
const PAPER = "#f2f0ea";
const PALS = [["#E4572E","#F3A712","#A8C686","#669BBC","#29335C"],["#2D6A4F","#95D5B2","#FFD166","#EF476F","#F8F4E3"],["#3A0CA3","#4CC9F0","#F72585","#FFBE0B","#F1FAEE"],["#FFB703","#FB8500","#219EBC","#023047","#8ECAE6"],["#EF476F","#FFD166","#06D6A0","#118AB2","#073B4C"]];
function placeholderSVG(p, colour) {
  const i = PROJECTS.indexOf(p), ink = p.ink, pal = PALS[i % PALS.length], id = `${colour ? "c" : "m"}${i}`;
  let s = (i + 3) * 9973;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const W = 800, H = 600, cols = 8, rows = 6, cw = W / cols, ch = H / rows, tones = [0.28, 0.5, 0.74, 1];
  let out = colour ? `<rect width="${W}" height="${H}" fill="${pal[0]}"/>` : `<rect width="${W}" height="${H}" fill="${PAPER}"/><rect width="${W}" height="${H}" fill="${ink}" fill-opacity=".16"/>`;
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
    const k = r();
    if (k < 0.3) continue;
    const w = k > 0.86 && x < cols - 1 ? 2 : 1, h = k > 0.93 && y < rows - 1 ? 2 : 1, t = r();
    const fill = colour ? `fill="${pal[1 + Math.floor(t * 4)]}"` : `fill="${ink}" fill-opacity="${tones[Math.floor(t * 4)]}"`;
    out += r() > 0.8 ? `<circle cx="${x * cw + cw / 2}" cy="${y * ch + ch / 2}" r="${cw * 0.42}" ${fill}/>`
                     : `<rect x="${x * cw + 5}" y="${y * ch + 5}" width="${w * cw - 10}" height="${h * ch - 10}" ${fill}/>`;
  }
  const a = 80 + r() * 240, b = 300 + r() * 400;
  out += `<path d="M-20 ${a} C 260 ${a + 160}, 460 ${a - 120}, 820 ${a + 90}" stroke="${colour ? pal[4] : PAPER}" stroke-width="18" fill="none"/>`;
  out += `<path d="M${b} -20 L ${b - 150} 620" stroke="${colour ? pal[0] : ink}" stroke-width="22" fill="none"/>`;
  let defs = "";
  if (!colour) {
    defs = `<defs><pattern id="ht${id}" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(28)"><circle cx="3.5" cy="3.5" r="1.7" fill="${PAPER}"/></pattern>
      <filter id="gr${id}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="${i + 2}"/><feColorMatrix values="0 0 0 0 .95  0 0 0 0 .94  0 0 0 0 .9  0 0 0 1.6 -.75"/></filter></defs>`;
    out += `<rect width="${W}" height="${H}" fill="url(#ht${id})" opacity=".5"/><rect width="${W}" height="${H}" filter="url(#gr${id})" opacity=".55"/>`;
  }
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${defs}${out}</svg>`;
}

// ---- filters (state lives in the URL, so a filtered link can be shared: work.html?show=planning) ----
function currentFilter() {
  const f = new URLSearchParams(location.search).get("show");
  return CATS[f] ? f : "all";
}
function buildFilters(el, onChange) {
  const keys = ["all", ...Object.keys(CATS).filter((k) => live().some((p) => p.cat === k))];
  el.innerHTML = keys.map((k) => `<button type="button" data-f="${k}">${k === "all" ? "All" : CATS[k]}</button>`).join("");
  const paint = () => el.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.f === currentFilter()));
  el.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    const u = new URL(location.href);
    b.dataset.f === "all" ? u.searchParams.delete("show") : u.searchParams.set("show", b.dataset.f);
    history.replaceState(null, "", u);
    paint();
    onChange(currentFilter());
  });
  paint();
}

renderChrome();

// ---- project pages: fill the parts that come from data.js -------------------
(function renderProject() {
  const slug = document.body.dataset.project;
  if (!slug) return;
  const P = PROJECTS.find((p) => p.slug === slug);
  if (!P) return;
  document.title = `${P.title} — ${SITE.name}`;
  const set = (sel, html) => document.querySelectorAll(sel).forEach((el) => (el.innerHTML = html));
  set("[data-p-hero]", colourHTML(P));
  set("[data-p-meta]", `${CATS[P.cat]} · ${prettyDate(P)}`);
  set("[data-p-title]", P.title);
  set("[data-p-facts]", `<dt>Type</dt><dd>${P.kind}</dd><dt>Role</dt><dd>${P.role}</dd>` + (document.querySelector("[data-p-facts]")?.innerHTML || ""));
  // Next project, in the same order as the Work page.
  const list = newestFirst(live().filter((p) => !soon(p))), next = list[(list.indexOf(P) + 1) % list.length];
  document.querySelectorAll("[data-p-next]").forEach((a) => { a.href = projectUrl(next); a.innerHTML = `<span>Next project</span><b>${next.title} →</b>`; });
  // Reading progress in the header.
  const head = document.querySelector(".top");
  if (head) {
    head.insertAdjacentHTML("beforeend", `<div class="progress" aria-hidden="true"><i></i></div>`);
    const bar = head.querySelector(".progress i");
    const update = () => { const max = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`; };
    addEventListener("scroll", update, { passive: true }); addEventListener("resize", update); update();
  }
  // Close: back to wherever the visitor came from on this site, otherwise to Work.
  document.querySelectorAll("[data-p-close]").forEach((a) => {
    a.href = url("work.html");
    a.addEventListener("click", (e) => {
      if (document.referrer.startsWith(location.origin) && history.length > 1) { e.preventDefault(); history.back(); }
    });
  });
})();
