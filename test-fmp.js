const FMP_KEY = "NM2iZ28aKd60rTrJnUiVcCY37VtQolYW";

async function test(ticker) {
  const url = `https://financialmodelingprep.com/api/v3/profile/${ticker}?apikey=${FMP_KEY}`;
  const res = await fetch(url);
  const json = await res.json();

  console.log("Raw response:", json);

  if (!Array.isArray(json) || json.length === 0) {
    console.log(`❌ No data for ${ticker}`);
    return;
  }

  const d = json[0];

  console.log({
    ticker,
    lastDiv: d.lastDiv,
    dividendYield: d.dividendYield
  });
}

test("AAPL");
test("O");
