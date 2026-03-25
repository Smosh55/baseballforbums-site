const GOOGLE_ENDPOINT = window.GOOGLE_SHEETS_ENDPOINT || "https://script.googleusercontent.com/macros/echo?user_content_key=AWDtjMXoBOV2fGCynmT4giffMbd6ZB2UchKvjBxVn5T78nQ_UMRn25vpItVX2JHIJvG1m2EkEULWgSqXRvEzRBhLliB4iNk6CI9JY8jbj6qVFnRE3ow5mt1TnaKt4yK_IRcJOic7aTVBkOuIdCaTUl6GOmwswbPGIEel9dSUtPIH_Ymd1WVf9YMTDaExKBxJuUUx2SL4XdO9lrbAF0XazAhOo-_g72rySlO46kALpVHv946BszLSbROGCAxq1o8_xCZeg_EvuTmXNDqbmgFSPfEA0OhFiQh8dA&lib=MKbm9YOGkD3DUziKlwIE4N2CZ_t_9oIdE";
async function loadData(sheetName, localPath) {
  if (GOOGLE_ENDPOINT) {
    const url = `${GOOGLE_ENDPOINT}?sheet=${encodeURIComponent(sheetName)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${sheetName}`);
    return await res.json();
  }
  const res = await fetch(localPath);
  if (!res.ok) throw new Error(`Failed to fetch ${localPath}`);
  return await res.json();
}