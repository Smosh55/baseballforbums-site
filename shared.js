window.GOOGLE_SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbxFbBzXrtaB9GTRHWrfUTzHtEkUDZoXCd5-hqSZ0UUOMyHmoEFgo5cEWi87duOUt-LO/exec";

// Direct Google Sheets fallback (used when Apps Script standings come back empty/zero)
window.SHEET_ID = "1G9KJsRhLSrlg1nChjs2E2GPBsraygjDlCUdh8r6-opw";

// Cache TTL in milliseconds — 5 minutes
var CACHE_TTL = 5 * 60 * 1000;

var VIEW_MAP = {
  Web_Schedule:    "schedule",
  Web_Rosters:     "rosters",
  Web_Player_Stats:"stats",
  Standings:       "standings"
};

// Maps Google Sheet tab names to their actual tab names for direct CSV fetch
var SHEET_TAB_MAP = {
  "standings":   "Standings",
  "stats":       "Web_Player_Stats",
  "schedule":    "Web_Schedule",
  "rosters":     "Web_Rosters"
};

function cacheKey(view) {
  return "bfb_cache_" + view;
}

function readCache(view) {
  try {
    var raw = sessionStorage.getItem(cacheKey(view));
    if (!raw) return null;
    var entry = JSON.parse(raw);
    if (Date.now() - entry.ts > CACHE_TTL) {
      sessionStorage.removeItem(cacheKey(view));
      return null;
    }
    return entry.data;
  } catch(e) {
    return null;
  }
}

function writeCache(view, data) {
  try {
    sessionStorage.setItem(cacheKey(view), JSON.stringify({ ts: Date.now(), data: data }));
  } catch(e) {}
}

/**
 * Normalize standings rows so column names match what the website JS expects.
 * Google Sheets column headers come through lowercase from the Apps Script.
 *
 * Sheet columns:  team_id | team | gp | w | l | t | rf | ra | diff | win %
 * JS expects:     team    | gp   | w  | l | rs (runs scored) | ra | rd (run diff)
 */
function normalizeStandings(rows) {
  if (!Array.isArray(rows)) return rows;
  return rows.map(function(r) {
    var out = Object.assign({}, r);
    // Runs scored: sheet uses "rf" (runs for), JS expects "rs"
    if (out.rs == null && out.rf != null) out.rs = out.rf;
    if (out.RS == null && out.RF != null) out.RS = out.RF;
    // Run differential: sheet uses "diff", JS expects "rd"
    if (out.rd == null && out.diff != null) out.rd = out.diff;
    if (out.RD == null && out.Diff != null) out.RD = out.Diff;
    // Win percentage alias
    if (out.win_pct == null && out["win %"] != null) out.win_pct = out["win %"];
    return out;
  });
}

/**
 * Check if standings data is actually populated (not all zeros).
 */
function standingsHasData(rows) {
  if (!Array.isArray(rows) || !rows.length) return false;
  return rows.some(function(r) {
    return Number(r.w || r.W || r.wins || 0) > 0 ||
           Number(r.l || r.L || r.losses || 0) > 0;
  });
}

/**
 * Fetch standings directly from Google Sheets CSV as a fallback.
 * This works as long as the sheet is shared as "Anyone with the link can view".
 */
async function fetchStandingsDirect() {
  var tab = encodeURIComponent("Standings");
  var url = "https://docs.google.com/spreadsheets/d/" + window.SHEET_ID +
            "/gviz/tq?tqx=out:json&sheet=" + tab;
  var res = await fetch(url);
  if (!res.ok) throw new Error("Direct sheet fetch failed");
  var text = await res.text();
  // Google wraps JSON in /*O_o*/google.visualization.Query.setResponse(...)
  var jsonStr = text.replace(/^[^{]*/, "").replace(/\);?\s*$/, "");
  var parsed = JSON.parse(jsonStr);
  var cols = parsed.table.cols.map(function(c) {
    return (c.label || c.id || "").toLowerCase().replace(/\s+/g, "_");
  });
  return parsed.table.rows.map(function(row) {
    var obj = {};
    row.c.forEach(function(cell, i) {
      obj[cols[i]] = cell ? cell.v : null;
    });
    return obj;
  });
}

