async function test(ticker) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1y`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      "Accept": "application/json",
      "Accept-Language": "en-US,en;q=0.9"
    }
  });

  const json = await res.json();

  const result = json.chart?.result?.[0];
  if (!result) {
    console.log("❌ No result for", ticker);
    return;
  }

  const events = result.events;
  if (!events || !events.dividends) {
    console.log(`❌ No dividend data for ${ticker}`);
    return;
  }

  const dividends = events.dividends;
  const lastKey = Object.keys(dividends).pop();
  const lastDiv = dividends[lastKey].amount;

  console.log({
    ticker,
    lastDiv
  });
}

test("AAPL");
test("O");
