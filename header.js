/* ============================================================
   HEADER.JS — Baseball For Bums
   Edit the CONFIG block below to change anything site-wide.
   No other files need to be touched.
============================================================ */

const CONFIG = {
  siteName:    "Baseball For Bums",
  siteTagline: "League Central",
  logoEmoji:   "⚾",                  // ← change this to any emoji or swap for an <img> tag
  tickerSeason:"Spring 2026",
  ctaLabel:    "Join Waitlist",       // ← top-right button label
  ctaHref:     "/signup/",            // ← top-right button destination

  primaryLinks: [
    { label: "Home",      href: "/" },
    { label: "Schedule",  href: "/schedule.html" },
    { label: "Rosters",   href: "/rosters.html" },
    { label: "Stats",     href: "/stats.html" },
    { label: "Standings", href: "/standings.html" }
  ],

  leagueLinks: [
    { label: "Rules",   href: "/league-rules/" },
    { label: "Waiver",  href: "/waiver-and-conduct/" },
    { label: "Sign Up", href: "/signup/" }
  ]
};

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
  // Swap CONFIG.logoEmoji for an <img> tag here if you ever want a real image:
  // e.g. `<img src="/logo.svg" alt="" width="28" height="28">`
  return `<span style="font-size:1.5rem;line-height:1;" aria-hidden="true">${CONFIG.logoEmoji}</span>`;
}

/* ── main render ── */
function renderHeader() {
  return `
    <div class="site-header">

      <!-- Score / season ticker -->
      <div class="score-ticker">
        <div class="score-ticker-inner">
          <span class="ticker-pill">${CONFIG.tickerSeason}</span>
          <span class="ticker-text">
            ${CONFIG.siteName} &bull; Community league coverage &bull;
            Schedule &bull; Rosters &bull; Stats &bull; Standings
          </span>
        </div>
      </div>

      <!-- Main header bar -->
      <div class="header-main">
        <div class="header-inner">

          <!-- Brand -->
          <a href="/" class="site-brand" aria-label="${CONFIG.siteName} home">
            <span class="site-brand-mark" aria-hidden="true">
              ${renderLogo()}
            </span>
            <span class="site-brand-copy">
              <strong>${CONFIG.siteName}</strong>
              <small>${CONFIG.siteTagline}</small>
            </span>
          </a>

          <!-- Mobile menu toggle -->
          <button
            class="menu-toggle"
            id="menu-toggle"
            type="button"
            aria-expanded="false"
            aria-controls="mobile-menu"
            aria-label="Open navigation menu"
          >
            <span></span><span></span><span></span>
          </button>

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
            <div class="mobile-nav-group">
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

  // Mobile menu open/close
  if (toggle && mobileMenu) {
    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      mobileMenu.hidden = isOpen;
      document.body.classList.toggle("menu-open", !isOpen);
    });

    // Auto-close on resize back to desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        toggle.setAttribute("aria-expanded", "false");
        mobileMenu.hidden = true;
        document.body.classList.remove("menu-open");
      }
    });
  }

  // Desktop dropdown toggle
  document.querySelectorAll(".nav-dropdown-toggle").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
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