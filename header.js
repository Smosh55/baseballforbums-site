/* ============================================================
   HEADER.JS — Baseball For Bums
   Edit the CONFIG block below to change anything site-wide.
   No other files need to be touched.
============================================================ */

const CONFIG = {
  siteName:    "Baseball For Bums",
  siteTagline: "League Central",
  logoEmoji:   "⚾",
  tickerSeason:"Spring 2026",
  ctaLabel:    "Join Waitlist",
  ctaHref:     "/waitlist/",

  primaryLinks: [
    { label: "Home",      href: "/" },
    { label: "Schedule",  href: "/schedule.html" },
    { label: "Rosters",   href: "/rosters.html" },
    { label: "Stats",     href: "/stats.html" },
    { label: "Standings", href: "/standings.html" }
  ],

  leagueLinks: [
    { label: "Rules",     href: "/league-rules/" },
    { label: "Waiver",    href: "/waiver-and-conduct/" },
    { label: "Waitlist",  href: "/waitlist/" }
  ]
};

/* ── Injected styles — self-contained so mobile always works ── */
const HEADER_STYLES = `
  .site-header {
    position: sticky;
    top: 0;
    z-index: 9999;
    font-family: 'Barlow', 'Barlow Condensed', sans-serif;
  }

  /* ── Ticker ── */
  .score-ticker {
    background: rgba(214,64,69,0.12);
    border-bottom: 1px solid rgba(214,64,69,0.2);
    overflow: hidden;
    height: 28px;
    display: flex;
    align-items: center;
  }
  .score-ticker-inner {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 0 16px;
    white-space: nowrap;
    overflow: hidden;
  }
  .ticker-pill {
    background: rgba(214,64,69,0.3);
    color: #ffb3b5;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.62rem;
    font-weight: 800;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    padding: 2px 8px;
    border-radius: 4px;
    flex-shrink: 0;
  }
  .ticker-text {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: rgba(184,196,218,0.55);
    text-transform: uppercase;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ── Main bar ── */
  .header-main {
    background: rgba(7,12,21,0.97);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .header-inner {
    width: min(1180px, calc(100% - 32px));
    margin: 0 auto;
    height: 60px;
    display: flex;
    align-items: center;
    gap: 16px;
  }

  /* ── Brand ── */
  .site-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    flex-shrink: 0;
  }
  .site-brand-mark {
    width: 36px; height: 36px;
    border-radius: 10px;
    background: rgba(214,64,69,0.15);
    border: 1px solid rgba(214,64,69,0.3);
    display: grid;
    place-items: center;
    flex-shrink: 0;
  }
  .site-brand-copy {
    display: flex;
    flex-direction: column;
    line-height: 1.15;
  }
  .site-brand-copy strong {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.98rem;
    font-weight: 900;
    letter-spacing: 0.04em;
    color: #e8f0ff;
    text-transform: uppercase;
    white-space: nowrap;
  }
  .site-brand-copy small {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(184,196,218,0.45);
  }

  /* ── Desktop nav ── */
  .desktop-nav-wrap {
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }
  .site-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 4px;
    width: 100%;
  }
  .site-nav-main {
    display: flex;
    align-items: center;
    gap: 2px;
  }
  .site-nav-secondary {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .site-nav-link {
    display: inline-flex;
    align-items: center;
    height: 34px;
    padding: 0 12px;
    border-radius: 8px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.82rem;
    font-weight: 800;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    text-decoration: none;
    color: rgba(184,196,218,0.6);
    transition: color 0.13s, background 0.13s;
    white-space: nowrap;
  }
  .site-nav-link:hover {
    color: #e8f0ff;
    background: rgba(255,255,255,0.06);
  }
  .site-nav-link.active {
    color: #e8f0ff;
    background: rgba(255,255,255,0.08);
  }

  /* ── Dropdown ── */
  .nav-dropdown { position: relative; }
  .nav-dropdown-toggle {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    height: 34px;
    padding: 0 12px;
    border-radius: 8px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.08);
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.8rem;
    font-weight: 800;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: rgba(184,196,218,0.6);
    cursor: pointer;
    transition: all 0.13s;
    white-space: nowrap;
  }
  .nav-dropdown-toggle:hover {
    color: #e8f0ff;
    background: rgba(255,255,255,0.06);
    border-color: rgba(255,255,255,0.15);
  }
  .nav-caret { font-size: 0.6rem; transition: transform 0.15s; }
  .nav-dropdown.open .nav-caret { transform: rotate(180deg); }
  .nav-dropdown-menu {
    display: none;
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    min-width: 160px;
    background: rgba(13,22,38,0.98);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 6px;
    box-shadow: 0 16px 40px rgba(0,0,0,0.5);
    z-index: 1000;
  }
  .nav-dropdown.open .nav-dropdown-menu { display: flex; flex-direction: column; gap: 2px; }
  .dropdown-link {
    border-radius: 7px;
    padding: 8px 12px;
  }

  /* ── CTA ── */
  .nav-cta {
    display: inline-flex;
    align-items: center;
    height: 34px;
    padding: 0 16px;
    border-radius: 8px;
    background: linear-gradient(135deg, #d64045, #f05b4f);
    color: #fff;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.8rem;
    font-weight: 900;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    text-decoration: none;
    box-shadow: 0 4px 14px rgba(214,64,69,0.3);
    transition: all 0.13s;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .nav-cta:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(214,64,69,0.45);
  }

  /* ── Hamburger toggle — ALWAYS hidden on desktop, shown on mobile ── */
  .menu-toggle {
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.04);
    cursor: pointer;
    margin-left: auto;
    padding: 0;
    flex-shrink: 0;
    transition: background 0.13s, border-color 0.13s;
  }
  .menu-toggle:hover {
    background: rgba(255,255,255,0.09);
    border-color: rgba(255,255,255,0.18);
  }
  .menu-toggle span {
    display: block;
    width: 18px;
    height: 2px;
    border-radius: 2px;
    background: rgba(184,196,218,0.8);
    transition: transform 0.22s ease, opacity 0.22s ease, width 0.22s ease;
    transform-origin: center;
  }
  /* Animated X when open */
  .menu-toggle[aria-expanded="true"] span:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }
  .menu-toggle[aria-expanded="true"] span:nth-child(2) {
    opacity: 0;
    transform: scaleX(0);
  }
  .menu-toggle[aria-expanded="true"] span:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }

  /* ── Mobile menu panel ── */
  .mobile-menu {
    background: rgba(9,16,28,0.98);
    border-top: 1px solid rgba(255,255,255,0.07);
    padding: 16px;
    max-height: calc(100vh - 88px);
    overflow-y: auto;
  }
  .mobile-menu[hidden] { display: none; }

  .mobile-nav { display: flex; flex-direction: column; gap: 8px; }
  .mobile-nav-group { display: flex; flex-direction: column; gap: 2px; }
  .mobile-nav-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.6rem;
    font-weight: 800;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(184,196,218,0.3);
    padding: 8px 12px 4px;
  }
  .mobile-nav .site-nav-link {
    height: 46px;
    padding: 0 16px;
    border-radius: 10px;
    font-size: 0.95rem;
    letter-spacing: 0.05em;
    border: 1px solid rgba(255,255,255,0.05);
    justify-content: flex-start;
  }
  .mobile-nav .site-nav-link.active {
    background: rgba(214,64,69,0.1);
    border-color: rgba(214,64,69,0.25);
    color: #ffb3b5;
  }
  .mobile-nav-cta {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    border-radius: 12px;
    background: linear-gradient(135deg, #d64045, #f05b4f);
    color: #fff;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.95rem;
    font-weight: 900;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    text-decoration: none;
    margin-top: 8px;
    box-shadow: 0 6px 20px rgba(214,64,69,0.3);
  }

  /* ── Body scroll lock when menu open ── */
  body.menu-open { overflow: hidden; }

  /* ── RESPONSIVE BREAKPOINTS ── */
  @media (max-width: 900px) {
    .desktop-nav-wrap { display: none !important; }
    .menu-toggle      { display: flex !important; }
  }
  @media (min-width: 901px) {
    .menu-toggle  { display: none !important; }
    .mobile-menu  { display: none !important; }
  }
`;

