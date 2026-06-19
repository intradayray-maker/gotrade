const FINNHUB_API_KEY = "d8q93i9r01qr03ng06vgd8q93i9r01qr03ng0700";

async function test(ticker) {
  const url = `https://finnhub.io/api/v1/stock/dividend?symbol=${ticker}&token=${FINNHUB_API_KEY}`;
  const res = await fetch(url);
  const json = await res.json();

  console.log("Raw response:", json);

  if (!Array.isArray(json) || json.length === 0) {
    console.log(`❌ No dividend data for ${ticker}`);
    return;
  }

  const d = json[0];

  const amount = d.amount ?? 0;
  const frequency = d.frequency ?? 1;
  const annual = amount * frequency;

  console.log({
    ticker,
    amount,
    frequency,
    annualDividend: annual
  });
}

test("AAPL");
test("O");
