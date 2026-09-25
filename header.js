/* ============================================================
   HEADER.JS — Baseball For Bums site chrome + site map engine
   Edit CONFIG / SITE below to change anything site-wide.

   Renders on every page:
     • Sticky header w/ desktop nav, "League" menu, search, CTA
     • Mobile menu + bottom tab bar
     • Breadcrumbs (into [data-crumbs]) + BreadcrumbList JSON-LD
     • "Keep exploring" related-page tiles
     • Footer with the full site map + team links
     • Quick Jump search (Ctrl/⌘+K or "/") across pages,
       rule sections, teams, and players
     • Scroll-spy for any .toc sidebar
============================================================ */

const CONFIG = {
  siteName:    "Baseball For Bums",
  siteTagline: "League Central",
  location:    "Staten Island",
  season:      "Spring 2026",
  origin:      "https://baseballforbums.com",
  ctaLabel:    "Join Waitlist",
  ctaHref:     "/waitlist"
};

/* ── SITE MAP ─────────────────────────────────────────────────
   One entry per page. `path` is the canonical URL.
   `aliases` are other URLs that load the same page.
   `related` drives the "Keep exploring" block.
   `group` places it in nav/footer/site map.
─────────────────────────────────────────────────────────────── */
const SITE = {
  groups: [
    { id: "season", label: "Season",      desc: "Games, results and numbers" },
    { id: "league", label: "League Info", desc: "How the league works" },
    { id: "join",   label: "Join",        desc: "Get on a team" }
  ],
  pages: [
    { id: "home", path: "/", title: "Home", icon: "⚾", group: null,
      desc: "League hub — standings snapshot, latest results and leaders.",
      keywords: "home main start league central", related: ["schedule", "standings", "stats"] },

    { id: "schedule", path: "/schedule", aliases: ["/schedule.html"], title: "Schedule", icon: "📅", group: "season", nav: true, tab: true,
      desc: "Every game night — dates, fields, results and the postseason bracket.",
      keywords: "games calendar results scores fields playoffs championship all-star rainout",
      related: ["standings", "scorecard", "rules"] },

    { id: "standings", path: "/standings", aliases: ["/standings.html"], title: "Standings", icon: "🏆", group: "season", nav: true, tab: true,
      desc: "Team records, run differential, games back and league leaders.",
      keywords: "table records wins losses run differential playoff race gb",
      related: ["schedule", "stats", "rosters"] },

    { id: "stats", path: "/stats", aliases: ["/stats.html"], title: "Stats", icon: "📊", group: "season", nav: true, tab: true,
      desc: "Full batting stats and leaderboards for every player.",
      keywords: "batting average ops obp slg home runs rbi hits leaderboard leaders players",
      related: ["rosters", "standings", "schedule"] },

    { id: "rosters", path: "/rosters", aliases: ["/rosters.html"], title: "Rosters", icon: "👥", group: "season", nav: true,
      desc: "All six teams, their players and top performers.",
      keywords: "teams players lineup roster",
      related: ["stats", "standings", "schedule"] },

    { id: "rules", path: "/league-rules/", title: "League Rules", short: "Rules", icon: "📖", group: "league",
      desc: "Game basics, equipment, base running, conduct and playoff format.",
      keywords: "rulebook regulations bats cleats base running stealing tag up ghost runner tiebreaker",
      related: ["waiver", "schedule", "signup"] },

    { id: "waiver", path: "/waiver-and-conduct/", title: "Waiver & Conduct", short: "Waiver", icon: "🤝", group: "league",
      desc: "Liability waiver and code of conduct every player agrees to.",
      keywords: "waiver liability code of conduct discipline suspension media release",
      related: ["rules", "waitlist", "signup"] },

    { id: "scorecard", path: "/scorecard", aliases: ["/scorecard.html"], title: "Printable Scorecard", short: "Scorecard", icon: "🖨️", group: "league",
      desc: "Official scorecard for scorekeepers — two per sheet.",
      keywords: "print scorekeeper score sheet pdf", related: ["schedule", "rules"] },

    { id: "signup", path: "/signup/", title: "Registration", icon: "📝", group: "join",
      desc: "Where registration stands and how to get on a team.",
      keywords: "register sign up join fee price cost how to play", related: ["waitlist", "rules", "waiver"] },

    { id: "waitlist", path: "/waitlist", aliases: ["/waitlist.html", "/waitlist/"], title: "Join the Waitlist", short: "Waitlist", icon: "✋", group: "join",
      desc: "Sign up as a sub — we call on the waitlist when teams are short.",
      keywords: "sub substitute waitlist sign up form join", related: ["signup", "rules", "waiver"] },

    { id: "sitemap", path: "/sitemap/", title: "Site Map", icon: "🧭", group: null,
      desc: "Every page, section and team on the site in one place.",
      keywords: "sitemap all pages index directory help navigate", related: ["schedule", "rules", "waitlist"] }
  ],

  /* Deep links into long pages — searchable from anywhere */
  sections: [
    { page: "rules", hash: "r-philosophy",  title: "League Philosophy" },
    { page: "rules", hash: "r-basics",      title: "Game Basics",           keywords: "innings players subs lineup kid catch" },
    { page: "rules", hash: "r-time",        title: "Time & Grace Period",   keywords: "late grace 15 minutes forfeit" },
    { page: "rules", hash: "r-equipment",   title: "Equipment",             keywords: "bats balls cleats metal uniforms" },
    { page: "rules", hash: "r-fielding",    title: "Fielding & Substitutions", keywords: "infield fly shifting" },
    { page: "rules", hash: "r-baserunning", title: "Base Running",          keywords: "stealing leading off courtesy runner tag up overthrow slide" },
    { page: "rules", hash: "r-conduct",     title: "Umpires & Conduct",     keywords: "ump ejection alcohol arguing" },
    { page: "rules", hash: "r-ties",        title: "Tie Games",             keywords: "extra innings ghost runner" },
    { page: "rules", hash: "r-standings",   title: "Standings & Playoffs",  keywords: "run differential tiebreaker head to head single elimination" },
    { page: "waiver", hash: "s01", title: "Assumption of Risk" },
    { page: "waiver", hash: "s02", title: "Waiver & Release of Liability" },
    { page: "waiver", hash: "s03", title: "Medical Treatment & Emergency Care" },
    { page: "waiver", hash: "s04", title: "Fitness to Participate" },
    { page: "waiver", hash: "s05", title: "Sportsmanship & Code of Conduct", keywords: "fighting harassment profanity" },
    { page: "waiver", hash: "s06", title: "Commissioner Authority & Discipline", keywords: "suspension penalty committee appeal refund" },
    { page: "waiver", hash: "s07", title: "Scheduling & Rainouts", keywords: "rain makeup tuesday weather" },
    { page: "waiver", hash: "s08", title: "Media Release", keywords: "photos video opt out" },
    { page: "schedule", hash: "postseason", title: "Postseason & All-Star Game", keywords: "playoffs semifinals championship final all star" },
    { page: "schedule", hash: "field-guide", title: "Field Guide", keywords: "field 1 field 2 field 3 left right small" },
    { page: "stats", hash: "leaderboards", title: "Stat Leaderboards" },
    { page: "stats", hash: "full-stats", title: "Full Stats Table" },
    { page: "standings", hash: "leaders", title: "League Leaders" }
  ]
};