/* ── path helpers ── */
const _path = window.location.pathname.toLowerCase();

function normalizePath(value) {
  if (!value) return "/";
  return value.replace(/\/+$/, "") || "/";
}

function isActivePath(targetPath) {
  const current = normalizePath(_path);
  const target  = normalizePath(targetPath.toLowerCase());
  return current === target || current.startsWith(target + "/");
}

/* ── render helpers ── */
function renderNavLinks(links, extraClass = "") {
  return links.map(({ href, label }) => `
    <a href="${href}"
       class="site-nav-link ${isActivePath(href) ? "active" : ""} ${extraClass}">
      ${label}
    </a>
  `).join("");
}

function renderLogo() {
  return `<span style="font-size:1.5rem;line-height:1;" aria-hidden="true">${CONFIG.logoEmoji}</span>`;
}

/* ── main render ── */
function renderHeader() {
  return `
    <style>${HEADER_STYLES}</style>

    <div class="site-header">

      <!-- Ticker -->
      <div class="score-ticker">
        <div class="score-ticker-inner">
          <span class="ticker-pill">${CONFIG.tickerSeason}</span>
          <span class="ticker-text">
            ${CONFIG.siteName} &bull; Community league coverage &bull;
            Schedule &bull; Rosters &bull; Stats &bull; Standings
          </span>
        </div>
      </div>

      <!-- Main bar -->
      <div class="header-main">
        <div class="header-inner">

          <!-- Brand -->
          <a href="/" class="site-brand" aria-label="${CONFIG.siteName} home">
            <span class="site-brand-mark" aria-hidden="true">${renderLogo()}</span>
            <span class="site-brand-copy">
              <strong>${CONFIG.siteName}</strong>
              <small>${CONFIG.siteTagline}</small>
            </span>
          </a>

          <!-- Hamburger (mobile only) -->
          <button
            class="menu-toggle"
            id="menu-toggle"
            type="button"
            aria-expanded="false"
            aria-controls="mobile-menu"
            aria-label="Open navigation menu"
          ><span></span><span></span><span></span></button>

          <!-- Desktop nav -->
          <div class="desktop-nav-wrap">
            <nav class="site-nav desktop-nav" aria-label="Primary navigation">
              <div class="site-nav-main">
                ${renderNavLinks(CONFIG.primaryLinks)}
              </div>
              <div class="site-nav-secondary">
                <div class="nav-dropdown">
                  <button class="nav-dropdown-toggle" type="button" aria-expanded="false">
                    League Info <span class="nav-caret">▾</span>
                  </button>
                  <div class="nav-dropdown-menu">
                    ${renderNavLinks(CONFIG.leagueLinks, "dropdown-link")}
                  </div>
                </div>
                <a href="${CONFIG.ctaHref}" class="nav-cta">${CONFIG.ctaLabel}</a>
              </div>
            </nav>
          </div>

        </div>

        <!-- Mobile menu panel -->
        <div class="mobile-menu" id="mobile-menu" hidden>
          <nav class="mobile-nav" aria-label="Mobile navigation">
            <div class="mobile-nav-group">
              <div class="mobile-nav-label">Main</div>
              ${renderNavLinks(CONFIG.primaryLinks)}
            </div>
            <div class="mobile-nav-group" style="margin-top:8px;">
              <div class="mobile-nav-label">League Info</div>
              ${renderNavLinks(CONFIG.leagueLinks)}
            </div>
            <a href="${CONFIG.ctaHref}" class="mobile-nav-cta">${CONFIG.ctaLabel}</a>
          </nav>
        </div>

      </div>
    </div>
  `;
}