async function fetchRemote(view) {
  var url = window.GOOGLE_SHEETS_ENDPOINT + "?view=" + encodeURIComponent(view);
  var res = await fetch(url, { mode: "cors" });
  if (!res.ok) throw new Error("Failed to fetch remote data (" + res.status + ")");
  return await res.json();
}

/**
 * loadData(viewName, fallbackPath?)
 *
 * Strategy:
 *  1. Return cached data immediately if fresh (< 5 min old).
 *  2. If stale cache exists, return it right away AND kick off a
 *     background refresh so the next page load gets fresh data.
 *  3. If no cache, fetch and wait (first load).
 *  4. For standings: if Apps Script returns empty/zero data, fall back
 *     to reading directly from the Google Sheet.
 *
 * Concurrent calls for the same view share one request.
 */
var _inflight = {};

function loadData(viewName, fallbackPath) {
  var view = VIEW_MAP[viewName] || viewName;
  if (!_inflight[view]) {
    _inflight[view] = _loadData(view, fallbackPath);
    _inflight[view].catch(function() { delete _inflight[view]; });
  }
  return _inflight[view];
}

async function _loadData(view, fallbackPath) {
  var cached = readCache(view);

  if (cached) {
    // Kick off background refresh — don't await it
    fetchRemote(view).then(function(fresh) {
      writeCache(view, fresh);
    }).catch(function() {});
    // For standings, still normalize even from cache
    return view === "standings" ? normalizeStandings(cached) : cached;
  }

  // No cache — must wait for the network
  if (window.GOOGLE_SHEETS_ENDPOINT) {
    try {
      var data = await fetchRemote(view);

      // For standings: if Apps Script returned empty/zero data, try direct fetch
      if (view === "standings" && !standingsHasData(data)) {
        try {
          var direct = await fetchStandingsDirect();
          if (standingsHasData(direct)) {
            data = direct;
          }
        } catch(e) {
          // Direct fetch failed — stick with Apps Script data
        }
      }

      if (view === "standings") data = normalizeStandings(data);
      writeCache(view, data);
      return data;

    } catch(err) {
      // Apps Script failed entirely — try direct sheet fetch for standings
      if (view === "standings") {
        try {
          var direct2 = await fetchStandingsDirect();
          var normalized = normalizeStandings(direct2);
          writeCache(view, normalized);
          return normalized;
        } catch(e2) {}
      }

      if (fallbackPath) {
        var res2 = await fetch(fallbackPath);
        if (!res2.ok) throw new Error("Failed to fetch fallback data (" + res2.status + ")");
        return await res2.json();
      }
      throw err;
    }
  }

  if (fallbackPath) {
    var res3 = await fetch(fallbackPath);
    if (!res3.ok) throw new Error("Failed to fetch fallback data (" + res3.status + ")");
    return await res3.json();
  }

  throw new Error("No data source configured");
}

/**
 * Call window.clearStandingsCache() in the browser console if standings
 * appear stale after updating the sheet.
 */
window.clearStandingsCache = function() {
  sessionStorage.removeItem("bfb_cache_standings");
  location.reload();
};

/**
 * Warm up the connection to the Apps Script host as early as possible.
 */
(function preconnect() {
  try {
    var l = document.createElement("link");
    l.rel  = "preconnect";
    l.href = "https://script.google.com";
    document.head.appendChild(l);

    var l2 = document.createElement("link");
    l2.rel  = "dns-prefetch";
    l2.href = "https://script.google.com";
    document.head.appendChild(l2);
  } catch(e) {}
})();


/* ================================================================
   LEAGUE DATA — single source of truth for teams + schedule.
   Every page reads from here, so edit teams/games in ONE place.
================================================================ */

var TEAMS = [
  { id: "renegades",  name: "Renegades",  color: "#f5c542" },
  { id: "see-ya",     name: "See Ya!",    color: "#4da3ff" },
  { id: "hurricanes", name: "Hurricanes", color: "#3ee8d8" },
  { id: "elite",      name: "Elite",      color: "#ff8080" },
  { id: "legends",    name: "Legends",    color: "#c084fc" },
  { id: "cut-fresh",  name: "Cut Fresh",  color: "#4cdb8a" }
];