const TEAM_LIST = (window.BFB && window.BFB.TEAMS) || [];

/* ── path helpers ── */
function normPath(p) {
  let s = String(p || "/").split(/[?#]/)[0].toLowerCase();
  s = s.replace(/\/index(\.html)?$/, "/").replace(/\.html$/, "");
  s = s.replace(/\/+$/, "");
  return s || "/";
}
function pageById(id) { return SITE.pages.find(p => p.id === id); }
function currentPage() {
  const here = normPath(location.pathname);
  return SITE.pages.find(p => [p.path].concat(p.aliases || []).some(a => normPath(a) === here)) || null;
}
const PAGE = currentPage();
const isActive = p => PAGE && PAGE.id === p.id;
const esc = s => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* ── icons (inline SVG) ── */
const ICON = {
  search: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  menu:   '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  close:  '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  caret:  '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>',
  home:   '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/></svg>',
  cal:    '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  trophy: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4h8v5a4 4 0 0 1-8 0V4Z"/><path d="M16 6h3a3 3 0 0 1-3 4M8 6H5a3 3 0 0 0 3 4M12 13v4M8 21h8M9 17h6"/></svg>',
  chart:  '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
  arrow:  '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
};
const TAB_ICON = { home: ICON.home, schedule: ICON.cal, standings: ICON.trophy, stats: ICON.chart };

/* ── styles (self-contained so the chrome works on every page) ── */
const HEADER_STYLES = `
#site-header { min-height: calc(var(--header-h, 64px) + 30px); }
.site-header { position: sticky; top: 0; z-index: 9000; font-family: var(--font-body); }

.ticker { height: 30px; display: flex; align-items: center; background: linear-gradient(90deg, #2b8ad6, #5db8f2); border-bottom: 0; overflow: hidden; }
.ticker .wrap { display: flex; align-items: center; gap: 12px; min-width: 0; }
.ticker-pill { flex-shrink: 0; padding: 2px 9px; border-radius: 5px; background: rgba(255,255,255,0.22); color: #ffffff; font-family: var(--font-display); font-size: .68rem; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; }
.ticker-text { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: var(--font-display); font-size: .8rem; font-weight: 700; letter-spacing: .05em; color: rgba(255,255,255,.92); }
.ticker-text a { color: #fff; text-decoration: underline; }
.ticker-text a:hover { text-decoration: underline; }
.ticker-text b { color: #fff; font-weight: 800; }

.bar { background: rgba(255,255,255,0.9); backdrop-filter: saturate(160%) blur(18px); -webkit-backdrop-filter: saturate(160%) blur(18px); border-bottom: 1px solid var(--line); }
.bar .wrap { height: var(--header-h, 64px); display: flex; align-items: center; gap: 18px; }

.brand { display: flex; align-items: center; gap: 11px; text-decoration: none; flex-shrink: 0; }
.brand-mark { width: 38px; height: 38px; border-radius: 11px; display: grid; place-items: center; font-size: 1.3rem; background: linear-gradient(135deg, #e3f2ff, #b9dfff); border: 1px solid rgba(59,158,230,.35); }
.brand-copy { display: flex; flex-direction: column; line-height: 1.1; }
.brand-copy strong { font-family: var(--font-display); font-size: 1.08rem; font-weight: 900; letter-spacing: .04em; text-transform: uppercase; color: var(--text); white-space: nowrap; }
.brand-copy small { font-family: var(--font-display); font-size: .66rem; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; color: var(--accent); }

.nav { display: flex; align-items: center; gap: 2px; margin-left: 8px; }
.nav-link, .nav-menu-btn { display: inline-flex; align-items: center; gap: 6px; height: 38px; padding: 0 13px; border-radius: 10px; border: 0; background: transparent; cursor: pointer; text-decoration: none; font-family: var(--font-display); font-size: .92rem; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); transition: color .15s, background .15s; white-space: nowrap; }
.nav-link:hover, .nav-menu-btn:hover, .nav-menu.open .nav-menu-btn { color: var(--text); background: rgba(13,34,64,.06); }
.nav-link[aria-current="page"] { color: var(--text); background: rgba(13,34,64,.07); box-shadow: inset 0 -2px 0 var(--accent); }
.nav-menu-btn svg { transition: transform .18s; }
.nav-menu.open .nav-menu-btn svg { transform: rotate(180deg); }
.nav-menu-btn.has-active { color: var(--text); box-shadow: inset 0 -2px 0 var(--accent); }

.nav-menu { position: relative; }
.nav-panel { position: absolute; top: calc(100% + 10px); left: 50%; transform: translate(-50%, 6px); width: 520px; padding: 10px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px; border-radius: 16px; background: #ffffff; border: 1px solid var(--line-2); box-shadow: 0 24px 60px rgba(13,34,64,0.193); opacity: 0; pointer-events: none; transition: opacity .16s, transform .16s; }
.nav-menu.open .nav-panel { opacity: 1; pointer-events: auto; transform: translate(-50%, 0); }
.nav-panel::before { content: ""; position: absolute; left: 0; right: 0; top: -14px; height: 14px; } /* hover bridge over the gap */
.nav-panel a { display: flex; gap: 12px; padding: 11px 12px; border-radius: 11px; text-decoration: none; transition: background .12s; }
.nav-panel a:hover, .nav-panel a[aria-current="page"] { background: rgba(13,34,64,.05); }
.nav-panel .ico { width: 34px; height: 34px; flex-shrink: 0; border-radius: 9px; display: grid; place-items: center; background: rgba(13,34,64,.05); font-size: 1rem; }
.nav-panel .t { display: block; font-family: var(--font-display); font-weight: 800; font-size: .98rem; letter-spacing: .04em; text-transform: uppercase; color: var(--text); }
.nav-panel .d { display: block; font-size: .8rem; line-height: 1.4; color: var(--muted); }
.nav-panel-foot { grid-column: 1 / -1; display: flex; justify-content: space-between; align-items: center; margin-top: 4px; padding: 10px 12px 4px; border-top: 1px solid var(--line); font-size: .8rem; color: var(--muted); }
.nav-panel-foot a { display: inline-flex; padding: 0; gap: 6px; align-items: center; color: var(--gold); font-weight: 700; }
.nav-panel-foot a:hover { background: none; text-decoration: underline; }

.bar-actions { margin-left: auto; display: flex; align-items: center; gap: 10px; }
.search-btn { display: inline-flex; align-items: center; gap: 10px; height: 38px; padding: 0 10px 0 12px; border-radius: 10px; border: 1px solid var(--line-2); background: rgba(13,34,64,.03); color: var(--muted); cursor: pointer; font-size: .88rem; transition: border-color .15s, color .15s; }
.search-btn:hover { color: var(--text); border-color: rgba(13,34,64,.22); }
.search-btn kbd { font-family: var(--font-body); font-size: .7rem; padding: 2px 6px; border-radius: 5px; border: 1px solid var(--line-2); color: var(--muted); }
.cta { display: inline-flex; align-items: center; height: 38px; padding: 0 16px; border-radius: 999px; background: linear-gradient(135deg, var(--accent), var(--accent-hi)); color: #fff; text-decoration: none; font-family: var(--font-display); font-weight: 900; font-size: .88rem; letter-spacing: .1em; text-transform: uppercase; box-shadow: 0 6px 18px rgba(59,158,230,.35); transition: transform .15s, box-shadow .15s; white-space: nowrap; }
.cta:hover { transform: translateY(-1px); box-shadow: 0 10px 24px rgba(59,158,230,.45); }
.icon-btn { display: none; width: 40px; height: 40px; border-radius: 10px; border: 1px solid var(--line-2); background: rgba(13,34,64,.03); color: var(--text-2); cursor: pointer; place-items: center; }

.mobile-menu { background: #ffffff; border-bottom: 1px solid var(--line); max-height: calc(100vh - 94px); overflow-y: auto; }
.mobile-menu[hidden] { display: none; }
.mobile-menu .wrap { padding: 14px 0 20px; display: grid; gap: 16px; }
.mm-group h4 { font-family: var(--font-display); font-size: .7rem; font-weight: 800; letter-spacing: .2em; text-transform: uppercase; color: var(--faint); margin: 0 0 6px 4px; }
.mm-links { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.mm-links a { display: flex; align-items: center; gap: 10px; min-height: 48px; padding: 0 14px; border-radius: 12px; border: 1px solid var(--line); background: rgba(13,34,64,.025); text-decoration: none; color: var(--text-2); font-family: var(--font-display); font-weight: 800; font-size: 1rem; letter-spacing: .04em; text-transform: uppercase; }
.mm-links a[aria-current="page"] { border-color: var(--accent); background: var(--accent); color: #fff; }
.mm-teams { display: flex; flex-wrap: wrap; gap: 6px; }
.mm-teams a { display: inline-flex; align-items: center; gap: 7px; padding: 7px 12px; border-radius: 999px; border: 1px solid var(--line); text-decoration: none; color: var(--text-2); font-family: var(--font-display); font-weight: 800; font-size: .85rem; letter-spacing: .04em; text-transform: uppercase; }

.bottom-nav { display: none; }

@media (max-width: 1020px) {
  .search-btn span, .search-btn kbd { display: none; }
  .search-btn { width: 40px; justify-content: center; padding: 0; }
}
@media (max-width: 900px) {
  .nav, .cta { display: none; }
  .icon-btn { display: grid; }
  .search-btn { height: 40px; }
  .bottom-nav { display: grid; grid-template-columns: repeat(5, 1fr); position: fixed; left: 0; right: 0; bottom: 0; z-index: 9000; padding: 6px 6px calc(6px + env(safe-area-inset-bottom)); background: rgba(255,255,255,.96); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-top: 1px solid var(--line-2); }
  .bottom-nav a, .bottom-nav button { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 6px 0; border: 0; background: none; text-decoration: none; color: var(--muted); font-family: var(--font-display); font-size: .68rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; cursor: pointer; border-radius: 10px; }
  .bottom-nav [aria-current="page"] { color: var(--text); background: rgba(13,34,64,.05); }
  .bottom-nav [aria-current="page"] svg { color: var(--accent-hi); }
  body { padding-bottom: calc(66px + env(safe-area-inset-bottom)); }
}
@media (max-width: 420px) { .brand-copy small { display: none; } .mm-links { grid-template-columns: 1fr; } }
body.menu-open { overflow: hidden; }

/* related */
.related { padding: 12px 0 40px; }
.related-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 14px; }
@media (max-width: 760px) { .related-grid { grid-template-columns: 1fr; } }

/* footer */
.site-footer { margin-top: 20px; border-top: 1px solid var(--line); background: #ffffff; }
.foot-grid { display: grid; grid-template-columns: 1.4fr repeat(4, 1fr); gap: 28px; padding: 40px 0 28px; }
.foot-brand p { margin-top: 12px; color: var(--muted); font-size: .9rem; max-width: 34ch; line-height: 1.6; }
.foot-col h4 { font-family: var(--font-display); font-size: .74rem; font-weight: 800; letter-spacing: .2em; text-transform: uppercase; color: var(--faint); margin-bottom: 12px; }
.foot-col ul { list-style: none; display: grid; gap: 8px; }
.foot-col a { color: var(--text-2); text-decoration: none; font-size: .92rem; display: inline-flex; align-items: center; gap: 8px; }
.foot-col a:hover { color: var(--text); text-decoration: underline; text-underline-offset: 3px; }
.foot-bottom { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 10px; padding: 16px 0 28px; border-top: 1px solid var(--line); color: var(--faint); font-size: .82rem; }
.foot-bottom a { color: var(--muted); }
.powered { display: inline-flex; align-items: center; gap: 12px; padding: 8px 14px 8px 16px; border-radius: 14px; border: 1px solid var(--line-2); background: #fff; text-decoration: none; color: var(--muted); font-family: var(--font-display); font-weight: 800; font-size: .8rem; letter-spacing: .14em; text-transform: uppercase; box-shadow: var(--shadow-sm); transition: border-color .15s, box-shadow .15s; }
.powered:hover { border-color: var(--accent); box-shadow: var(--shadow); }
.powered img { height: 30px; width: auto; }
.foot-bottom { align-items: center; }
@media (max-width: 900px) { .foot-grid { grid-template-columns: 1fr 1fr; } .foot-brand { grid-column: 1 / -1; } }

/* quick jump */
.qj { position: fixed; inset: 0; z-index: 10000; display: none; align-items: flex-start; justify-content: center; padding: 10vh 16px 16px; background: rgba(13,34,64,.28); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); }
.qj.open { display: flex; }
.qj-box { width: min(640px, 100%); max-height: 74vh; display: flex; flex-direction: column; border-radius: 18px; background: #ffffff; border: 1px solid var(--line-2); box-shadow: 0 30px 80px rgba(13,34,64,0.21); overflow: hidden; animation: rise .18s ease both; }
.qj-input { display: flex; align-items: center; gap: 12px; padding: 0 16px; border-bottom: 1px solid var(--line); color: var(--muted); }
.qj-input input { flex: 1; min-height: 58px; border: 0 !important; background: transparent !important; box-shadow: none !important; padding: 0; font-size: 1.05rem; color: var(--text); }
.qj-input kbd { font-size: .7rem; padding: 2px 6px; border-radius: 5px; border: 1px solid var(--line-2); color: var(--muted); }
.qj-list { overflow-y: auto; padding: 8px; }
.qj-group { padding: 10px 10px 4px; font-family: var(--font-display); font-size: .7rem; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; color: var(--faint); }
.qj-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 11px; text-decoration: none; color: var(--text-2); }
.qj-item .ico { width: 30px; height: 30px; flex-shrink: 0; border-radius: 8px; display: grid; place-items: center; background: rgba(13,34,64,.05); font-size: .95rem; }
.qj-item .t { color: var(--text); font-weight: 600; }
.qj-item .d { font-size: .8rem; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.qj-item .txt { min-width: 0; flex: 1; display: flex; flex-direction: column; }
.qj-item .go { color: var(--faint); }
.qj-item.sel { background: rgba(59,158,230,.14); }
.qj-item.sel .go { color: var(--accent-hi); }
.qj-empty { padding: 28px; text-align: center; color: var(--muted); }
.qj-foot { display: flex; gap: 16px; padding: 10px 16px; border-top: 1px solid var(--line); font-size: .75rem; color: var(--faint); }
.qj-foot kbd { font-size: .68rem; padding: 1px 5px; border-radius: 4px; border: 1px solid var(--line-2); margin-right: 4px; }
@media (max-width: 640px) { .qj { padding-top: 12px; } .qj-foot { display: none; } }
`;

/* ── ticker: season status from the schedule ── */
function tickerText() {
  const B = window.BFB;
  if (!B) return `${CONFIG.siteName} · Schedule · Standings · Stats · Rosters`;
  const games = B.SCHEDULE;
  const finals = games.filter(g => B.gameState(g) === "final" && !g.allstar);
  const next = games.find(g => B.gameState(g) === "upcoming");
  const last = finals[finals.length - 1];
  if (next) {
    const who = next.allstar ? "All-Star Game" : `${esc(next.away_team)} vs ${esc(next.home_team)}`;
    return `Next up: <b>${who}</b> · ${esc(B.dateLabel(next.game_date, { short: true }))} · ${esc(next.game_time)} · <a href="/schedule">Full schedule →</a>`;
  }
  if (last) {
    return `Latest final: <b>${esc(last.away_team)} ${last.away_score} – ${last.home_score} ${esc(last.home_team)}</b> · ${esc(B.dateLabel(last.game_date, { short: true }))} · <a href="/standings">Standings →</a>`;
  }
  return `${CONFIG.siteName} · <a href="/schedule">Schedule</a>`;
}

/* ── render pieces ── */
function navPanelLinks(ids) {
  return ids.map(id => {
    const p = pageById(id);
    return `<a href="${p.path}"${isActive(p) ? ' aria-current="page"' : ""}>
      <span class="ico" aria-hidden="true">${p.icon}</span>
      <span><span class="t">${esc(p.short || p.title)}</span><span class="d">${esc(p.desc)}</span></span>
    </a>`;
  }).join("");
}

function renderHeader() {
  const main = SITE.pages.filter(p => p.nav);
  const menuIds = ["rules", "waiver", "scorecard", "signup"];
  const menuActive = menuIds.concat(["sitemap", "waitlist"]).some(id => PAGE && PAGE.id === id);
  return `
    <a class="skip-link" href="#main">Skip to content</a>
    <div class="site-header">
      <div class="ticker"><div class="wrap">
        <span class="ticker-pill">${esc(CONFIG.season)}</span>
        <span class="ticker-text">${tickerText()}</span>
      </div></div>
      <div class="bar"><div class="wrap">
        <a href="/" class="brand" aria-label="${esc(CONFIG.siteName)} home">
          <span class="brand-mark" aria-hidden="true">⚾</span>
          <span class="brand-copy"><strong>${esc(CONFIG.siteName)}</strong><small>${esc(CONFIG.siteTagline)}</small></span>
        </a>
        <nav class="nav" aria-label="Primary">
          ${main.map(p => `<a class="nav-link" href="${p.path}"${isActive(p) ? ' aria-current="page"' : ""}>${esc(p.short || p.title)}</a>`).join("")}
          <div class="nav-menu" id="nav-menu">
            <button class="nav-menu-btn${menuActive ? " has-active" : ""}" type="button" aria-expanded="false" aria-controls="nav-panel">League ${ICON.caret}</button>
            <div class="nav-panel" id="nav-panel">
              ${navPanelLinks(menuIds)}
              <div class="nav-panel-foot">
                <span>Looking for something else?</span>
                <a href="/sitemap/">Full site map ${ICON.arrow}</a>
              </div>
            </div>
          </div>
        </nav>
        <div class="bar-actions">
          <button class="search-btn" type="button" data-qj-open aria-label="Search the site">${ICON.search}<span>Search</span><kbd>Ctrl K</kbd></button>
          <a class="cta" href="${CONFIG.ctaHref}">${esc(CONFIG.ctaLabel)}</a>
          <button class="icon-btn" id="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu">${ICON.menu}</button>
        </div>
      </div></div>
      <div class="mobile-menu" id="mobile-menu" hidden><div class="wrap">
        ${SITE.groups.map(g => `
          <div class="mm-group"><h4>${esc(g.label)}</h4><div class="mm-links">
            ${SITE.pages.filter(p => p.group === g.id).map(p => `<a href="${p.path}"${isActive(p) ? ' aria-current="page"' : ""}><span aria-hidden="true">${p.icon}</span>${esc(p.short || p.title)}</a>`).join("")}
          </div></div>`).join("")}
        ${TEAM_LIST.length ? `<div class="mm-group"><h4>Teams</h4><div class="mm-teams">
          ${TEAM_LIST.map(t => `<a href="/rosters#team-${t.id}"><span class="dot" style="background:${t.color}"></span>${esc(t.name)}</a>`).join("")}
        </div></div>` : ""}
        <div class="mm-links">
          <a href="/sitemap/"${PAGE && PAGE.id === "sitemap" ? ' aria-current="page"' : ""}><span aria-hidden="true">🧭</span>Site Map</a>
          <a href="${CONFIG.ctaHref}" style="background:linear-gradient(135deg,var(--accent),var(--accent-hi));color:#fff;border:0;">${esc(CONFIG.ctaLabel)}</a>
        </div>
      </div></div>
    </div>`;
}

function renderBottomNav() {
  const tabs = ["home", "schedule", "standings", "stats"].map(pageById);
  return `<nav class="bottom-nav" aria-label="Quick">
    ${tabs.map(p => `<a href="${p.path}"${isActive(p) ? ' aria-current="page"' : ""}>${TAB_ICON[p.id]}<span>${esc(p.short || p.title)}</span></a>`).join("")}
    <button type="button" data-menu-open aria-label="More pages">${ICON.menu}<span>More</span></button>
  </nav>`;
}

function renderRelated() {
  if (!PAGE || PAGE.id === "home" || !PAGE.related) return "";
  const items = PAGE.related.map(pageById).filter(Boolean);
  return `<section class="related no-print" aria-labelledby="related-h"><div class="wrap">
    <div class="section-head"><h2 id="related-h">Keep exploring</h2><a class="more" href="/sitemap/">All pages →</a></div>
    <div class="related-grid">
      ${items.map(p => `<a class="tile" href="${p.path}">
        <span class="tile-icon" aria-hidden="true">${p.icon}</span>
        <span class="tile-title">${esc(p.title)}</span>
        <span class="tile-desc">${esc(p.desc)}</span>
        <span class="tile-go">Open ${esc(p.short || p.title)} →</span>
      </a>`).join("")}
    </div>
  </div></section>`;
}

function renderFooter() {
  const col = g => `<div class="foot-col"><h4>${esc(g.label)}</h4><ul>
    ${SITE.pages.filter(p => p.group === g.id).map(p => `<li><a href="${p.path}">${esc(p.title)}</a></li>`).join("")}
  </ul></div>`;
  return `<footer class="site-footer"><div class="wrap">
    <div class="foot-grid">
      <div class="foot-brand">
        <a href="/" class="brand"><span class="brand-mark" aria-hidden="true">⚾</span><span class="brand-copy"><strong>${esc(CONFIG.siteName)}</strong><small>${esc(CONFIG.siteTagline)}</small></span></a>
        <p>${esc(CONFIG.location)}'s competitive adult baseball league. Real baseball, real competition, no nonsense.</p>
      </div>
      ${SITE.groups.map(col).join("")}
      <div class="foot-col"><h4>Teams</h4><ul>
        ${TEAM_LIST.map(t => `<li><a href="/rosters#team-${t.id}"><span class="dot" style="background:${t.color}"></span>${esc(t.name)}</a></li>`).join("")}
      </ul></div>
    </div>
    <div class="foot-bottom">
      <span>© ${new Date().getFullYear()} ${esc(CONFIG.siteName)} · ${esc(CONFIG.location)} · <a href="/sitemap/">Site map</a></span>
      <a class="powered" href="https://oneby.ai" rel="noopener" target="_blank"><span>Powered by</span><img src="https://7095cda1.logo-46y.pages.dev/logo.svg" alt="Oneby.AI" loading="lazy"></a>
    </div>
  </div></footer>`;
}

/* ── breadcrumbs (+ structured data for Google) ── */
function renderCrumbs() {
  const host = document.querySelector("[data-crumbs]");
  if (!PAGE || PAGE.id === "home") return;
  const trail = [{ name: "Home", path: "/" }];
  const group = SITE.groups.find(g => g.id === PAGE.group);
  if (group) {
    trail.push({ name: group.label, path: "/sitemap/#" + group.id, soft: true });
  }
  trail.push({ name: PAGE.title, path: PAGE.path });

  if (host) {
    host.innerHTML = `<ol class="crumbs">${trail.map((c, i) => i === trail.length - 1
      ? `<li><span aria-current="page">${esc(c.name)}</span></li>`
      : `<li><a href="${c.path}">${esc(c.name)}</a></li>`).join("")}</ol>`;
  }
  const ld = document.createElement("script");
  ld.type = "application/ld+json";
  ld.textContent = JSON.stringify({
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: trail.filter(c => !c.soft).map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: CONFIG.origin + c.path }))
  });
  document.head.appendChild(ld);
}

