const path = window.location.pathname.toLowerCase();

function normalizePath(value) {
  if (!value) return "/";
  return value.replace(/\/+$/, "") || "/";
}

function isActivePath(targetPath) {
  const current = normalizePath(path);
  const target = normalizePath(targetPath.toLowerCase());
  return current === target || current.startsWith(target + "/");
}

function renderNavLinks(links, className = "") {
  return links.map(link => `
    <a href="${link.href}" class="site-nav-link ${isActivePath(link.href) ? "active" : ""} ${className}">
      ${link.label}
    </a>
  `).join("");
}

function renderHeader() {
  const primaryLinks = [
    { label: "Home", href: "/" },
    { label: "Schedule", href: "/schedule.html" },
    { label: "Rosters", href: "/rosters.html" },
    { label: "Stats", href: "/stats.html" },
    { label: "Standings", href: "/standings.html" }
  ];

  const leagueLinks = [
    { label: "Rules", href: "/league-rules/" },
    { label: "Waiver", href: "/waiver-and-conduct/" },
    { label: "Signup", href: "/signup/" }
  ];

  return `
    <div class="site-header">
      <div class="score-ticker">
        <div class="score-ticker-inner">
          <span class="ticker-pill">Spring 2026</span>
          <span class="ticker-text">Baseball For Bums • Community league coverage • Schedule • Rosters • Stats • Standings</span>
        </div>
      </div>

      <div class="header-main">
        <div class="header-inner">
          <a href="/" class="site-brand" aria-label="Baseball For Bums home">
            <span class="site-brand-mark" aria-hidden="true">
              <span class="baseball-mark"></span>
            </span>

            <span class="site-brand-copy">
              <strong>Baseball For Bums</strong>
              <small>League Central</small>
            </span>
          </a>

          <button
            class="menu-toggle"
            id="menu-toggle"
            type="button"
            aria-expanded="false"
            aria-controls="mobile-menu"
            aria-label="Open navigation menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div class="desktop-nav-wrap">
            <nav class="site-nav desktop-nav" aria-label="Primary navigation">
              <div class="site-nav-main">
                ${renderNavLinks(primaryLinks)}
              </div>

              <div class="site-nav-secondary">
                <div class="nav-dropdown">
                  <button class="nav-dropdown-toggle" type="button" aria-expanded="false">
                    League Info
                    <span class="nav-caret">▾</span>
                  </button>

                  <div class="nav-dropdown-menu">
                    ${renderNavLinks(leagueLinks, "dropdown-link")}
                  </div>
                </div>

                <a href="/signup/" class="nav-cta">Register</a>
              </div>
            </nav>
          </div>
        </div>

        <div class="mobile-menu" id="mobile-menu" hidden>
          <nav class="mobile-nav" aria-label="Mobile navigation">
            <div class="mobile-nav-group">
              <div class="mobile-nav-label">Main</div>
              ${renderNavLinks(primaryLinks)}
            </div>

            <div class="mobile-nav-group">
              <div class="mobile-nav-label">League Info</div>
              ${renderNavLinks(leagueLinks)}
            </div>

            <a href="/signup/" class="mobile-nav-cta">Register Now</a>
          </nav>
        </div>
      </div>
    </div>
  `;
}

function setupHeaderInteractions() {
  const toggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const dropdownToggles = document.querySelectorAll(".nav-dropdown-toggle");

  if (toggle && mobileMenu) {
    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      mobileMenu.hidden = isOpen;
      document.body.classList.toggle("menu-open", !isOpen);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        toggle.setAttribute("aria-expanded", "false");
        mobileMenu.hidden = true;
        document.body.classList.remove("menu-open");
      }
    });
  }

  dropdownToggles.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
      btn.parentElement.classList.toggle("open", !expanded);
    });
  });

  document.addEventListener("click", (e) => {
    document.querySelectorAll(".nav-dropdown").forEach(dropdown => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove("open");
        const btn = dropdown.querySelector(".nav-dropdown-toggle");
        if (btn) btn.setAttribute("aria-expanded", "false");
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const target = document.getElementById("site-header");
  if (!target) return;

  target.innerHTML = renderHeader();
  setupHeaderInteractions();
});