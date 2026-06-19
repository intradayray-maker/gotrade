// Node 24 has global fetch. No imports needed.

async function getLastDividend(ticker) {
  const url = `https://sandbox.iexapis.com/stable/stock/${ticker}/dividends/1y?token=Tpk_123`;

  const res = await fetch(url);
  const json = await res.json();

  if (!Array.isArray(json) || json.length === 0) {
    console.log(`❌ No dividend data for ${ticker}`);
    return null;
  }

  // IEX returns: [{ amount: 0.24, exDate: "2024-02-09", ... }]
  const last = json[0];
  const lastDiv = last.amount;

  return { ticker, lastDiv };
}

(async () => {
  console.log(await getLastDividend("AAPL"));
  console.log(await getLastDividend("O"));
})();