/* ── Quick Jump search ── */
let QJ_INDEX = null;
let QJ_PLAYERS_LOADED = false;

function buildIndex() {
  const idx = [];
  SITE.pages.forEach(p => idx.push({ group: "Pages", icon: p.icon, title: p.title, desc: p.desc, href: p.path, hay: `${p.title} ${p.short || ""} ${p.desc} ${p.keywords || ""}` }));
  SITE.sections.forEach(s => {
    const p = pageById(s.page);
    idx.push({ group: "Sections", icon: "§", title: s.title, desc: p.title, href: `${p.path}#${s.hash}`, hay: `${s.title} ${p.title} ${s.keywords || ""}` });
  });
  TEAM_LIST.forEach(t => {
    const dot = `<span class="dot" style="background:${t.color}"></span>`;
    idx.push({ group: "Teams", iconHTML: dot, title: t.name, desc: "Roster & top performers", href: `/rosters#team-${t.id}`, hay: `${t.name} team roster` });
    idx.push({ group: "Teams", iconHTML: dot, title: `${t.name} schedule`, desc: "Every game for this team", href: `/schedule?team=${t.id}`, hay: `${t.name} schedule games results` });
  });
  return idx;
}

function loadPlayersIntoIndex() {
  if (QJ_PLAYERS_LOADED || typeof loadData !== "function") return;
  QJ_PLAYERS_LOADED = true;
  loadData("Web_Rosters").then(rows => {
    if (!Array.isArray(rows)) return;
    const seen = new Set();
    rows.forEach(r => {
      const name = (r.full_name || r.player_name || "").trim();
      const teamName = r.team_name || r.team || "";
      if (!name || seen.has(name + teamName)) return;
      seen.add(name + teamName);
      const t = window.BFB && window.BFB.team(r.team_id || teamName);
      QJ_INDEX.push({
        group: "Players",
        iconHTML: `<span class="dot" style="background:${t ? t.color : "#888"}"></span>`,
        title: name, desc: `${teamName} · batting stats`,
        href: `/stats?q=${encodeURIComponent(name)}`,
        hay: `${name} ${teamName} player`
      });
    });
    const input = document.getElementById("qj-input");
    if (input && input.value) qjRender(input.value);
  }).catch(() => { QJ_PLAYERS_LOADED = false; });
}

