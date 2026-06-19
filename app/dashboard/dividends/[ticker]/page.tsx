import { getTickerData } from "@/lib/data-providers"
import { computeSafetyScore } from "@/lib/safety-score"

import DividendAiCard from "./DividendAiCard"
import DividendMetricsCard from "./DividendMetricsCard"
import DividendProjectionCard from "./DividendProjectionCard"

type PageProps = {
  params: { ticker: string }
}

export default async function DividendPage({ params }: PageProps) {
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