/* ================================================================
   BALANCED SCHEDULE — Spring 2026

   Dates 1–5: Full round-robin (every team plays every other team once)
     All on Saturday nights (Motzei Shabbos)
   Dates 6–7: Rematches (★) — both on Tuesday nights
   Date 8: Playoffs / Semifinals (Motzei Shabbos June 6)
   Date 9: Championship (Motzei Shabbos June 13 — teams & field TBD; first seed picks field)
   Date 10: All-Star Game (Sunday June 14 · 8:00 PM · field TBD)

   To push status updates (Final / Live / Postponed) from Google Sheets,
   update the Web_Schedule tab — sheet results overlay this base schedule.
================================================================ */
var BASE_SCHEDULE = [
  // Date 1 · Motzei Shabbos April 18 · 9:30 PM
  { game_date:"2026-04-18", game_time:"9:30 PM",  away_team:"Cut Fresh",   home_team:"Renegades",  field:"Field 1", status:"Final", away_score:17, home_score:3 },
  { game_date:"2026-04-18", game_time:"9:30 PM",  away_team:"Legends",     home_team:"See Ya!",    field:"Field 2", status:"Final", away_score:5,  home_score:7 },
  { game_date:"2026-04-18", game_time:"9:30 PM",  away_team:"Elite",       home_team:"Hurricanes", field:"Field 3", status:"Final", away_score:9,  home_score:10 },

  // Date 2 · Motzei Shabbos April 25 · 9:30 PM
  { game_date:"2026-04-25", game_time:"9:30 PM",  away_team:"Hurricanes",  home_team:"See Ya!",    field:"Field 1", status:"Final", away_score:4,  home_score:9 },
  { game_date:"2026-04-25", game_time:"9:30 PM",  away_team:"Elite",       home_team:"Cut Fresh",  field:"Field 2", status:"Final", away_score:5,  home_score:7 },
  { game_date:"2026-04-25", game_time:"9:30 PM",  away_team:"Legends",     home_team:"Renegades",  field:"Field 3", status:"Final", away_score:42, home_score:6 },

  // Date 3 · Motzei Shabbos May 2 · 9:30 PM
  { game_date:"2026-05-02", game_time:"9:30 PM",  away_team:"Hurricanes",  home_team:"Legends",    field:"Field 1", status:"Final", away_score:15, home_score:5 },
  { game_date:"2026-05-02", game_time:"9:30 PM",  away_team:"Elite",       home_team:"Renegades",  field:"Field 2", status:"Final", away_score:8,  home_score:19 },
  { game_date:"2026-05-02", game_time:"9:30 PM",  away_team:"See Ya!",     home_team:"Cut Fresh",  field:"Field 3", status:"Final", away_score:12, home_score:16 },

  // Date 4 · Motzei Shabbos May 9 · 9:30 PM
  { game_date:"2026-05-09", game_time:"9:30 PM",  away_team:"See Ya!",     home_team:"Elite",      field:"Field 1", status:"Final", away_score:4,  home_score:5 },
  { game_date:"2026-05-09", game_time:"9:30 PM",  away_team:"Hurricanes",  home_team:"Renegades",  field:"Field 2", status:"Final", away_score:19, home_score:11 },
  { game_date:"2026-05-09", game_time:"9:30 PM",  away_team:"Cut Fresh",   home_team:"Legends",    field:"Field 3", status:"Final", away_score:10, home_score:19 },

  // Date 5 · Motzei Shabbos May 16 · 10:00 PM
  { game_date:"2026-05-16", game_time:"10:00 PM", away_team:"Legends",     home_team:"Elite",      field:"Field 1", status:"Final", away_score:11, home_score:7 },
  { game_date:"2026-05-16", game_time:"10:00 PM", away_team:"Cut Fresh",   home_team:"Hurricanes", field:"Field 2", status:"Final", away_score:1,  home_score:4 },
  { game_date:"2026-05-16", game_time:"10:00 PM", away_team:"See Ya!",     home_team:"Renegades",  field:"Field 3", status:"Final", away_score:23, home_score:6 },

  // Date 6 · Tuesday May 26 · Rematches ★
  { game_date:"2026-05-26", game_time:"9:30 PM",  away_team:"See Ya!",     home_team:"Elite",      field:"Field 1", status:"Final", away_score:4,  home_score:0,  rematch:true },
  { game_date:"2026-05-26", game_time:"9:30 PM",  away_team:"Renegades",   home_team:"Legends",    field:"Field 2", status:"Final", away_score:19, home_score:16, rematch:true },
  { game_date:"2026-05-26", game_time:"10:00 PM", away_team:"Hurricanes",  home_team:"Cut Fresh",  field:"Field 3", status:"Final", away_score:9,  home_score:13, rematch:true },

  // Date 7 · Tuesday June 2 · Rematches ★
  { game_date:"2026-06-02", game_time:"10:00 PM", away_team:"Renegades",   home_team:"Cut Fresh",  field:"Field 1", status:"Final", away_score:4,  home_score:9,  rematch:true },
  { game_date:"2026-06-02", game_time:"10:00 PM", away_team:"See Ya!",     home_team:"Hurricanes", field:"Field 2", status:"Final", away_score:6,  home_score:9,  rematch:true },
  { game_date:"2026-06-02", game_time:"10:00 PM", away_team:"Elite",       home_team:"Legends",    field:"Field 3", status:"Final", away_score:12, home_score:14, rematch:true },

  // Date 8 · Motzei Shabbos June 6 · Playoffs ★ (Semifinals)
  { game_date:"2026-06-06", game_time:"10:00 PM", away_team:"Hurricanes",  home_team:"Legends",    field:"Field 1", status:"Scheduled", playoff:true },
  { game_date:"2026-06-06", game_time:"10:00 PM", away_team:"Cut Fresh",   home_team:"See Ya!",    field:"Field 2", status:"Scheduled", playoff:true },

  // Date 9 · Motzei Shabbos June 13 · Championship ★ (teams & field TBD — first seed picks field)
  { game_date:"2026-06-13", game_time:"10:00 PM", away_team:"TBD",         home_team:"TBD",        field:"TBD",     status:"Scheduled", championship:true },

  // Date 10 · Sunday June 14 · All-Star Game ★ (field TBD)
  { game_date:"2026-06-14", game_time:"8:00 PM",  away_team:"All-Stars",   home_team:"All-Stars",  field:"TBD",     status:"Scheduled", allstar:true }
];

