async function getLastDividend(ticker) {
  const url = "https://raw.githubusercontent.com/IntradayRay-Maker/public-dividends/main/dividends.json";

  const res = await fetch(url);
  const json = await res.json();

  const data = json[ticker];

  if (!data) {
    console.log(`❌ No dividend data for ${ticker}`);
    return null;
  }

  return { ticker, lastDiv: data.lastDiv };
}

(async () => {
  console.log(await getLastDividend("AAPL"));
  console.log(await getLastDividend("O"));
})();
