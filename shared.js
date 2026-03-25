window.GOOGLE_SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbxFbBzXrtaB9GTRHWrfUTzHtEkUDZoXCd5-hqSZ0UUOMyHmoEFgo5cEWi87duOUt-LO/exec";

async function loadData(viewName, fallbackPath = null) {
  const map = {
    Web_Schedule: "schedule",
    Web_Rosters: "rosters",
    Web_Player_Stats: "stats",
    Standings: "standings"
  };

  const view = map[viewName] || viewName;

  if (window.GOOGLE_SHEETS_ENDPOINT) {
    const url = `${window.GOOGLE_SHEETS_ENDPOINT}?view=${encodeURIComponent(view)}`;
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) {
      throw new Error(`Failed to fetch remote data (${res.status})`);
    }
    return await res.json();
  }

  if (fallbackPath) {
    const res = await fetch(fallbackPath);
    if (!res.ok) {
      throw new Error(`Failed to fetch fallback data (${res.status})`);
    }
    return await res.json();
  }

  throw new Error("No data source configured");
}