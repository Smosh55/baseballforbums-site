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
 */
async function loadData(viewName, fallbackPath) {
  var view   = VIEW_MAP[viewName] || viewName;
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
