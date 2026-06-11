"use client"

import { DemoProvider } from "./demoState"
import DemoDirectorPanel from "./DemoDirectorPanel"

import AiCard from "./cards/AiCard"
import MiddleCard from "./cards/MiddleCard"
import TradeOutputCard from "./cards/TradeOutputCard"

import DemoBarSlider from "./components/DemoBarSlider"
import DemoAIVolumeSlider from "./components/DemoAIVolumeSlider"

export default function AdminDemoPage() {
  return (
    <DemoProvider>

      <div className="flex h-screen w-full bg-[#02030a] text-slate-100 relative">

        {/* LEFT: CARDS + SLIDERS */}
        <div className="flex flex-col flex-1 gap-8 px-8 pr-32 pt-6 pb-12 max-w-[1300px] ml-0 mr-auto">

          {/* 3 CARDS */}
          <div className="grid grid-cols-3 gap-6">
            <div className="min-h-[320px]">
              <AiCard />
            </div>

            <div className="min-h-[320px]">
              <MiddleCard />
            </div>

            <div className="min-h-[320px]">
              <TradeOutputCard />
            </div>
          </div>

          {/* SLIDERS — COMPACT HEIGHT */}
          <div className="grid grid-cols-2 gap-6 mt-0">

            <div className="h-[90px] flex items-center">

              <DemoAIVolumeSlider />
            </div>

            <div className="h-[90px] flex items-center">

              <DemoBarSlider />
            </div>

          </div>

        </div>

        {/* FLOATING DIRECTOR PANEL */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2">
          <DemoDirectorPanel />
        </div>

      </div>

    </DemoProvider>
  )
}