/* ── interactions ── */
function setupHeaderInteractions() {
  const toggle     = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (toggle && mobileMenu) {
    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      mobileMenu.hidden = isOpen;
      document.body.classList.toggle("menu-open", !isOpen);
    });

    // Close on outside tap
    document.addEventListener("click", e => {
      if (!e.target.closest(".site-header")) {
        toggle.setAttribute("aria-expanded", "false");
        mobileMenu.hidden = true;
        document.body.classList.remove("menu-open");
      }
    });

    // Close on resize to desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        toggle.setAttribute("aria-expanded", "false");
        mobileMenu.hidden = true;
        document.body.classList.remove("menu-open");
      }
    });
  }

  // Desktop dropdown
  document.querySelectorAll(".nav-dropdown-toggle").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
      btn.parentElement.classList.toggle("open", !expanded);
    });
  });

  // Close dropdown on outside click
  document.addEventListener("click", e => {
    document.querySelectorAll(".nav-dropdown").forEach(dropdown => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove("open");
        const btn = dropdown.querySelector(".nav-dropdown-toggle");
        if (btn) btn.setAttribute("aria-expanded", "false");
      }
    });
  });
}

/* ── init ── */
document.addEventListener("DOMContentLoaded", () => {
  const target = document.getElementById("site-header");
  if (!target) return;
  target.innerHTML = renderHeader();
  setupHeaderInteractions();
});
