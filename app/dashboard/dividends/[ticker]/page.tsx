import { getTickerData } from "@/lib/data-providers"
import { computeSafetyScore } from "@/lib/safety-score"

import DividendAiCard from "./DividendAiCard"
import DividendMetricsCard from "./DividendMetricsCard"
import DividendProjectionCard from "./DividendProjectionCard"

export default async function Page({
  params,
}: {
  params: { ticker: string }
}) {
  const ticker = params.ticker.toUpperCase()

  const data = await getTickerData(ticker)
  const safetyScore = computeSafetyScore(data)

  const fullData = { ...data, safetyScore }

  return (
    <div className="flex flex-col gap-8">
      <DividendAiCard ticker={ticker} />
      <DividendMetricsCard data={fullData} />
      <DividendProjectionCard ticker={ticker} />
    </div>
  )
}
