const GOOGLE_ENDPOINT = window.GOOGLE_SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbxFbBzXrtaB9GTRHWrfUTzHtEkUDZoXCd5-hqSZ0UUOMyHmoEFgo5cEWi87duOUt-LO/exec";
    const url = `${GOOGLE_ENDPOINT}?sheet=${encodeURIComponent(sheetName)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${sheetName}`);
    return await res.json();
  }
  const res = await fetch(localPath);
  if (!res.ok) throw new Error(`Failed to fetch ${localPath}`);
  return await res.json();
}