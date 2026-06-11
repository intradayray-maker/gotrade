"use client";

import { useState, useMemo } from "react";
import GTSlider from "@/app/components/ui/GTSlider";

export default function YTMarketingTool() {

  // ==========================
  // ⭐ UNIVERSAL NUMBER FORMATTER
  // ==========================
  const fmt = (num: number, decimals = 0) => {
    return Number(num.toFixed(decimals)).toLocaleString();
  };

  // ==========================
  // ⭐ CORE LEVERS
  // ==========================
  const [channels, setChannels] = useState(3);
  const [videosPerDayPerChannel, setVideosPerDayPerChannel] = useState(2);

  const daysPerMonth = 31;

  // ==========================
  // ⭐ YOUTUBE PERFORMANCE
  // ==========================
  const [viewsPerVideo, setViewsPerVideo] = useState(1500);
  const [rpm, setRpm] = useState(7);
  const [ctrToGoTrade, setCtrToGoTrade] = useState(0.7);
  const [signupConversion, setSignupConversion] = useState(12);

  // ⭐ NEW: Average video length
  const [videoLength, setVideoLength] = useState(8);

  // ==========================
  // ⭐ GOTRADE ECONOMICS
  // ==========================
  const [valuePerUser, setValuePerUser] = useState(40);

  // ==========================
  // ⭐ EXPENSES
  // ==========================
  const [aiVoiceCost, setAiVoiceCost] = useState(25);
  const [openClawCost, setOpenClawCost] = useState(60);
  const [videoEditingCost, setVideoEditingCost] = useState(0);

  // ==========================
  // ⭐ DERIVED METRICS
  // ==========================
  const {
    totalVideosPerMonth,
    totalViewsPerMonth,
    ytRevenue,
    clicksToGoTrade,
    signups,
    goTradeRevenue,
    totalRevenue,
    totalExpenses,
    netProfit,
    revenuePerView,
    revenuePerVideo,
    revenuePerChannel
  } = useMemo(() => {

    // ⭐ VIDEO LENGTH → RPM MULTIPLIER
    let rpmAdjusted = rpm;

    if (videoLength < 4) rpmAdjusted = rpm * 0.6;
    else if (videoLength < 8) rpmAdjusted = rpm * 1.0;
    else if (videoLength < 12) rpmAdjusted = rpm * 1.4;
    else rpmAdjusted = rpm * 1.6;

    const totalVideosPerMonth = channels * videosPerDayPerChannel * daysPerMonth;
    const totalViewsPerMonth = totalVideosPerMonth * viewsPerVideo;

    const ytRevenue = (totalViewsPerMonth / 1000) * rpmAdjusted;
    const clicksToGoTrade = totalViewsPerMonth * (ctrToGoTrade / 100);
    const signups = clicksToGoTrade * (signupConversion / 100);
    const goTradeRevenue = signups * valuePerUser;

    const totalRevenue = ytRevenue + goTradeRevenue;
    const totalExpenses = aiVoiceCost + openClawCost + videoEditingCost;
    const netProfit = totalRevenue - totalExpenses;

    const revenuePerView =
      totalViewsPerMonth > 0 ? totalRevenue / totalViewsPerMonth : 0;

    const revenuePerVideo =
      totalVideosPerMonth > 0 ? totalRevenue / totalVideosPerMonth : 0;

    const revenuePerChannel =
      channels > 0 ? totalRevenue / channels : 0;

    return {
      totalVideosPerMonth,
      totalViewsPerMonth,
      ytRevenue,
      clicksToGoTrade,
      signups,
      goTradeRevenue,
      totalRevenue,
      totalExpenses,
      netProfit,
      revenuePerView,
      revenuePerVideo,
      revenuePerChannel
    };
  }, [
    channels,
    videosPerDayPerChannel,
    daysPerMonth,
    viewsPerVideo,
    rpm,
    ctrToGoTrade,
    signupConversion,
    valuePerUser,
    aiVoiceCost,
    openClawCost,
    videoEditingCost,
    videoLength
  ]);

  return (
    <section className="space-y-3">

      {/* ==========================
         HEADER
         ========================== */}
      <div className="flex flex-col space-y-2">

        {/* Summary badges */}
        <div className="flex flex-wrap mt-0 gap-2 mb-0 p-0 justify-center">

          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            {fmt(totalVideosPerMonth)} videos / month
          </span>

          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30">
            {fmt(totalViewsPerMonth)} views / month
          </span>

          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-500/10 text-yellow-300 border border-yellow-500/30">
            {fmt(signups)} GoTrade signups / month
          </span>

          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
            Net ${fmt(netProfit)} / month
          </span>

        </div>
      </div>



      {/* ==========================
         CHANNEL & OUTPUT PLAN (BLUE)
         ========================== */}
      <div className="rounded-xl border border-emerald-500/20 bg-[#05070b] p-4 mb-4 mt-0 gap-3">

        <div className="flex items-center justify-center gap-20 mb-7">

          {/* Channels */}
          <div className="flex items-center gap-3">

            <span className="text-[13px] font-semibold text-slate-500 whitespace-nowrap">
              # of Channels
            </span>

            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setChannels(n)}
                  className={`
                    w-9 h-9 flex items-center justify-center rounded-full text-sm font-semibold
                    transition-all duration-200
                    ${channels === n
                      ? "bg-blue-500/20 text-blue-300 border border-blue-400 shadow-[0_0_10px_rgba(0,102,255,0.6)]"
                      : "bg-black/30 text-slate-400 border border-blue-400/20 hover:bg-blue-500/10"}
                  `}
                >
                  {n}
                </button>
              ))}
            </div>

          </div>

          {/* Videos Per Day */}
          <div className="flex items-center gap-3">

            <span className="text-[13px] font-semibold text-slate-500 whitespace-nowrap">
               Daily Videos per Channel
            </span>

            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  onClick={() => setVideosPerDayPerChannel(n)}
                  className={`
                    w-9 h-9 flex items-center justify-center rounded-full text-sm font-semibold
                    transition-all duration-200
                    ${videosPerDayPerChannel === n
                      ? "bg-blue-500/20 text-blue-300 border border-blue-400 shadow-[0_0_10px_rgba(0,102,255,0.6)]"
                      : "bg-black/30 text-slate-400 border border-blue-400/20 hover:bg-blue-500/10"}
                  `}
                >
                  {n}
                </button>
              ))}
            </div>

          </div>
        </div>

      {/* ==========================
         YOUTUBE PERFORMANCE (GREEN)
         ========================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-1">

        <div className="rounded-lg border border-emerald-400/40 shadow-[0_0_5px_rgba(16,185,129,0.35)] bg-black/20 p-2">
          <GTSlider
            title="Average views per video"
            value={viewsPerVideo}
            min={200}
            max={100000}
            step={100}
            onChange={setViewsPerVideo}
          />
        </div>

        <div className="rounded-lg border border-emerald-400/40 shadow-[0_0_5px_rgba(16,185,129,0.35)] bg-black/20 p-2">
          <GTSlider
            title="RPM (per 1k views) ($7 my channel)"
            value={rpm}
            min={3}
            max={20}
            step={0.5}
            onChange={setRpm}
            dollars
          />
        </div>

        <div className="rounded-lg border border-emerald-400/40 shadow-[0_0_5px_rgba(16,185,129,0.35)] bg-black/20 p-2">
          <GTSlider
            title="Click‑through to GoTrade (0.6%–0.8%)"
            value={ctrToGoTrade}
            min={0.1}
            max={3}
            step={0.1}
            onChange={setCtrToGoTrade}
            percent
          />
        </div>

        <div className="rounded-lg border border-emerald-400/40 shadow-[0_0_5px_rgba(16,185,129,0.35)] bg-black/20 p-2">
          <GTSlider
            title="GoTrade signup conversion (12–18%)"
            value={signupConversion}
            min={5}
            max={30}
            step={1}
            onChange={setSignupConversion}
            percent
          />
        </div>

        <div className="rounded-lg border border-emerald-400/40 shadow-[0_0_5px_rgba(16,185,129,0.35)] bg-black/20 p-2">
          <GTSlider
            title="Value per GoTrade user"
            value={valuePerUser}
            min={5}
            max={150}
            step={5}
            onChange={setValuePerUser}
            dollars
          />
        </div>

        {/* ⭐ NEW SLIDER — fully integrated */}
        <div className="rounded-lg border border-emerald-400/40 shadow-[0_0_5px_rgba(16,185,129,0.35)] bg-black/20 p-2">
          <GTSlider
            title="Average video length (minutes)"
            value={videoLength}
            min={1}
            max={20}
            step={1}
            onChange={setVideoLength}
          />
        </div>

      </div>

      {/* ==========================
         MONTHLY AI EXPENSES (RED)
         ========================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4 mb-5">

        <div className="rounded-lg border border-[rgb(84,33,33)] shadow-[0_0_5px_rgba(84,33,33,0.35)] bg-black/20 p-4">
          <GTSlider
            title="AI Voice (ElevenLabs, etc.)"
            value={aiVoiceCost}
            min={0}
            max={150}
            step={5}
            onChange={setAiVoiceCost}
            dollars
          />
        </div>

        <div className="rounded-lg border border-[rgb(84,33,33)] shadow-[0_0_5px_rgba(84,33,33,0.35)] bg-black/20 p-4">
          <GTSlider
            title="OpenClaw (AI video generation)"
            value={openClawCost}
            min={0}
            max={200}
            step={5}
            onChange={setOpenClawCost}
            dollars
          />
        </div>

        <div className="rounded-lg border border-[rgb(84,33,33)] shadow-[0_0_5px_rgba(84,33,33,0.35)] bg-black/20 p-4">
          <GTSlider
            title="Video editing (extra tools / help)"
            value={videoEditingCost}
            min={0}
            max={300}
            step={10}
            onChange={setVideoEditingCost}
            dollars
          />
        </div>

      </div>



      {/* ==========================
          RIGHT SIDE SUMMARY GRID (3 horizontal sections)
         ========================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* SECTION A — Monthly Revenue Summary */}
        <div className="rounded-xl border border-emerald-500/30 bg-[#05070b] p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400 text-center">
            Monthly Revenue Summary
          </p>

          <div className="mt-3 space-y-3">

            <div className="flex justify-between items-center p-3 rounded-lg border border-emerald-500/20 bg-black/20">
              <span className="text-slate-500">YT Ad Revenue:</span>
              <span className="text-xl font-semibold text-emerald-300 tabular-nums">
                ${fmt(ytRevenue)}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg border border-emerald-500/20 bg-black/20">
              <span className="text-slate-500">GoTrade Signups:</span>
              <span className="text-xl font-semibold text-emerald-300 tabular-nums">
                ${fmt(goTradeRevenue)}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg border border-emerald-500/20 bg-black/20">
              <span className="text-slate-500">Total Revenue:</span>
              <span className="text-2xl font-bold text-emerald-300 tabular-nums">
                ${fmt(totalRevenue)}
              </span>
            </div>

          </div>
        </div>



        {/* SECTION B — Monthly Expenses & Net Profit */}
        <div className="rounded-xl border border-red-500/20 bg-[#09060a] p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400 text-center">
            Monthly Expenses & Net Profit
          </p>

          <div className="mt-3 space-y-3">

            <div className="flex justify-between items-center p-3 rounded-lg border border-red-500/20 bg-black/20">
              <span className="text-slate-500">Total AI Tools:</span>
              <span className="text-xl font-bold text-rose-300 tabular-nums">
                -${fmt(totalExpenses)}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg border border-red-500/20 bg-black/20">
              <span className="text-slate-500">Net Profit:</span>
              <span
                className={`text-2xl font-bold tabular-nums ${
                  netProfit >= 0 ? "text-emerald-300" : "text-red-400"
                }`}
              >
                ${fmt(netProfit)}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg border border-slate-700/50 bg-black/20">
              <span className="text-slate-500">Clicks → GoTrade:</span>
              <span className="text-[18px] font-bold text-blue-300 tabular-nums">
                {fmt(clicksToGoTrade)} / m
              </span>
            </div>

          </div>
        </div>



        {/* SECTION C — Efficiency Metrics */}
        <div className="rounded-xl border border-slate-700/60 bg-[#05060a] p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400 text-center">
            Efficiency Metrics
          </p>

          <div className="mt-3 space-y-3">

            <div className="flex justify-between items-center p-3 rounded-lg border border-slate-700/50 bg-black/20">
              <span className="text-slate-500">Revenue per view:</span>
              <span className="text-xl font-bold text-emerald-300 tabular-nums">
                ${fmt(revenuePerView, 4)}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg border border-slate-700/50 bg-black/20">
              <span className="text-slate-500">Revenue per video:</span>
              <span className="text-xl font-bold text-emerald-300 tabular-nums">
                ${fmt(revenuePerVideo)}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg border border-slate-700/50 bg-black/20">
              <span className="text-slate-500">Revenue per channel:</span>
              <span className="text-xl font-bold text-emerald-300 tabular-nums">
                ${fmt(revenuePerChannel)}
              </span>
            </div>
       </div>
          </div>
        </div>
      </div> {/* end 3-column summary grid */}

    </section>
  );
}

