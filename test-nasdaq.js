// Node 24 has global fetch. No imports needed.

async function getLastDividend(ticker) {
  const url = `https://api.nasdaq.com/api/quote/${ticker}/dividends?assetclass=stocks`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0" // required by Nasdaq
    }
  });

  const json = await res.json();

  const rows = json?.data?.dividends?.rows;

  if (!rows || rows.length === 0) {
    console.log(`❌ No dividend data for ${ticker}`);
    return null;
  }

  const last = rows[0];
  const lastDiv = parseFloat(last.amount);

  return { ticker, lastDiv };
}

(async () => {
  console.log(await getLastDividend("AAPL"));
  console.log(await getLastDividend("O"));
})();