var FIELDS = {
  "Field 1": { cls: "f1", label: "Left Field" },
  "Field 2": { cls: "f2", label: "Right Field" },
  "Field 3": { cls: "f3", label: "Small Field" }
};

window.BFB = (function() {
  var byName = {}, byId = {};
  TEAMS.forEach(function(t) { byName[t.name.toLowerCase()] = t; byId[t.id] = t; });

  function team(nameOrId) {
    var k = String(nameOrId || "").trim();
    return byId[k] || byName[k.toLowerCase()] || null;
  }
  function teamColor(name) {
    var t = team(name);
    return t ? t.color : "rgba(255,255,255,0.28)";
  }
  function slugify(v) {
    return String(v || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function num(v) { var n = Number(v); return isNaN(n) ? 0 : n; }
  function fmtRate(v) {
    var n = Number(v || 0);
    if (isNaN(n)) return "—";
    return n >= 1 ? n.toFixed(3) : n.toFixed(3).replace(/^0/, "");
  }
  function fmtInt(v) { var n = Number(v || 0); return isNaN(n) ? "—" : String(n); }
  function fmtRD(v) { var n = num(v); return n > 0 ? "+" + n : String(n); }
  function rdClass(v) { var n = num(v); return n > 0 ? "pos" : n < 0 ? "neg" : "zero"; }

  // Accepts "2026-04-18" or "4/18/2026" → "2026-04-18"
  function isoDate(v) {
    if (!v) return "";
    var s = String(v).trim();
    var m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (m) return m[1] + "-" + ("0" + m[2]).slice(-2) + "-" + ("0" + m[3]).slice(-2);
    m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (m) return m[3] + "-" + ("0" + m[1]).slice(-2) + "-" + ("0" + m[2]).slice(-2);
    return s;
  }
  function localDate(iso) {
    var p = isoDate(iso).split("-").map(Number);
    return p.length === 3 ? new Date(p[0], p[1] - 1, p[2]) : null;
  }
  function dateLabel(iso, opts) {
    var d = localDate(iso);
    if (!d || isNaN(d)) return iso || "TBD";
    var weekday = d.toLocaleDateString("en-US", { weekday: (opts && opts.short) ? "short" : "long" });
    var rest = d.toLocaleDateString("en-US", (opts && opts.short)
      ? { month: "short", day: "numeric" }
      : { month: "long", day: "numeric", year: "numeric" });
    if (weekday.indexOf("Sat") === 0) return (opts && opts.short ? "Motzei Shabbos · " : "Motzei Shabbos, ") + rest;
    return weekday + (opts && opts.short ? " · " : ", ") + rest;
  }
  function isPast(iso) {
    var d = localDate(iso);
    if (!d) return false;
    var today = new Date(); today.setHours(0, 0, 0, 0);
    return d < today;
  }

  // Derived game state: final | live | postponed | pending (date passed, no result) | upcoming
  function gameState(g) {
    var s = String(g.status || "").toLowerCase();
    if (s.indexOf("live") > -1 || s.indexOf("progress") > -1) return "live";
    if (s.indexOf("final") > -1 || s.indexOf("complete") > -1) return "final";
    if (s.indexOf("postpone") > -1 || s.indexOf("cancel") > -1) return "postponed";
    return isPast(g.game_date) ? "pending" : "upcoming";
  }
  var STATE_LABEL = { final: "Final", live: "Live", postponed: "Postponed", pending: "Result pending", upcoming: "Scheduled" };

  function pairKey(date, a, b) {
    return isoDate(date) + "|" + [String(a).toLowerCase(), String(b).toLowerCase()].sort().join("|");
  }

  /* Overlay sheet results onto the base schedule.
     Matches by date + the two teams (either home/away orientation) and maps
     scores by team name, so a flipped home/away in the sheet can't swap scores.
     A sheet row never downgrades a Final game back to Scheduled. */
  function mergeSchedule(base, sheet) {
    if (!Array.isArray(sheet) || !sheet.length) return base;
    var map = {};
    sheet.forEach(function(r) {
      map[pairKey(r.game_date || r.date, r.away_team, r.home_team)] = r;
    });
    return base.map(function(g) {
      var r = map[pairKey(g.game_date, g.away_team, g.home_team)];
      if (!r) return g;
      var st = String(r.status || "").toLowerCase();
      var hasScores = r.away_score !== "" && r.away_score != null && r.home_score !== "" && r.home_score != null;
      var sheetFinal = st.indexOf("final") > -1 || st.indexOf("complete") > -1;
      var sheetLiveOrPpd = /live|progress|postpone|cancel/.test(st);
      var out = Object.assign({}, g);
      if (hasScores && (sheetFinal || sheetLiveOrPpd)) {
        var sameOrientation = String(r.away_team).toLowerCase() === String(g.away_team).toLowerCase();
        out.away_score = Number(sameOrientation ? r.away_score : r.home_score);
        out.home_score = Number(sameOrientation ? r.home_score : r.away_score);
        out.status = r.status;
      } else if (sheetLiveOrPpd && gameState(g) !== "final") {
        out.status = r.status;
      }
      return out;
    });
  }

  function isFeatured(g) { return !!(g.playoff || g.championship || g.allstar); }

  function winner(g) {
    if (gameState(g) !== "final" || g.away_score == null || g.home_score == null) return null;
    if (g.away_score > g.home_score) return g.away_team;
    if (g.home_score > g.away_score) return g.home_team;
    return null;
  }

  // Latest schedule: base + live sheet overlay. Resolves with the base if the sheet fails.
  function loadSchedule() {
    return loadData("Web_Schedule")
      .then(function(sheet) { return mergeSchedule(BASE_SCHEDULE, sheet); })
      .catch(function() { return BASE_SCHEDULE; });
  }

  function qs(name) {
    try { return new URLSearchParams(location.search).get(name) || ""; } catch (e) { return ""; }
  }

  return {
    TEAMS: TEAMS, FIELDS: FIELDS, SCHEDULE: BASE_SCHEDULE,
    team: team, teamColor: teamColor, slugify: slugify, esc: esc, num: num,
    fmtRate: fmtRate, fmtInt: fmtInt, fmtRD: fmtRD, rdClass: rdClass,
    isoDate: isoDate, dateLabel: dateLabel, isPast: isPast,
    gameState: gameState, STATE_LABEL: STATE_LABEL, mergeSchedule: mergeSchedule,
    isFeatured: isFeatured, winner: winner, loadSchedule: loadSchedule, qs: qs
  };
})();