let qjSel = 0, qjResults = [];

function qjSearch(q) {
  const terms = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!terms.length) {
    // Default view: core pages + teams
    return QJ_INDEX.filter(i => i.group === "Pages").slice(0, 11);
  }
  return QJ_INDEX
    .map(i => {
      const hay = i.hay.toLowerCase(), title = i.title.toLowerCase();
      if (!terms.every(t => hay.includes(t))) return null;
      let score = 0;
      terms.forEach(t => {
        if (title.startsWith(t)) score += 6;
        else if (title.split(/\s+/).some(w => w.startsWith(t))) score += 4;
        else if (title.includes(t)) score += 2;
        else score += 1;
      });
      if (i.group === "Pages") score += 1.5;
      return { i, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, 24)
    .map(x => x.i);
}

function qjRender(q) {
  qjResults = qjSearch(q);
  qjSel = 0;
  const list = document.getElementById("qj-list");
  if (!qjResults.length) {
    list.innerHTML = `<div class="qj-empty">No matches for “${esc(q)}”. <a href="/sitemap/" style="color:var(--gold)">Browse the site map →</a></div>`;
    return;
  }
  let html = "", lastGroup = "";
  qjResults.forEach((r, n) => {
    if (r.group !== lastGroup) { html += `<div class="qj-group">${r.group}</div>`; lastGroup = r.group; }
    html += `<a class="qj-item${n === 0 ? " sel" : ""}" href="${r.href}" data-n="${n}" role="option">
      <span class="ico" aria-hidden="true">${r.iconHTML || r.icon}</span>
      <span class="txt"><span class="t">${esc(r.title)}</span><span class="d">${esc(r.desc)}</span></span>
      <span class="go">${ICON.arrow}</span></a>`;
  });
  list.innerHTML = html;
}

function qjMove(delta) {
  const items = document.querySelectorAll(".qj-item");
  if (!items.length) return;
  items[qjSel] && items[qjSel].classList.remove("sel");
  qjSel = (qjSel + delta + items.length) % items.length;
  items[qjSel].classList.add("sel");
  items[qjSel].scrollIntoView({ block: "nearest" });
}

function qjOpen(prefill) {
  if (!QJ_INDEX) QJ_INDEX = buildIndex();
  loadPlayersIntoIndex();
  const el = document.getElementById("qj");
  const input = document.getElementById("qj-input");
  el.classList.add("open");
  document.body.classList.add("menu-open");
  input.value = prefill || "";
  qjRender(input.value);
  input.focus();
}
function qjClose() {
  document.getElementById("qj").classList.remove("open");
  document.body.classList.remove("menu-open");
}

function renderQuickJump() {
  return `<div class="qj" id="qj" role="dialog" aria-modal="true" aria-label="Search the site">
    <div class="qj-box">
      <label class="qj-input">${ICON.search}
        <input id="qj-input" type="text" placeholder="Search pages, rules, teams, players…" autocomplete="off" spellcheck="false" aria-controls="qj-list">
        <kbd>Esc</kbd>
      </label>
      <div class="qj-list" id="qj-list" role="listbox"></div>
      <div class="qj-foot"><span><kbd>↑</kbd><kbd>↓</kbd>navigate</span><span><kbd>Enter</kbd>open</span><span><kbd>Esc</kbd>close</span></div>
    </div>
  </div>`;
}

function setupQuickJump() {
  const el = document.getElementById("qj");
  const input = document.getElementById("qj-input");
  document.querySelectorAll("[data-qj-open]").forEach(b => b.addEventListener("click", () => qjOpen()));
  el.addEventListener("click", e => { if (e.target === el) qjClose(); });
  input.addEventListener("input", () => qjRender(input.value));
  input.addEventListener("keydown", e => {
    if (e.key === "ArrowDown") { e.preventDefault(); qjMove(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); qjMove(-1); }
    else if (e.key === "Enter") {
      const r = qjResults[qjSel];
      if (r) { e.preventDefault(); qjClose(); location.href = r.href; }
    }
  });
  document.getElementById("qj-list").addEventListener("mousemove", e => {
    const item = e.target.closest(".qj-item");
    if (!item) return;
    const n = Number(item.dataset.n);
    if (n === qjSel) return;
    const items = document.querySelectorAll(".qj-item");
    items[qjSel] && items[qjSel].classList.remove("sel");
    qjSel = n; item.classList.add("sel");
  });
  // Clicking a same-page hash link should still close the dialog
  document.getElementById("qj-list").addEventListener("click", e => { if (e.target.closest(".qj-item")) qjClose(); });

  document.addEventListener("keydown", e => {
    const typing = /input|textarea|select/i.test((e.target.tagName || "")) || e.target.isContentEditable;
    if ((e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey)) { e.preventDefault(); el.classList.contains("open") ? qjClose() : qjOpen(); }
    else if (e.key === "/" && !typing && !el.classList.contains("open")) { e.preventDefault(); qjOpen(); }
    else if (e.key === "Escape" && el.classList.contains("open")) qjClose();
  });

  // Show the right shortcut hint on Mac
  if (/Mac|iPhone|iPad/.test(navigator.platform || "")) {
    document.querySelectorAll(".search-btn kbd").forEach(k => (k.textContent = "⌘K"));
  }
}

/* ── interactions ── */
function setupHeaderInteractions() {
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("mobile-menu");
  const setMenu = open => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.innerHTML = open ? ICON.close : ICON.menu;
    menu.hidden = !open;
    document.body.classList.toggle("menu-open", open);
    if (open) window.scrollTo({ top: 0 });
  };
  toggle.addEventListener("click", () => setMenu(menu.hidden));
  document.querySelectorAll("[data-menu-open]").forEach(b => b.addEventListener("click", () => setMenu(menu.hidden)));
  window.addEventListener("resize", () => { if (window.innerWidth > 900 && !menu.hidden) setMenu(false); });

  const dd = document.getElementById("nav-menu");
  const ddBtn = dd.querySelector(".nav-menu-btn");
  const setDD = open => { dd.classList.toggle("open", open); ddBtn.setAttribute("aria-expanded", String(open)); };
  const canHover = () => matchMedia("(hover:hover)").matches;
  let hoverOpenedAt = 0, closeTimer = null;
  ddBtn.addEventListener("click", e => {
    e.stopPropagation();
    // A click right after hover-open keeps it open instead of toggling it shut
    if (dd.classList.contains("open") && Date.now() - hoverOpenedAt < 600) return;
    setDD(!dd.classList.contains("open"));
  });
  dd.addEventListener("mouseenter", () => {
    if (!canHover()) return;
    clearTimeout(closeTimer);
    if (!dd.classList.contains("open")) { hoverOpenedAt = Date.now(); setDD(true); }
  });
  dd.addEventListener("mouseleave", () => {
    if (!canHover()) return;
    closeTimer = setTimeout(() => setDD(false), 220);
  });
  document.addEventListener("click", e => {
    if (!dd.contains(e.target)) setDD(false);
    if (!menu.hidden && !e.target.closest(".site-header") && !e.target.closest("[data-menu-open]")) setMenu(false);
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") { setDD(false); if (!menu.hidden) setMenu(false); } });
}

/* ── TOC scroll-spy (rules / waiver sidebars) ── */
function setupScrollSpy() {
  const links = [...document.querySelectorAll(".toc a[href^='#']")];
  if (!links.length || !("IntersectionObserver" in window)) return;
  const map = new Map(links.map(a => [a.getAttribute("href").slice(1), a]));
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      links.forEach(l => l.classList.remove("is-active"));
      const a = map.get(en.target.id);
      a && a.classList.add("is-active");
    });
  }, { rootMargin: "-30% 0px -60% 0px" });
  map.forEach((_, id) => { const t = document.getElementById(id); t && obs.observe(t); });
}

/* ── init ── */
document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style");
  style.textContent = HEADER_STYLES;
  document.head.appendChild(style);

  const target = document.getElementById("site-header");
  if (!target) return;
  target.innerHTML = renderHeader();

  const main = document.querySelector("main");
  if (main && !main.id) main.id = "main";

  const tail = document.createElement("div");
  tail.innerHTML = renderRelated() + renderFooter() + renderBottomNav() + renderQuickJump();
  const footerSlot = document.getElementById("site-footer");
  if (footerSlot) footerSlot.replaceWith(...tail.childNodes);
  else document.body.append(...tail.childNodes);

  renderCrumbs();
  setupHeaderInteractions();
  setupQuickJump();
  setupScrollSpy();
});
