export function calculateNewEquity(
  previousEquity: number,
  side: "buy" | "sell",
  qty: number,
  fillPrice: number
) {
  const tradeValue = qty * fillPrice;

  if (side === "buy") {
    // Buying reduces free equity (cash)
    return previousEquity - tradeValue;
  } else {
    // Selling increases free equity (cash)
    return previousEquity + tradeValue;
  }
}
