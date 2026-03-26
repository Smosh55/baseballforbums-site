window.GOOGLE_SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbxFbBzXrtaB9GTRHWrfUTzHtEkUDZoXCd5-hqSZ0UUOMyHmoEFgo5cEWi87duOUt-LO/exec";

// Cache TTL in milliseconds — 5 minutes
var CACHE_TTL = 5 * 60 * 1000;

var VIEW_MAP = {
  Web_Schedule:    "schedule",
  Web_Rosters:     "rosters",
  Web_Player_Stats:"stats",
  Standings:       "standings"
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
  } catch(e) {
    // sessionStorage full or unavailable — silently skip
  }
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
 */
async function loadData(viewName, fallbackPath) {
  var view   = VIEW_MAP[viewName] || viewName;
  var cached = readCache(view);

  if (cached) {
    // Kick off background refresh — don't await it
    fetchRemote(view).then(function(fresh) {
      writeCache(view, fresh);
    }).catch(function() {});
    return cached;
  }

  // No cache — must wait for the network
  if (window.GOOGLE_SHEETS_ENDPOINT) {
    try {
      var data = await fetchRemote(view);
      writeCache(view, data);
      return data;
    } catch(err) {
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
 * Warm up the connection to the Apps Script host as early as possible.
 * This is injected into <head> automatically by the preconnect tag in each page,
 * but we also trigger a lightweight DNS prefetch here as a fallback.
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